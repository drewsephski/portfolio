import { mkdir, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../public/fusionai/integrations/", import.meta.url);
const logos = {
  slack: "https://svgl.app/library/slack.svg",
  notion: "https://svgl.app/library/notion.svg",
  hubspot: "https://cdn.simpleicons.org/hubspot",
  dropbox: "https://svgl.app/library/dropbox.svg",
  salesforce: "https://svgl.app/library/salesforce.svg",
  whatsapp: "https://svgl.app/library/whatsapp-icon.svg",
  gmail: "https://svgl.app/library/gmail.svg",
};

await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  Object.entries(logos).map(async ([name, url]) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unable to download ${name}: ${response.status} ${response.statusText}`);
    }

    await writeFile(new URL(`${name}.svg`, outputDirectory), Buffer.from(await response.arrayBuffer()));
  }),
);
