import {
  canonicalUrl,
  evaluateLaunchChecklist,
  launchChecklist,
  privacyPolicyCopy,
  requiredLaunchRoutes
} from "@stax/launch-readiness";

test("required launch routes include legal pages", () => {
  const paths = requiredLaunchRoutes.map((route) => route.path);

  expect(paths).toContain("/privacy");
  expect(paths).toContain("/terms");
  expect(paths).toContain("/disclaimers");
  expect(paths).toContain("/accessibility");
});

test("launch checklist requires legal and SEO items", () => {
  expect(launchChecklist.some((item) => item.category === "LEGAL" && item.required)).toBe(true);
  expect(launchChecklist.some((item) => item.category === "SEO" && item.required)).toBe(true);
});

test("launch checklist reports missing required items", () => {
  const result = evaluateLaunchChecklist([]);

  expect(result.ready).toBe(false);
  expect(result.missingRequired.length).toBeGreaterThan(0);
});

test("privacy policy copy is present", () => {
  expect(privacyPolicyCopy.title).toBe("Privacy Policy");
  expect(privacyPolicyCopy.sections.length).toBeGreaterThan(0);
});

test("canonical URL uses DWG domain", () => {
  expect(canonicalUrl("/catalog")).toBe("https://dwgprocesssupply.com/catalog");
});
