import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appsDir = path.join(root, "apps");

const bannedEverywhere = [
  "@supabase/supabase-js",
  "executeMutation(",
  "NEXT_PUBLIC_STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET"
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    const rel = path.relative(root, full);
    if (rel.includes("node_modules") || rel.includes(".next") || rel.includes("dist")) return [];
    const stat = fs.statSync(full);
    return stat.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(appsDir).filter((file) => /\.(ts|tsx)$/.test(file));
const violations = [];

for (const file of files) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");

  for (const token of bannedEverywhere) {
    if (text.includes(token)) {
      violations.push(`${rel} contains banned token ${token}`);
    }
  }

  const isServerPaymentRoute = rel.includes("/app/api/payments/") || rel.includes("/app/api/stripe/");
  const isNextConfig = rel.endsWith("next.config.ts");

  if (text.includes("stripe") && !isServerPaymentRoute && !isNextConfig) {
    violations.push(`${rel} contains banned token stripe outside server payment boundary`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Boundary validation passed.");
