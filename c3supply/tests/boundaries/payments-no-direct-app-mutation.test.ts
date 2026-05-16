import fs from "node:fs"; import path from "node:path";
function walk(dir: string): string[] { if (!fs.existsSync(dir)) return []; return fs.readdirSync(dir).flatMap((entry) => { const full = path.join(dir, entry); return fs.statSync(full).isDirectory() ? walk(full) : [full]; }); }
test("payment API routes do not directly mutate Supabase", () => {
  const files = ["apps/admin/app/api/payments","apps/customer/app/api/payments","apps/storefront/app/api/payments","apps/c3-storefront/app/api/payments","apps/storefront/app/api/stripe"].flatMap((d) => walk(path.join(process.cwd(), d))).filter((f) => /\.(ts|tsx)$/.test(f));
  const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert("];
  const violations = files.flatMap((file) => { const text = fs.readFileSync(file, "utf8"); return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`); });
  expect(violations).toEqual([]);
});
