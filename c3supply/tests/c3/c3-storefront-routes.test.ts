import fs from "node:fs";
import path from "node:path";

test("C3 storefront has required public routes", () => {
  const routes = ["catalog", "quote", "cart", "checkout-lite", "contact", "privacy", "terms", "disclaimers", "accessibility"];
  for (const route of routes) {
    expect(fs.existsSync(path.join(process.cwd(), "apps/c3-storefront/app", route, "page.tsx"))).toBe(true);
  }
});
