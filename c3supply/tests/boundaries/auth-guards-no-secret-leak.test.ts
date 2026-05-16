import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("auth guard app files do not expose service role key or direct Supabase mutation", () => {
  const roots = ["apps/admin", "apps/customer", "apps/technician"].map((dir) => path.join(process.cwd(), dir));
  const files = roots.flatMap(walk).filter((file) => /\.(ts|tsx)$/.test(file));
  const banned = ["SUPABASE_SERVICE_ROLE_KEY", "insert(", "update(", "delete(", "upsert("];

  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
  });

  expect(violations).toEqual([]);
});
