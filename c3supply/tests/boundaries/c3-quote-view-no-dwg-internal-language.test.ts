import fs from "node:fs";
import path from "node:path";
test("C3 quote view has no DWG internal language", () => {
  const root = path.join(process.cwd(), "apps/c3-storefront/app/quote-view");
  const files: string[] = [];
  function walk(dir: string) { if (!fs.existsSync(dir)) return; for (const entry of fs.readdirSync(dir)) { const full = path.join(dir, entry); if (fs.statSync(full).isDirectory()) walk(full); else if (/\.(ts|tsx)$/.test(full)) files.push(full); } }
  walk(root);
  const banned = ["DWG Process Supply", "technician portal", "Simply Accounting"];
  const violations = files.flatMap((file) => { const text = fs.readFileSync(file, "utf8"); return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`); });
  expect(violations).toEqual([]);
});
