import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/downloads/*": ["./private/downloads/**/*.zip"],
  },
};

export default nextConfig;
