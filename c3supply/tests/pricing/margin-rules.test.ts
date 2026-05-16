import { applyMarginRule, lowMarginTriggersReview } from "@stax/margin-rules";

test("low margin triggers review", () => {
  const result = applyMarginRule({
    sellPriceCents: 11000,
    costCents: 10000,
    rule: {
      id: "rule-1",
      categorySlug: "filters",
      targetMarginPercent: 35,
      minimumMarginPercent: 25,
      createdAt: new Date().toISOString()
    }
  });

  expect(lowMarginTriggersReview(result)).toBe(true);
});
