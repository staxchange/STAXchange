import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/visual-system/src/index.ts",
  "packages/visual-system/src/icon-registry.ts",
  "packages/visual-system/src/category-visuals.ts",
  "packages/visual-system/src/service-status.ts",
  "apps/storefront/components/icons/BoilerIcon.tsx",
  "apps/storefront/components/CategoryIllustration.tsx",
  "apps/storefront/components/ServiceStatusGauge.tsx",
  "apps/storefront/components/ProductHeroVisual.tsx",
  "docs/architecture/BOILER_ROOM_VISUAL_SYSTEM.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing visual system files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const css = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/globals.css"), "utf8");

const tokens = [
  "boiler-icon",
  "category-illustration",
  "service-status-gauge",
  "product-hero-visual",
  "quote-mechanism"
];

const missingTokens = tokens.filter((token) => !css.includes(token));

if (missingTokens.length) {
  console.error("Missing visual system CSS tokens:");
  console.error(missingTokens.join("\n"));
  process.exit(1);
}

console.log("Boiler room visual system audit passed.");
