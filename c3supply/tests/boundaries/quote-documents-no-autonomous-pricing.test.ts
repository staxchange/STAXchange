import fs from "node:fs";
import path from "node:path";
test("quote document app copy avoids autonomous pricing", () => {
  const roots = ["apps/admin/app/commerce/quotes", "apps/customer/app/quotes", "apps/storefront/app/quote-view", "apps/c3-storefront/app/quote-view"].map((r) => path.join(process.cwd(), r));
  const files: string[] = [];
  function walk(dir: string) { if (!fs.existsSync(dir)) return; for (const entry of fs.readdirSync(dir)) { const full = path.join(dir, entry); if (fs.statSync(full).isDirectory()) walk(full); else if (/\.(ts|tsx)$/.test(full)) files.push(full); } }
  roots.forEach(walk);
  const banned = ["autonomous pricing", "AI price", "recommended price"];
  const violations = files.flatMap((file) => { const text = fs.readFileSync(file, "utf8"); return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`); });
  expect(violations).toEqual([]);
});
