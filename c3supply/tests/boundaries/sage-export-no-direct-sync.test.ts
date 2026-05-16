import fs from "node:fs";
import path from "node:path";

test("implementation files do not contain direct Sage sync code", () => {
  const root = process.cwd();
  const banned = ["sageApi", "directSageSync", "postToSage"];

  const scanRoots = [
    "apps",
    "packages/accounting-export",
    "packages/accounting-export-storage",
    "packages/service-billing",
    "packages/commands/src/billing"
  ];

  function walk(dir: string): string[] {
    const fullDir = path.join(root, dir);
    if (!fs.existsSync(fullDir)) return [];

    return fs.readdirSync(fullDir).flatMap((entry) => {
      const full = path.join(fullDir, entry);
      const rel = path.relative(root, full);

      if (
        rel.includes("node_modules") ||
        rel.includes(".git") ||
        rel.startsWith("tests/") ||
        rel.startsWith("scripts/")
      ) {
        return [];
      }

      return fs.statSync(full).isDirectory() ? walk(rel) : [full];
    });
  }

  const files = scanRoots.flatMap(walk).filter((file) => /\.(ts|tsx|js|mjs)$/.test(file));

  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned
      .filter((token) => text.includes(token))
      .map((token) => `${path.relative(root, file)} contains ${token}`);
  });

  expect(violations).toEqual([]);
});
