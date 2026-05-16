import fs from "node:fs";
import path from "node:path";
test("quote document implementation has no Collectibles drift", () => {
  const roots = ["packages/quote-documents", "packages/commands/src/quote-documents", "apps/storefront/app/quote-view", "apps/c3-storefront/app/quote-view"].map((r) => path.join(process.cwd(), r));
  const files: string[] = [];
  function walk(dir: string) { if (!fs.existsSync(dir)) return; for (const entry of fs.readdirSync(dir)) { const full = path.join(dir, entry); if (fs.statSync(full).isDirectory()) walk(full); else if (/\.(ts|tsx)$/.test(full)) files.push(full); } }
  roots.forEach(walk);
  const banned = ["cards_master", "vault_items", "break room", "collectibles trust score"];
  const violations = files.flatMap((file) => { const text = fs.readFileSync(file, "utf8"); return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`); });
  expect(violations).toEqual([]);
});
