import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/storefront-conversion/src/index.ts",
  "apps/storefront/components/TrustStrip.tsx",
  "apps/storefront/components/QuoteFunnelCards.tsx",
  "apps/storefront/components/EmergencyServiceCTA.tsx",
  "apps/storefront/components/StickyActionBar.tsx",
  "apps/storefront/components/CatalogFilterControls.tsx",
  "apps/storefront/components/ContactSignalPanel.tsx",
  "apps/storefront/app/metadata.ts",
  "docs/architecture/STOREFRONT_CONVERSION_POLISH.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing storefront conversion files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const css = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/globals.css"), "utf8");
const tokens = [
  "trust-strip",
  "funnel-cards",
  "emergency-cta",
  "sticky-action-bar",
  "catalog-filter",
  "contact-signal-panel"
];

const missingTokens = tokens.filter((token) => !css.includes(token));

if (missingTokens.length) {
  console.error("Missing storefront conversion CSS tokens:");
  console.error(missingTokens.join("\n"));
  process.exit(1);
}

console.log("Storefront conversion audit passed.");
