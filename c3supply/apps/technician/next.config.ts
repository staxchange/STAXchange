import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: { cpus: 1, workerThreads: false },
  transpilePackages: [
    "@stax/deployment-switchboard",
    "@stax/authz",
    "@stax/commands",
    "@stax/service-interface",
    "@stax/technician-portal",
    "@stax/service-billing",
    "@stax/parts-inventory",
    "@stax/ui"
  ]
};

export default nextConfig;
