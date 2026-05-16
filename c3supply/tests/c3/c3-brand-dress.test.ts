import { c3Brand } from "@stax/c3-supply";

test("C3 brand uses correct domain and name", () => {
  expect(c3Brand.name).toBe("C3 Supply Co.");
  expect(c3Brand.domain).toBe("c3supply.co");
  expect(c3Brand.canadianTrustDomain).toBe("c3supply.ca");
});
