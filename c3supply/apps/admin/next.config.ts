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
    "@stax/orders",
    "@stax/quote-workflow",
    "@stax/cart",
    "@stax/product-catalog",
    "@stax/deployment-switchboard",
    "@stax/authz",
    "@stax/finance-export-ui",
    "@stax/accounting-export-storage",
    "@stax/accounting-export",
    "@stax/reporting",
    "@stax/notifications",
    "@stax/maintenance-plans",
    "@stax/customer-portal",
    "@stax/service-billing",
    "@stax/parts-inventory",
    "@stax/commands",
    "@stax/governance",
    "@stax/audit"
  ]
};

export default nextConfig;
