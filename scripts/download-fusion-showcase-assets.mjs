import { mkdir, writeFile } from "node:fs/promises";

const assets = {
  "../public/fusionai/fusion-hero-background.mp4": "https://framerusercontent.com/assets/Bax1SXv4b9QI33bMvkicABKnI.mp4",
  "../public/fusionai/chat-showcase-mobile.png": "https://framerusercontent.com/images/JvSbWQlPTNqa6sLHVMbkbF3gmE.png?width=2280&height=1612",
  "../public/fusionai/industries/customer-support.png": "https://framerusercontent.com/images/9YTqFHuM8NChDkE1s1hYzrNN348.png?width=160&height=160",
  "../public/fusionai/industries/healthcare.png": "https://framerusercontent.com/images/jgZpfC5YLyyidHutUnAZQi0GhaE.png?width=160&height=160",
  "../public/fusionai/industries/marketing.png": "https://framerusercontent.com/images/eR3kBTkIWJkm3IGwQ1k5UJrO2go.png?width=160&height=160",
  "../public/fusionai/industries/education.png": "https://framerusercontent.com/images/uQI7pUHkORj7Reqfwlz5RvIiME.png?width=160&height=160",
  "../public/fusionai/industries/finance.png": "https://framerusercontent.com/images/voeJuivo56UxnoWnMSNI8SsdfQ.png?width=160&height=160",
};

await Promise.all(
  Object.entries(assets).map(async ([relativePath, url]) => {
    const destination = new URL(relativePath, import.meta.url);
    await mkdir(new URL("./", destination), { recursive: true });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to download ${url}: ${response.status}`);
    await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  }),
);
