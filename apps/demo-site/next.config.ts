import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@behavior-analytics/tracker", "@behavior-analytics/types"],
};

export default nextConfig;
