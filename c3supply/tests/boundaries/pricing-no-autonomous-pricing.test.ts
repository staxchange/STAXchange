import fs from "node:fs";
import path from "node:path";

test("pricing package does not contain autonomous pricing language", () => {
  const root = path.join(process.cwd(), "packages/pricing-governance/src");
  const files = fs.readdirSync(root).map((file) => path.join(root, file));
  const banned = ["automatic price recommendation", "AI pricing", "autonomous price"];
  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
  });
  expect(violations).toEqual([]);
});
