import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: { cpus: 1, workerThreads: false },
  transpilePackages: [
    "@stax/accounting-handoff",
    "@stax/commerce-billing",
    "@stax/supplier-purchasing",
    "@stax/fulfillment",
    "@stax/stripe-payments",
    "@stax/payments",
    "@stax/quote-delivery",
    "@stax/quote-documents",
    "@stax/deployment-switchboard",
    "@stax/authz",
    "@stax/customer-portal",
    "@stax/maintenance-plans",
    "@stax/notifications",
    "@stax/commands",
    "@stax/governance",
    "@stax/audit"
  ]
};

export default nextConfig;
