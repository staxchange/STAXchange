import type { SupportHandoffDecisionDTO } from "./types";
import { emergencySupportCopy } from "./escalation-rules";

export function fallbackAssistantMessage(handoff: SupportHandoffDecisionDTO): string {
  if (handoff.nextAction === "EMERGENCY_REDIRECT") {
    return emergencySupportCopy();
  }

  if (handoff.required) {
    return [
      "I am going to route this to human support.",
      "Please share the product/model, order or quote number if available, photos, site conditions, and your best callback/email."
    ].join(" ");
  }

  if (handoff.nextAction === "COLLECT_DETAILS") {
    return "I can help collect the details. What product or system is involved, what changed, and what result are you seeing?";
  }

  return [
    "I can help with basic support intake.",
    "Please describe the product or system, the symptom, when it started, any error code or photo, and whether there is an order or quote number."
  ].join(" ");
}
