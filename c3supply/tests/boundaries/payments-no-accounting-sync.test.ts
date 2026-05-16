import fs from "node:fs"; import path from "node:path";
test("payments do not contain accounting sync", () => {
  const root = path.join(process.cwd(), "packages/payments/src");
  const files = fs.readdirSync(root).map((file) => path.join(root, file));
  const banned = ["postToAccounting", "directAccountingSync", "autoPostAccountingEntry"];
  const violations = files.flatMap((file) => { const text = fs.readFileSync(file, "utf8"); return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`); });
  expect(violations).toEqual([]);
});
