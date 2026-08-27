import Image from "next/image";

type ProductVisualKind =
  | "sitterfolio"
  | "voice"
  | "crm"
  | "agent"
  | "crawl"
  | "design";

const visuals: Record<ProductVisualKind, { src: string; width: number; height: number }> = {
  sitterfolio: { src: "/assets/bento-premium/sitterfolio.webp", width: 1672, height: 940 },
  voice: { src: "/assets/bento-premium/vault-zero.webp", width: 1903, height: 826 },
  crm: { src: "/assets/bento-premium/vault-zero-crm.webp", width: 1881, height: 836 },
  agent: { src: "/assets/bento-premium/squid-agent.webp", width: 1791, height: 878 },
  crawl: { src: "/assets/bento-premium/squidcrawl.webp", width: 1942, height: 809 },
  design: { src: "/assets/bento-premium/phoenix-design-lab.webp", width: 1905, height: 826 },
};

export function ProductCardVisual({ kind, loading = "lazy" }: { kind: ProductVisualKind; loading?: "eager" | "lazy" }) {
  const visual = visuals[kind];

  return (
    <Image
      alt=""
      aria-hidden="true"
      draggable={false}
      height={visual.height}
      loading={loading}
      sizes="(max-width: 700px) calc(100vw - 72px), 520px"
      src={visual.src}
      width={visual.width}
    />
  );
}
