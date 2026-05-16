import {
  classifyServiceRequest,
  sanitizeServiceRequestInput,
  serviceSLAForClassification
} from "@stax/service-interface";

const baseInput = {
  customer: {
    name: "Test Customer",
    email: "test@example.com"
  },
  issueDescription: "General service request for filter inspection."
};

test("sanitizes valid service request input", () => {
  const input = sanitizeServiceRequestInput(baseInput);

  expect(input.customer.email).toBe("test@example.com");
  expect(input.issueDescription).toContain("filter inspection");
});

test("rejects malformed email", () => {
  expect(() =>
    sanitizeServiceRequestInput({
      ...baseInput,
      customer: { name: "Bad Email", email: "not-an-email" }
    })
  ).toThrow("Valid customer email is required.");
});

test("classifies flooding as emergency", () => {
  const input = sanitizeServiceRequestInput({
    ...baseInput,
    issueDescription: "The system burst and the basement is flooding."
  });

  const classification = classifyServiceRequest(input);

  expect(classification.severity).toBe("EMERGENCY");
  expect(classification.category).toBe("FLOOD_RISK");
  expect(classification.emergencyEscalation).toBe(true);
});

test("classifies leaks as high severity", () => {
  const input = sanitizeServiceRequestInput({
    ...baseInput,
    issueDescription: "The filter housing is leaking at the inlet."
  });

  const classification = classifyServiceRequest(input);

  expect(classification.severity).toBe("HIGH");
  expect(classification.category).toBe("LEAK");
});

test("assigns emergency SLA", () => {
  const sla = serviceSLAForClassification({
    severity: "EMERGENCY",
    category: "FLOOD_RISK",
    requiresHumanReview: true,
    emergencyEscalation: true,
    reason: "Flooding."
  });

  expect(sla.targetResponseHours).toBe(1);
  expect(sla.dispatchPriority).toBe(1);
});
