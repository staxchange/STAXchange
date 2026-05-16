import {
  dwgTrustPillars,
  quoteFunnelSteps,
  serviceEmergencyCues,
  storefrontSeo
} from "@stax/storefront-conversion";

test("trust strip has three pillars", () => {
  expect(dwgTrustPillars).toHaveLength(3);
  expect(dwgTrustPillars[0].label).toContain("Quote-first");
});

test("quote funnel includes human review", () => {
  expect(quoteFunnelSteps.some((step) => step.id === "human-review")).toBe(true);
});

test("emergency cues include service links", () => {
  expect(serviceEmergencyCues.every((cue) => cue.href.startsWith("/"))).toBe(true);
});

test("SEO helper creates DWG title", () => {
  const seo = storefrontSeo({
    title: "Catalog",
    description: "Catalog description",
    path: "/catalog"
  });

  expect(seo.title).toContain("DWG Process Supply");
  expect(seo.canonicalPath).toBe("/catalog");
});
