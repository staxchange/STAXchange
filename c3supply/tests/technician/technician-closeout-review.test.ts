import { closeoutRequiresManagerReview, validateCloseout, validateManagerReview } from "@stax/technician-portal";

test("technician closeout requires manager review", () => {
  expect(closeoutRequiresManagerReview()).toBe(true);
});

test("closeout requires findings and actions", () => {
  expect(() => validateCloseout({ findings: "", actionsTaken: "Documented service." })).toThrow("findings");
  expect(() => validateCloseout({ findings: "Observed issue.", actionsTaken: "" })).toThrow("actionsTaken");
});

test("manager rejection requires reason", () => {
  expect(() => validateManagerReview({ decision: "REJECTED" })).toThrow("Rejection reason");
});
