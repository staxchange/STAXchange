import { evaluateSupportHandoff } from "@stax/ai-support";

test("support assistant escalates safety risks", () => {
  const decision = evaluateSupportHandoff([
    { role: "user", content: "My filter housing is leaking and water is near an electrical panel." }
  ]);

  expect(decision.required).toBe(true);
  expect(decision.reason).toBe("SAFETY_OR_DAMAGE_RISK");
  expect(decision.nextAction).toBe("EMERGENCY_REDIRECT");
});

test("support assistant escalates installation and sizing", () => {
  const decision = evaluateSupportHandoff([
    { role: "user", content: "Can you size this RO system and tell me how to plumb it?" }
  ]);

  expect(decision.required).toBe(true);
  expect(decision.reason).toBe("INSTALLATION_OR_SIZING");
});

test("support assistant escalates part identification and compatibility", () => {
  const decision = evaluateSupportHandoff([
    { role: "user", content: "Can you identify this valve and confirm whether this cartridge is compatible?" }
  ]);

  expect(decision.required).toBe(true);
  expect(decision.reason).toBe("PART_IDENTIFICATION");
  expect(decision.nextAction).toBe("CREATE_TICKET");
});

test("support assistant escalates quote questions", () => {
  const decision = evaluateSupportHandoff([
    { role: "user", content: "Can I get pricing and a quote for a commercial RO system?" }
  ]);

  expect(decision.required).toBe(true);
  expect(decision.reason).toBe("QUOTE_OR_PRICING");
});

test("support assistant can collect details for basic intake", () => {
  const decision = evaluateSupportHandoff([
    { role: "user", content: "The reminder light turned on and I want to know what details to send." }
  ]);

  expect(decision.required).toBe(false);
  expect(decision.nextAction).toBe("ANSWER");
});
