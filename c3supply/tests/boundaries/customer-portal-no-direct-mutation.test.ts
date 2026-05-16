import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("customer portal app does not directly mutate protected data", () => {
  const files = walk(path.join(process.cwd(), "apps", "customer")).filter((file) => /\.(ts|tsx)$/.test(file));
  const banned = ["@supabase/supabase-js", "SUPABASE_SERVICE_ROLE_KEY", "insert(", "update(", "delete(", "upsert("];

  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
  });

  expect(violations).toEqual([]);
});
