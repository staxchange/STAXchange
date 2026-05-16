import { boilerIconLabel, serviceStatusVisual, visualForCategory } from "@stax/visual-system";

test("category visual maps known category", () => {
  const visual = visualForCategory("iron-removal");

  expect(visual.icon).toBe("iron");
  expect(visual.accent).toBe("copper");
});

test("icon registry labels icons", () => {
  expect(boilerIconLabel("valve")).toBe("Valve");
});

test("service status visual flags escalated state as critical", () => {
  const visual = serviceStatusVisual("ESCALATED");

  expect(visual.intensity).toBe("critical");
  expect(visual.gaugePercent).toBeGreaterThan(80);
});
