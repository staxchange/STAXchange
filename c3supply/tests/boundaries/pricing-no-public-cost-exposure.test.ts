import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("public apps do not expose supplier costs", () => {
  const files = ["apps/storefront", "apps/c3-storefront"].flatMap((dir) => walk(path.join(process.cwd(), dir))).filter((file) => /\.(ts|tsx)$/.test(file));
  const banned = ["supplierCost", "supplier cost", "costCents", "supplier_cost"];
  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
  });
  expect(violations).toEqual([]);
});
