import fs from "node:fs";
import path from "node:path";

const migrations = [
  "0014_commerce_activation_phase1.sql",
  "0015_photo_quote_intake.sql",
  "0016_quote_documents_acceptance.sql",
  "0017_pricing_margin_governance.sql",
  "0018_quote_delivery_notifications.sql",
  "0019_stripe_payment_deposit_phase1.sql",
  "0020_fulfillment_supplier_po_phase1.sql",
  "0021_commerce_billing_accounting_handoff.sql"
];

const migrationDir = path.join(process.cwd(), "infra", "supabase", "migrations");
const missing = migrations.filter((name) => !fs.existsSync(path.join(migrationDir, name)));

const docs = [
  "docs/deployment/SUPABASE_FINAL_MIGRATION_ORDER.md",
  "docs/deployment/PRODUCTION_ENVIRONMENT_MATRIX.md"
];

const docMissing = docs.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

const docText = docs
  .filter((file) => fs.existsSync(path.join(process.cwd(), file)))
  .map((file) => fs.readFileSync(path.join(process.cwd(), file), "utf8"))
  .join("\n");

const buckets = ["service-attachments", "simply-accounting-export-files", "quote-documents"];
const missingBuckets = buckets.filter((bucket) => !docText.includes(bucket));

if (missing.length || docMissing.length || missingBuckets.length) {
  if (missing.length) console.error("Missing migrations:\n" + missing.join("\n"));
  if (docMissing.length) console.error("Missing Supabase docs:\n" + docMissing.join("\n"));
  if (missingBuckets.length) console.error("Missing bucket docs:\n" + missingBuckets.join("\n"));
  process.exit(1);
}

console.log("Supabase dry-run check passed. No connection made. No mutation performed.");
