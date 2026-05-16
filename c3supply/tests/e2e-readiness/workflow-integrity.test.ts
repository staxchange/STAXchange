import { evaluateWorkflowIntegrity, protectedMutationMustUseCommands, directAccountingSyncAllowed, requiredGoldenPathStates } from "@stax/e2e-readiness";

test("workflow integrity passes when required states exist", () => {
  expect(evaluateWorkflowIntegrity(requiredGoldenPathStates).ok).toBe(true);
});

test("protected mutations use commands and direct accounting sync is not allowed", () => {
  expect(protectedMutationMustUseCommands()).toBe(true);
  expect(directAccountingSyncAllowed()).toBe(false);
});
