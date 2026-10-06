import type { NextConfig } from "next";
import { siteUrl } from "./lib/site";

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.drewsepeczi.xyz" }],
        destination: `${siteUrl}/:path*`,
        statusCode: 301,
      },
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
