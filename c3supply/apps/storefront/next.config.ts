import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    workerThreads: false
  },
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
    "@stax/orders",
    "@stax/quote-workflow",
    "@stax/cart",
    "@stax/product-catalog",
    "@stax/deployment-switchboard",
    "@stax/launch-readiness",
    "@stax/storefront-conversion",
    "@stax/visual-system",
    "@stax/brand-dwg",
    "@stax/core-contracts",
    "@stax/commands",
    "@stax/workflows",
    "@stax/commerce-shell",
    "@stax/ui",
    "@stax/ai-support",
    "@stax/service-interface"
  ]
};

export default nextConfig;
