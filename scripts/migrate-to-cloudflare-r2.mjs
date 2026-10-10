import { createHmac, createHash } from "crypto";

const ACCOUNT_ID = "cbff1a08a3b2c9cf3b0198ed9dbb0029";
const ACCESS_KEY = "e235c136b605bb82d319338a0e95ce9d";
const SECRET_KEY = "a12f5cf327fa34d583fd03840045d3603b17b846497b8ecde632cc3a1cf8552f";
const BUCKET = "dealos-vault";
const PUBLIC_R2_URL = "https://pub-f6d1184c524b460699f4a87f4b1278b0.r2.dev";
const R2_HOST = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;

const SUPABASE_URL = "https://bkobicnsvyijpdhymngb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrb2JpY25zdnlpanBkaHltbmdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDcwNDU5MywiZXhwIjoyMTA2MjgwNTkzfQ.AxXdLT47GDPxqzBJJ_rroIEMtp_deuY8H6luSmY2vc8";
const UPSTREAM_S3 = "https://reelly-backend.s3.amazonaws.com/";

const dbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
  const kRegion = createHmac("sha256", kDate).update(regionName).digest();
  const kService = createHmac("sha256", kRegion).update(serviceName).digest();
  return createHmac("sha256", kService).update("aws4_request").digest();
}

async function uploadToR2(key, buffer, contentType) {
  const date = new Date();
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";

  const payloadHash = createHash("sha256").update(buffer).digest("hex");
  const canonicalHeaders = `host:${R2_HOST}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = `PUT\n/${BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${createHash("sha256").update(canonicalRequest).digest("hex")}`;
  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, region, service);
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const authHeader = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${R2_HOST}/${BUCKET}/${key}`, {
    method: "PUT",
    headers: {
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      "Authorization": authHeader,
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`R2 Upload failed (${res.status}): ${errText}`);
  }

  return `${PUBLIC_R2_URL}/${key}`;
}

function toUpstreamUrl(urlOrPath) {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith(PUBLIC_R2_URL)) return null; // reeds gemigreerd
  if (urlOrPath.startsWith("/media/")) {
    return `${UPSTREAM_S3}${urlOrPath.slice("/media/".length)}`;
  }
  if (urlOrPath.includes("reelly-backend.s3.amazonaws.com/")) {
    return urlOrPath;
  }
  return null;
}

function toCleanKey(urlOrPath) {
  if (!urlOrPath) return null;
  let clean = urlOrPath;
  if (clean.startsWith("/media/")) clean = clean.slice("/media/".length);
  else if (clean.startsWith(UPSTREAM_S3)) clean = clean.slice(UPSTREAM_S3.length);
  else if (clean.includes("reelly-backend.s3.amazonaws.com/")) clean = clean.split("reelly-backend.s3.amazonaws.com/")[1];
  return clean.replace(/^\/+/, "").replace(/[^a-zA-Z0-9_\-\.\/]/g, "_");
}

async function migrateAsset(sourceUrl, r2Key) {
  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || (
      r2Key.endsWith(".pdf") ? "application/pdf" :
      r2Key.endsWith(".webp") ? "image/webp" :
      r2Key.endsWith(".png") ? "image/png" :
      r2Key.endsWith(".jpg") || r2Key.endsWith(".jpeg") ? "image/jpeg" :
      "application/octet-stream"
    );
    const buffer = Buffer.from(await res.arrayBuffer());
    return await uploadToR2(r2Key, buffer, contentType);
  } catch (err) {
    console.error(`Fout bij download/upload ${sourceUrl}:`, err.message);
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
  console.log("\n=======================================================");
  console.log("📂 1. MIGREREN VAN ALLE PDF BROCHURES & FLOORPLANS");
  console.log("=======================================================");
  const files = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/project_files?select=id,name,type,url&url=not.is.null&order=id&limit=1000&offset=${from}`, { headers: dbHeaders });
    const batch = await res.json();
    files.push(...batch);
    if (batch.length < 1000) break;
  }
  const toMigrate = files.filter(f => f.url && !f.url.startsWith(PUBLIC_R2_URL));
  console.log(`Totaal documenten: ${files.length} | Te migreren: ${toMigrate.length}`);

  let done = 0;
  let success = 0;
  await runPool(toMigrate, 12, async (file) => {
    const upstream = toUpstreamUrl(file.url);
    const key = toCleanKey(file.url);
    if (upstream && key) {
      const r2Key = `files/${key}`;
      const publicUrl = await migrateAsset(upstream, r2Key);
      if (publicUrl) {
        await fetch(`${SUPABASE_URL}/rest/v1/project_files?id=eq.${file.id}`, {
          method: "PATCH",
          headers: { ...dbHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ url: publicUrl }),
        });
        success++;
      }
    }
    done++;
    if (done % 50 === 0 || done === toMigrate.length) {
      console.log(`[PDF Files] ${done}/${toMigrate.length} verwerkt (${success} succesvol in Cloudflare R2)...`);
    }
  });
  console.log(`✅ [PDF Files Voltooid] ${success} van ${toMigrate.length} staan nu in Cloudflare R2!`);
}

async function migrateProjectCovers() {
  console.log("\n=======================================================");
  console.log("🖼️ 2. MIGREREN VAN ALLE PROJECT COVERAFBEELDINGEN");
  console.log("=======================================================");
  const projects = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id,name,cover_image_url&cover_image_url=not.is.null&order=id&limit=1000&offset=${from}`, { headers: dbHeaders });
    const batch = await res.json();
    projects.push(...batch);
    if (batch.length < 1000) break;
  }
  const toMigrate = projects.filter(p => p.cover_image_url && !p.cover_image_url.startsWith(PUBLIC_R2_URL));
  console.log(`Totaal projecten: ${projects.length} | Te migreren covers: ${toMigrate.length}`);

  let done = 0;
  let success = 0;
  await runPool(toMigrate, 12, async (project) => {
    const upstream = toUpstreamUrl(project.cover_image_url);
    const key = toCleanKey(project.cover_image_url);
    if (upstream && key) {
      const r2Key = `covers/${key}`;
      const publicUrl = await migrateAsset(upstream, r2Key);
      if (publicUrl) {
        await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${project.id}`, {
          method: "PATCH",
          headers: { ...dbHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ cover_image_url: publicUrl }),
        });
        success++;
      }
    }
    done++;
    if (done % 50 === 0 || done === toMigrate.length) {
      console.log(`[Covers] ${done}/${toMigrate.length} verwerkt (${success} succesvol in Cloudflare R2)...`);
    }
  });
  console.log(`✅ [Covers Voltooid] ${success} van ${toMigrate.length} staan nu in Cloudflare R2!`);
}

async function main() {
  const t0 = Date.now();
  console.log("🚀 START VOLLEDIGE DEALOS MIGRATIE NAAR CLOUDFLARE R2...");
  console.log(`Target Bucket: ${BUCKET} (${PUBLIC_R2_URL})`);
  await migrateProjectFiles();
  await migrateProjectCovers();
  const durationSec = Math.round((Date.now() - t0) / 1000);
  console.log(`\n🎉 ALLE MEDIA IS 100% SUCCESVOL GEMIGREERD IN ${durationSec}s!`);
}

main().catch(console.error);
