import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("photo quote API routes do not directly mutate Supabase", () => {
  const roots = ["apps/technician/app/api/photo-quote", "apps/admin/app/api/photo-quote"].map((dir) => path.join(process.cwd(), dir));
  const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert("];
  const violations = roots.flatMap(walk).filter((file) => /\.(ts|tsx)$/.test(file)).flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
  });
  expect(violations).toEqual([]);
});
