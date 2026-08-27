import { mkdir, writeFile } from "node:fs/promises";
import { extname } from "node:path";

const assets = [
  ["logo.svg", "https://framerusercontent.com/images/6iiCqv1dfXdUEl9tZO01AnFvD8I.svg"],
  ["hero-orbit.svg", "https://framerusercontent.com/images/moVvtNfD7ggIlDd44uwH5HnZY.svg?width=1262&height=546"],
  ["hero-dashboard.png", "https://framerusercontent.com/images/rt6SOkAmqTdlfeAmoNwZRnxEv94.png?scale-down-to=2048&width=3108&height=2367"],
  ["trusted-logo-1.svg", "https://framerusercontent.com/images/FDpxDa03ClBEByKBKP6iTL6llM.svg?width=99&height=28"],
  ["trusted-logo-2.svg", "https://framerusercontent.com/images/g6mxoyC4FApR4PIFw8uo1NfZdA.svg?width=135&height=26"],
  ["trusted-logo-3.svg", "https://framerusercontent.com/images/yDkZOVum39QSY48ocf7Wpsw.svg?width=111&height=29"],
  ["trusted-logo-4.svg", "https://framerusercontent.com/images/UFPYtPkXrPSRPWO9O347rVFAc08.svg?width=119&height=27"],
  ["power-task.png", "https://framerusercontent.com/images/X3iaZVNGFBZOzEYBIFlYe1WfQsQ.png?scale-down-to=512"],
  ["power-visits.png", "https://framerusercontent.com/images/boFaae3Rv1TJpKwfeZNdJeKdiSg.png?scale-down-to=512&width=1011&height=918"],
  ["power-reporting.png", "https://framerusercontent.com/images/Uyyw0W5jrqjYQHo9AMawhW2QE.png?scale-down-to=512&width=1011&height=918"],
  ["tool-automation.png", "https://framerusercontent.com/images/UrfW42NgE7UTVCq6QNMjmLBo.png?scale-down-to=1024"],
  ["tool-deals.png", "https://framerusercontent.com/images/IUTubiwF665oxQnds1iiOAqnPU.png?scale-down-to=512"],
  ["tool-crm.png", "https://framerusercontent.com/images/wmNA5BgEgfMaueIo8R5NJ0XYeDQ.png?scale-down-to=512&width=1677&height=1320"],
  ["analytics-scheduler.png", "https://framerusercontent.com/images/wmGAc39plHaddK9wkR8454gmO14.png?scale-down-to=1024&width=3508&height=1936"],
  ["analytics-territory.png", "https://framerusercontent.com/images/37tt0V7upPHiMLcMsUzxjXMfhhE.png?scale-down-to=1024&width=2236&height=1760"],
  ["analytics-enrichment.png", "https://framerusercontent.com/images/lrhbJLykqThcEsF91vNa1Hs5f3A.png?scale-down-to=1024&width=2236&height=1700"],
  ["review-shon.png", "https://framerusercontent.com/images/7imFpDQxLEecmLMyXNh78qts.png?width=512&height=513"],
  ["review-mark.png", "https://framerusercontent.com/images/6pyimxr7K9iRoEMSrpqX5oPBQ7E.png"],
  ["cta-dashboard.png", "https://framerusercontent.com/images/VkN4zawbkNne1p4FlxB1A4eqjag.png?width=2549&height=1942"],
  ["favicon.svg", "https://framerusercontent.com/images/LfcrEVjG0Tv7M22SEsigTXom2w.svg"],
];

await mkdir("public/salix", { recursive: true });
for (let index = 0; index < assets.length; index += 4) {
  await Promise.all(assets.slice(index, index + 4).map(async ([name, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!extname(name)) throw new Error(`Missing extension: ${name}`);
    await writeFile(`public/salix/${name}`, bytes);
  }));
}

console.log(`Downloaded ${assets.length} Salix assets.`);
