import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "packages", "commands", "src", "technician");

test("technician commands expose lifecycle methods", () => {
  const files = fs.readdirSync(root).filter((file) => file.endsWith("Command.ts"));
  const required = ["validateInput", "validateActor", "governanceGuard", "executeMutation", "appendAuditEvent", "returnSafeDTO", "run"];
  const missing = files.flatMap((file) => {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    return required.filter((method) => !text.includes(method)).map((method) => `${file} missing ${method}`);
  });
  expect(missing).toEqual([]);
});
