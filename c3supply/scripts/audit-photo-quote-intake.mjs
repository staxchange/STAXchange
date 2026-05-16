import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/photo-quote-intake/src/index.ts",
  "packages/commands/src/photo-quote/CreatePhotoQuoteIntakeCommand.ts",
  "apps/technician/app/api/photo-quote/create/route.ts",
  "apps/admin/app/api/photo-quote/convert-to-quote/route.ts",
  "infra/supabase/migrations/0015_photo_quote_intake.sql"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error("Missing photo quote files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const scanRoots = ["apps/technician/app/api/photo-quote", "apps/admin/app/api/photo-quote"];
const forbidden = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "instant quote", "AI estimate", "AI recommendation", "automatic sizing"];
const violations = [];

function walk(dir) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).flatMap((entry) => {
    const abs = path.join(full, entry);
    const rel = path.relative(process.cwd(), abs);
    return fs.statSync(abs).isDirectory() ? walk(rel) : [rel];
  });
}

for (const file of scanRoots.flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f))) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

const boundary = fs.readFileSync(path.join(process.cwd(), "packages/photo-quote-intake/src/ai-extraction-boundary.ts"), "utf8");
if (!boundary.includes("verified: false") || !boundary.includes("finalQuote: false") || !boundary.includes("finalPrice: false")) {
  violations.push("AI extraction boundary must mark extraction as unverified and not final.");
}

if (violations.length) {
  console.error("Photo quote audit violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Photo quote intake audit passed.");
