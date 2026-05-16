import fs from "node:fs";
import path from "node:path";

const commandRoot = path.join(process.cwd(), "packages", "commands", "src");

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("command classes expose required lifecycle methods", () => {
  const commandFiles = walk(commandRoot).filter((file) => /Command\.ts$/.test(file));
  const required = [
    "validateInput",
    "validateActor",
    "governanceGuard",
    "executeMutation",
    "appendAuditEvent",
    "returnSafeDTO"
  ];

  const missing = commandFiles.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return required
      .filter((method) => !text.includes(method))
      .map((method) => `${path.relative(process.cwd(), file)} missing ${method}`);
  });

  expect(missing).toEqual([]);
});
