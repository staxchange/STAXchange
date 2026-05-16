import fs from "node:fs";
import path from "node:path";

test("photo quote UI avoids instant AI quote language", () => {
  const root = path.join(process.cwd(), "apps", "technician");
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(full)) files.push(full);
    }
  }
  walk(root);
  const banned = ["instant quote", "AI estimate", "AI recommendation", "automatic sizing"];
  const violations = files.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return banned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
  });
  expect(violations).toEqual([]);
});
