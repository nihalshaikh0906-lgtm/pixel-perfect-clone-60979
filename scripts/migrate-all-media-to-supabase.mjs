const SUPABASE_URL = "https://bkobicnsvyijpdhymngb.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrb2JpY25zdnlpanBkaHltbmdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDcwNDU5MywiZXhwIjoyMTA2MjgwNTkzfQ.AxXdLT47GDPxqzBJJ_rroIEMtp_deuY8H6luSmY2vc8";
const BUCKET = "dealos-vault";
const UPSTREAM_S3 = "https://reelly-backend.s3.amazonaws.com/";

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

function toUpstreamUrl(urlOrPath) {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith(SUPABASE_URL)) return null;
  if (urlOrPath.startsWith("/media/")) {
    return `${UPSTREAM_S3}${urlOrPath.slice("/media/".length)}`;
  }
  if (urlOrPath.includes("reelly-backend.s3.amazonaws.com/")) {
    return urlOrPath;
  }
  return null;
}

function toStorageKey(urlOrPath) {
  if (!urlOrPath) return null;
  let clean = urlOrPath;
  if (clean.startsWith("/media/")) {
    clean = clean.slice("/media/".length);
  } else if (clean.startsWith(UPSTREAM_S3)) {
    clean = clean.slice(UPSTREAM_S3.length);
  } else if (clean.includes("reelly-backend.s3.amazonaws.com/")) {
    clean = clean.split("reelly-backend.s3.amazonaws.com/")[1];
  }
  return clean.replace(/^\/+/, "").replace(/[^a-zA-Z0-9_\-\.\/]/g, "_");
}

async function uploadToStorage(storageKey, buffer, contentType) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storageKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: buffer,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed (${res.status}): ${errText}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storageKey}`;
}

async function migrateAsset(sourceUrl, storageKey) {
  try {
    const upstreamRes = await fetch(sourceUrl);
    if (!upstreamRes.ok) return null;
    const contentType = upstreamRes.headers.get("content-type") || (
      storageKey.endsWith(".pdf") ? "application/pdf" :
      storageKey.endsWith(".webp") ? "image/webp" :
      storageKey.endsWith(".png") ? "image/png" :
      storageKey.endsWith(".jpg") || storageKey.endsWith(".jpeg") ? "image/jpeg" :
      "application/octet-stream"
    );
    const buffer = Buffer.from(await upstreamRes.arrayBuffer());
    return await uploadToStorage(storageKey, buffer, contentType);
  } catch (err) {
    return null;
  }
}

async function runPool(items, concurrency, fn) {
  let index = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const current = items[index++];
      await fn(current);
    }
  });
  await Promise.all(workers);
}

async function migrateProjectFiles() {
  console.log("\n=== 1. OPHALEN & MIGREREN PROJECT FILES (PDF'S & FLOORPLANS) ===");
  const files = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/project_files?select=id,name,type,url&url=not.is.null&order=id&limit=1000&offset=${from}`, { headers });
    const batch = await res.json();
    files.push(...batch);
    if (batch.length < 1000) break;
  }
  console.log(`Totaal project files in database: ${files.length}`);
  const toMigrate = files.filter(f => f.url && !f.url.startsWith(SUPABASE_URL));
  console.log(`Nog te migreren naar dealos-vault: ${toMigrate.length}`);

  let done = 0;
  let successful = 0;
  await runPool(toMigrate, 12, async (file) => {
    const upstream = toUpstreamUrl(file.url);
    const key = toStorageKey(file.url);
    if (upstream && key) {
      const publicUrl = await migrateAsset(upstream, `files/${key}`);
      if (publicUrl) {
        await fetch(`${SUPABASE_URL}/rest/v1/project_files?id=eq.${file.id}`, {
          method: "PATCH",
          headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ url: publicUrl }),
        });
        successful++;
      }
    }
    done++;
    if (done % 50 === 0 || done === toMigrate.length) {
      console.log(`[PDF Files] ${done}/${toMigrate.length} verwerkt (${successful} geüpload naar dealos-vault)...`);
    }
  });
  console.log(`[Klaar] ${successful} PDF's succesvol verplaatst naar je eigen dealos-vault!`);
}

async function migrateProjectCovers() {
  console.log("\n=== 2. OPHALEN & MIGREREN PROJECT COVERFOTO'S ===");
  const projects = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id,name,cover_image_url&cover_image_url=not.is.null&order=id&limit=1000&offset=${from}`, { headers });
    const batch = await res.json();
    projects.push(...batch);
    if (batch.length < 1000) break;
  }
  console.log(`Totaal projecten met cover: ${projects.length}`);
  const toMigrate = projects.filter(p => p.cover_image_url && !p.cover_image_url.startsWith(SUPABASE_URL));
  console.log(`Nog te migreren covers: ${toMigrate.length}`);

  let done = 0;
  let successful = 0;
  await runPool(toMigrate, 12, async (project) => {
    const upstream = toUpstreamUrl(project.cover_image_url);
    const key = toStorageKey(project.cover_image_url);
    if (upstream && key) {
      const publicUrl = await migrateAsset(upstream, `covers/${key}`);
      if (publicUrl) {
        await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${project.id}`, {
          method: "PATCH",
          headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ cover_image_url: publicUrl }),
        });
        successful++;
      }
    }
    done++;
    if (done % 50 === 0 || done === toMigrate.length) {
      console.log(`[Covers] ${done}/${toMigrate.length} verwerkt (${successful} geüpload naar dealos-vault)...`);
    }
  });
  console.log(`[Klaar] ${successful} Covers succesvol verplaatst naar je eigen dealos-vault!`);
}

async function main() {
  const t0 = Date.now();
  console.log("🚀 Start DealOS Vault Migratie (Native zero-dependency)...");
  await migrateProjectFiles();
  await migrateProjectCovers();
  console.log(`\n✅ ALLES COMPLEET Gemigreerd in ${Math.round((Date.now() - t0) / 1000)}s!`);
}

main().catch(console.error);
