import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assets = JSON.parse(
  await (await import("node:fs/promises")).readFile(
    new URL("../docs/research/dreammotion-bundle.json", import.meta.url),
    "utf8",
  ),
).assets.filter((asset) => asset.kind === "image" && asset.url.startsWith("http"));

const output = new URL("../public/dreammotion/assets/", import.meta.url);
await mkdir(output, { recursive: true });

async function download(asset) {
  const response = await fetch(asset.url);
  if (!response.ok) throw new Error(`${response.status} ${asset.url}`);
  const extension = path.extname(new URL(asset.url).pathname) || ".bin";
  await writeFile(new URL(`${asset.id}${extension}`, output), Buffer.from(await response.arrayBuffer()));
}

for (let index = 0; index < assets.length; index += 4) {
  await Promise.all(assets.slice(index, index + 4).map(download));
}

console.log(`Downloaded ${assets.length} DreamMotion assets.`);
