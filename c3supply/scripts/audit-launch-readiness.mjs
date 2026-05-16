import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/launch-readiness/src/index.ts",
  "apps/storefront/app/privacy/page.tsx",
  "apps/storefront/app/terms/page.tsx",
  "apps/storefront/app/disclaimers/page.tsx",
  "apps/storefront/app/accessibility/page.tsx",
  "apps/storefront/app/robots.ts",
  "apps/storefront/app/sitemap.ts",
  "apps/storefront/components/LegalPage.tsx",
  "docs/deployment/VERCEL_STOREFRONT_LAUNCH.md",
  "docs/runbooks/STOREFRONT_LAUNCH_CHECKLIST.md",
  "docs/governance/PUBLIC_STOREFRONT_DISCLAIMERS.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing launch readiness files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const css = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/globals.css"), "utf8");
const cssTokens = ["footer-links", "legal-page", "focus-visible", "prefers-reduced-motion"];
const missingCss = cssTokens.filter((token) => !css.includes(token));

if (missingCss.length) {
  console.error("Missing launch CSS tokens:");
  console.error(missingCss.join("\n"));
  process.exit(1);
}

const forbidden = ["SUPABASE_SERVICE_ROLE_KEY=", "OPENAI_API_KEY=sk-"];

const env = fs.existsSync(path.join(process.cwd(), ".env"))
  ? fs.readFileSync(path.join(process.cwd(), ".env"), "utf8")
  : "";

const violations = forbidden.filter((token) => env.includes(token));

if (violations.length) {
  console.error("Potential committed secret detected:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Launch readiness audit passed.");
