import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("technician app does not import direct mutation clients or service role secrets", () => {
  const files = walk(path.join(process.cwd(), "apps", "technician")).filter((file) => /\.(ts|tsx)$/.test(file));
  const banned = ["@supabase/supabase-js", "SUPABASE_SERVICE_ROLE_KEY", "insert(", "update(", "delete("];
  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${path.relative(process.cwd(), file)} contains ${token}`);
  });
  expect(violations).toEqual([]);
});
