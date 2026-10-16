// Sync all 41,100 verified Cloudflare R2 floorplan URLs from facts/units.jsonl
// into Supabase units table (floor_plan_urls)

import fs from "fs";
import readline from "readline";

const SUPABASE_URL = "https://bkobicnsvyijpdhymngb.supabase.co";
const SERVICE_KEY = "<YOUR_SUPABASE_SERVICE_ROLE_KEY>";
const FILE_PATH = "/Users/nihal/Downloads/dealos_r2_data/facts/units.jsonl";

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates",
};

async function main() {
  console.log("================================================================================");
  console.log("🚀 Syncing 41,100 Cloudflare R2 Floorplans into Supabase Units Table...");
  console.log("================================================================================");

  const fileStream = fs.createReadStream(FILE_PATH);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let batch = [];
  let totalUpdated = 0;
  const BATCH_SIZE = 500;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const item = JSON.parse(line);
    const unitId = Number(item.unit_id);
    const match = item.feitenkaart_tekst?.match(/Plattegrond:\s*(https:\/\/pub-[^\s]+?\.webp)/);
    if (!unitId || !match) continue;

    const floorplanUrl = match[1];
    batch.push({
      id: unitId,
      floor_plan_urls: [floorplanUrl],
    });

    if (batch.length >= BATCH_SIZE) {
      await sendBatch(batch);
      totalUpdated += batch.length;
      process.stdout.write(`  [Sync] ${totalUpdated} floorplan URLs updated in Supabase...\r`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await sendBatch(batch);
    totalUpdated += batch.length;
  }

  console.log(`\n✅ SUCCESS: Synced ${totalUpdated} verified Cloudflare R2 floorplans into Supabase!`);
}

async function sendBatch(records) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/units`, {
    method: "POST",
    headers,
    body: JSON.stringify(records),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`\n[Error] Batch upsert failed: ${err.slice(0, 300)}`);
  }
}

main().catch(console.error);
