import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "brands/dwg/src/theme.ts",
  "apps/storefront/app/globals.css",
  "apps/storefront/components/IndustrialBadge.tsx",
  "apps/storefront/components/RivetPanel.tsx",
  "apps/storefront/components/PressureGaugeCard.tsx",
  "apps/storefront/components/PipeDivider.tsx",
  "docs/architecture/BOILER_ROOM_THEME.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing boiler room theme files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const css = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/globals.css"), "utf8");
const requiredTokens = [
  "--aged-copper",
  "--brass",
  "--steam",
  "--soot",
  "pressure-card",
  "rivet-panel",
  "pipe-divider"
];

const missingTokens = requiredTokens.filter((token) => !css.includes(token));

if (missingTokens.length) {
  console.error("Missing boiler room theme tokens:");
  console.error(missingTokens.join("\n"));
  process.exit(1);
}

console.log("Boiler room storefront theme audit passed.");
