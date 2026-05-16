import fs from "node:fs";
import path from "node:path";
import { goldenPathFixtures, goldenPathStepIds } from "@stax/e2e-readiness";

test("all demo fixtures exist and parse", () => {
  const fixtureDir = path.join(process.cwd(), "fixtures", "demo-commerce");
  for (const file of fs.readdirSync(fixtureDir).filter((name) => name.endsWith(".json"))) {
    const parsed = JSON.parse(fs.readFileSync(path.join(fixtureDir, file), "utf8"));
    expect(parsed.fixture).toBeTruthy();
    expect(Array.isArray(parsed.records)).toBe(true);
  }
});

test("golden path step order is complete", () => {
  expect(goldenPathFixtures.length).toBeGreaterThan(0);
  expect(goldenPathStepIds()).toEqual([
    "catalog",
    "cart",
    "quote-request",
    "pricing-review",
    "quote-document",
    "quote-delivery",
    "payment",
    "fulfillment",
    "billing",
    "accounting-handoff"
  ]);
});
