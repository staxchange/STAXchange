import fs from "node:fs";
import path from "node:path";
function walk(dir: string): string[] { if (!fs.existsSync(dir)) return []; return fs.readdirSync(dir).flatMap((entry) => { const full = path.join(dir, entry); return fs.statSync(full).isDirectory() ? walk(full) : [full]; }); }
test("quote document app APIs do not directly mutate Supabase", () => {
  const roots = ["apps/admin/app/api/quote-documents", "apps/customer/app/api/quote-documents", "apps/storefront/app/api/quote-view", "apps/c3-storefront/app/api/quote-view"].map((r) => path.join(process.cwd(), r));
  const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert("];
  const violations = roots.flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f)).flatMap((file) => { const text = fs.readFileSync(file, "utf8"); return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`); });
  expect(violations).toEqual([]);
});
