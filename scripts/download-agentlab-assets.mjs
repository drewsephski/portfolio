import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const extraction = JSON.parse(await readFile(new URL("../docs/research/agentlab-desktop-extraction.json", import.meta.url), "utf8"));
const urls = [...new Set([...extraction.images.map((item) => item.src), ...extraction.videos.flatMap((item) => [item.src, item.poster]), ...extraction.backgrounds.flatMap((item) => item.bg.match(/https?:[^\"')]+/g) ?? [])].filter((url) => url?.startsWith("http")))];
const destination = new URL("../public/agentlab/", import.meta.url);
await mkdir(destination, { recursive: true });
const manifest = {};
for (let index = 0; index < urls.length; index += 4) {
  await Promise.all(urls.slice(index, index + 4).map(async (url, batchIndex) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    const pathname = new URL(url).pathname;
    const extension = path.extname(pathname) || ".bin";
    const filename = `asset-${String(index + batchIndex + 1).padStart(3, "0")}${extension}`;
    await writeFile(new URL(filename, destination), Buffer.from(await response.arrayBuffer()));
    manifest[url] = `/agentlab/${filename}`;
  }));
}
await writeFile(new URL("manifest.json", destination), JSON.stringify(manifest, null, 2));
console.log(`Downloaded ${Object.keys(manifest).length} AgentLab assets.`);
