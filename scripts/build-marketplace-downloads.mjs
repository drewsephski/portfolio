import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { stripMarketplaceSeo } from "./marketplace-template-seo.mjs";

const root = process.cwd();
const downloads = join(root, "private", "downloads");
const products = ["equilibrium", "palomar", "axon", "vesper", "nexora", "next-layer-of-intelligence", "convix", "vantage", "meridian", "infranex", "salix", "dreammotion", "agentlab", "fusion-ai"];
const assetDirectories = { infranex: "infranex", salix: "salix", dreammotion: "dreammotion", agentlab: "agentlab", "fusion-ai": "fusionai", vantage: "vantage" };
const localFontProducts = new Set(["axon", "convix", "agentlab"]);

const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const starterPackage = {
  name: "pontail-template",
  version: "1.0.0",
  private: true,
  scripts: { dev: "next dev", build: "next build", start: "next start" },
  dependencies: packageJson.dependencies,
  devDependencies: packageJson.devDependencies,
};

await mkdir(downloads, { recursive: true });

for (const slug of products) {
  const temp = await mkdtemp(join(tmpdir(), `pontail-${slug}-`));
  const project = join(temp, slug);
  const routeDirectory = join(project, "app", "(template)");
  await mkdir(routeDirectory, { recursive: true });
  await cp(join(root, "app", slug), routeDirectory, { recursive: true });
  if (localFontProducts.has(slug)) {
    await cp(join(root, "app", "fonts"), join(project, "app", "fonts"), { recursive: true });
  }
  for (const shared of ["bold-arrow-link.tsx", "bold-arrow-link.module.css", "globals.css"]) {
    await cp(join(root, "app", shared), join(project, "app", shared));
  }
  for (const config of ["postcss.config.mjs", "tsconfig.json"]) {
    await cp(join(root, config), join(project, config));
  }
  await writeFile(join(project, "next.config.ts"), `import type { NextConfig } from "next";\nconst nextConfig: NextConfig = {};\nexport default nextConfig;\n`);
  await writeFile(join(project, "app", "layout.tsx"), `import type { Metadata } from "next";\nimport type { ReactNode } from "react";\nimport "./globals.css";\n\nexport const metadata: Metadata = { title: "${slug} template" };\nexport default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n`);
  await writeFile(join(project, "package.json"), `${JSON.stringify(starterPackage, null, 2)}\n`);
  await writeFile(join(project, "README.md"), `# ${slug} Next.js template\n\nRun \`pnpm install\`, then \`pnpm dev\`. This package contains the route source and its local assets. Replace the sample brand, copy, and links before publishing.\n`);

  const assetDirectory = assetDirectories[slug];
  if (assetDirectory) {
    const source = join(root, "public", assetDirectory);
    try { await cp(source, join(project, "public", assetDirectory), { recursive: true }); } catch {}
  }

  const sourceFiles = await readdir(join(project, "app"), { recursive: true });
  const referencedAssets = new Set();
  for (const file of sourceFiles.filter((name) => /\.(tsx|css)$/.test(name))) {
    const path = join(project, "app", file);
    const original = await readFile(path, "utf8");
    const contents = stripMarketplaceSeo(original, slug);
    if (contents !== original) await writeFile(path, contents);
    for (const match of contents.matchAll(/["'(](\/[A-Za-z0-9_./@-]+\.(?:png|jpe?g|webp|svg|mp4|webm|woff2?))/gi)) referencedAssets.add(match[1]);
  }
  for (const asset of referencedAssets) {
    const source = join(root, "public", asset);
    const destination = join(project, "public", asset);
    try { await mkdir(dirname(destination), { recursive: true }); await cp(source, destination); } catch {}
  }

  const archive = join(downloads, `${slug}-nextjs.zip`);
  await rm(archive, { force: true });
  execFileSync("zip", ["-qr", archive, basename(project)], { cwd: temp });
  await rm(temp, { recursive: true, force: true });
}

console.log(`Built ${products.length} marketplace archives in ${downloads}`);
