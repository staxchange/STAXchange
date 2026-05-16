import type { WorkflowIntegrityResultDTO } from "./types";

export const requiredGoldenPathStates = [
  "QUOTE_REQUESTED",
  "PRICING_APPROVED",
  "QUOTE_PRICING_LOCKED",
  "DOCUMENT_APPROVED",
  "CUSTOMER_ACCEPTED",
  "PAYMENT_SUCCEEDED",
  "FULFILLMENT_CLOSED",
  "BILLING_PACKET_CREATED",
  "READY_FOR_SIMPLY_ACCOUNTING_EXPORT"
];

export function evaluateWorkflowIntegrity(states: string[]): WorkflowIntegrityResultDTO {
  const missingStates = requiredGoldenPathStates.filter((state) => !states.includes(state));
  return {
    ok: missingStates.length === 0,
    missingStates,
    reason: missingStates.length === 0 ? "Golden path workflow states present." : "Missing required golden path states."
  };
}

export function protectedMutationMustUseCommands(): true {
  return true;
}

export function directAccountingSyncAllowed(): false {
  return false;
}
