import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const source = JSON.parse(await readFile("docs/research/infranex.framer.ai/extracted-desktop.json", "utf8"));
const urls = [...new Set(source.assets.images.map((image) => image.src).filter((url) => url.startsWith("http")))];
const output = "public/infranex";
await mkdir(output, { recursive: true });

for (let index = 0; index < urls.length; index += 4) {
  await Promise.all(urls.slice(index, index + 4).map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed ${response.status}: ${url}`);
    const pathname = new URL(url).pathname;
    const extension = path.extname(pathname) || ".bin";
    const filename = `${createHash("sha1").update(url).digest("hex").slice(0, 12)}${extension}`;
    await writeFile(path.join(output, filename), Buffer.from(await response.arrayBuffer()));
  }));
}

console.log(`Downloaded ${urls.length} unique Infranex assets.`);
