import fs from "fs";
import fetch from "node-fetch";

const sites = JSON.parse(fs.readFileSync("sites.json", "utf8"));
const results = [];

async function checkSite(url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { timeout: 8000 });
    const time = Date.now() - start;
    if (!res.ok) return { url, status: res.status, ok: false, time };
    return { url, status: res.status, ok: true, time };
  } catch (e) {
    return { url, status: "timeout/ssl", ok: false };
  }
}

const run = async () => {
  for (const site of sites) {
    const result = await checkSite(site);
    results.push(result);
  }

  fs.writeFileSync("status.json", JSON.stringify(results, null, 2));
};

run();
