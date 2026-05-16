import { depositAmountMustBeExplicit, noAutonomousDepositCalculation } from "@stax/payments";
test("deposit amount must be explicit", () => {
  expect(depositAmountMustBeExplicit({ required: true, currency: "CAD" })).toBe(false);
  expect(depositAmountMustBeExplicit({ required: true, depositAmountCents: 500, currency: "CAD" })).toBe(true);
  expect(noAutonomousDepositCalculation()).toBe(true);
});
