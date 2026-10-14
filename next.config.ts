import type { NextConfig } from "next";
import { siteUrl } from "./lib/site";

const nextConfig: NextConfig = {
  redirects() {
    return [
      ...["www.drewsepeczi.xyz", "portfolio.drewsepeczi.xyz"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${siteUrl}/:path*`,
        statusCode: 301 as const,
      })),
      ...["privacy", "terms", "sms-opt-in"].map((slug) => ({
        source: `/${slug}.html`,
        destination: `/${slug}`,
        statusCode: 301,
      })),
    ];
  },
  outputFileTracingIncludes: {
    "/api/downloads/*": ["./private/downloads/**/*.zip"],
  },
};

export default nextConfig;
