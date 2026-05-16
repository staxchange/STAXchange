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
    "@stax/pricing-governance",
    "@stax/margin-rules",
    "@stax/supplier-costs",
    "@stax/quote-documents",
    "@stax/c3-supply",
    "@stax/product-catalog",
    "@stax/cart",
    "@stax/quote-workflow",
    "@stax/orders",
    "@stax/commands",
    "@stax/governance",
    "@stax/audit"
  ]
};

export default nextConfig;
