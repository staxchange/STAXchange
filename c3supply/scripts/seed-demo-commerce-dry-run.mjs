import fs from "node:fs";
import path from "node:path";

const fixtureDir = path.join(process.cwd(), "fixtures", "demo-commerce");
const insertOrder = [
  "products.sample.json",
  "cart.sample.json",
  "quote-request.sample.json",
  "pricing-review.sample.json",
  "quote-document.sample.json",
  "quote-delivery.sample.json",
  "payment-request.sample.json",
  "fulfillment-plan.sample.json",
  "supplier-po.sample.json",
  "invoice-draft.sample.json",
  "accounting-handoff.sample.json"
];

const errors = [];

for (const file of insertOrder) {
  const full = path.join(fixtureDir, file);
  if (!fs.existsSync(full)) {
    errors.push(`Missing fixture ${file}`);
    continue;
  }
  const parsed = JSON.parse(fs.readFileSync(full, "utf8"));
  if (!parsed.fixture || !Array.isArray(parsed.records)) {
    errors.push(`${file} must include fixture and records[]`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Demo commerce dry-run insert order:");
insertOrder.forEach((file, index) => console.log(`${index + 1}. ${file}`));
console.log("Dry run only. No database connection. No mutation performed.");
