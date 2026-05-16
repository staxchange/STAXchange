import fs from "node:fs";
import path from "node:path";

test("final master docs exist", () => {
  const required = [
    "FINAL_PRODUCTION_AUDIT.md",
    "docs/runbooks/LAUNCH_DAY_RUNBOOK.md",
    "docs/governance/FINAL_BOUNDARY_CHECKPOINT.md",
    "docs/deployment/PRODUCTION_ENVIRONMENT_MATRIX.md"
  ];

  for (const file of required) {
    expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
  }
});

test("env example does not expose public service role or OpenAI key", () => {
  const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");

  expect(envExample).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  expect(envExample).not.toContain("NEXT_PUBLIC_OPENAI_API_KEY");
});
