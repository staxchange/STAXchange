import fs from "node:fs";
import path from "node:path";

const appsRoot = path.join(process.cwd(), "apps");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    const rel = path.relative(process.cwd(), full);
    if (rel.includes("node_modules") || rel.includes(".next") || rel.includes("dist")) return [];
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("apps do not directly import protected mutation clients", () => {
  const files = walk(appsRoot).filter((file) => /\.(ts|tsx)$/.test(file));
  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(process.cwd(), file);
    const findings: string[] = [];

    if (text.includes("@supabase/supabase-js")) findings.push(`${rel} imports @supabase/supabase-js`);

    const isServerPaymentRoute = rel.includes("/app/api/payments/") || rel.includes("/app/api/stripe/");
    const isNextConfig = rel.endsWith("next.config.ts");
    if (text.includes("stripe") && !isServerPaymentRoute && !isNextConfig) {
      findings.push(`${rel} imports stripe outside server payment boundary`);
    }

    return findings;
  });

  expect(violations).toEqual([]);
});
