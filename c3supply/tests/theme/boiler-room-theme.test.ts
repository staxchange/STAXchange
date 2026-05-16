import fs from "node:fs";
import path from "node:path";

test("boiler room theme exposes required CSS tokens", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/globals.css"), "utf8");

  expect(css).toContain("--aged-copper");
  expect(css).toContain("--brass");
  expect(css).toContain("--steam");
  expect(css).toContain("pressure-card");
  expect(css).toContain("rivet-panel");
});

test("DWG brand exports boiler room theme", () => {
  const theme = fs.readFileSync(path.join(process.cwd(), "brands/dwg/src/theme.ts"), "utf8");

  expect(theme).toContain("Steampunk Boiler Room");
  expect(theme).toContain("agedCopper");
});
