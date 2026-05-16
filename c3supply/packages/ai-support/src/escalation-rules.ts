import type { SupportHandoffDecisionDTO, SupportHandoffReason, SupportMessageDTO, SupportSeverity } from "./types";

type Rule = {
  reason: SupportHandoffReason;
  severity: SupportSeverity;
  nextAction: SupportHandoffDecisionDTO["nextAction"];
  patterns: RegExp[];
  summary: string;
};

const rules: Rule[] = [
  {
    reason: "HUMAN_REQUESTED",
    severity: "NORMAL",
    nextAction: "CREATE_TICKET",
    summary: "Customer asked to speak with a human support representative.",
    patterns: [/\bhuman\b/i, /\bperson\b/i, /\bagent\b/i, /\brepresentative\b/i, /\bcall me\b/i]
  },
  {
    reason: "SAFETY_OR_DAMAGE_RISK",
    severity: "EMERGENCY",
    nextAction: "EMERGENCY_REDIRECT",
    summary: "Customer described a possible safety, damage, chemical, electrical, leak, or contamination issue.",
    patterns: [
      /\bleak(?:ing)?\b/i,
      /\bflood(?:ing)?\b/i,
      /\belectrical\b/i,
      /\bspark(?:ing)?\b/i,
      /\bshock\b/i,
      /\bchemical\b/i,
      /\bchlorine\b/i,
      /\bsewage\b/i,
      /\bsmell(?:s)? like gas\b/i,
      /\bunsafe\b/i,
      /\binjury\b/i,
      /\bcontamination\b/i
    ]
  },
  {
    reason: "INSTALLATION_OR_SIZING",
    severity: "URGENT",
    nextAction: "CREATE_TICKET",
    summary: "Customer needs installation, sizing, specification, or field technical guidance.",
    patterns: [
      /\binstall(?:ation|ing)?\b/i,
      /\bwire(?:d|ing)?\b/i,
      /\bplumb(?:ing)?\b/i,
      /\bsize\b/i,
      /\bsizing\b/i,
      /\bgpm\b/i,
      /\bflow rate\b/i,
      /\bpressure\b/i,
      /\bdrawings?\b/i,
      /\bspec(?:ification)?\b/i
    ]
  },
  {
    reason: "WARRANTY_OR_ORDER",
    severity: "NORMAL",
    nextAction: "CREATE_TICKET",
    summary: "Customer needs warranty, order, return, damaged shipment, or replacement support.",
    patterns: [/\bwarranty\b/i, /\border\b/i, /\breturn\b/i, /\brma\b/i, /\bdamaged\b/i, /\breplacement\b/i, /\btracking\b/i]
  },
  {
    reason: "QUOTE_OR_PRICING",
    severity: "NORMAL",
    nextAction: "CREATE_TICKET",
    summary: "Customer needs quote, pricing, availability, or sales follow-up.",
    patterns: [/\bquote\b/i, /\bpricing\b/i, /\bprice\b/i, /\bavailability\b/i, /\bbuy\b/i, /\bpurchase\b/i]
  },
  {
    reason: "PART_IDENTIFICATION",
    severity: "NORMAL",
    nextAction: "CREATE_TICKET",
    summary: "Customer needs part identification or compatibility review that requires human confirmation.",
    patterns: [/\bpart number\b/i, /\bmodel number\b/i, /\bserial\b/i, /\bcompatible\b/i, /\bcompatibility\b/i, /\bfit\b/i, /\bvalve\b/i]
  }
];

const detailRequest = "Please share the product/model, photos if available, order or quote number, site conditions, and the best callback/email for support.";

export function evaluateSupportHandoff(messages: SupportMessageDTO[]): SupportHandoffDecisionDTO {
  const latest = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const repeatedUnresolved = messages.filter((message) => message.role === "user").length >= 4;

  if (repeatedUnresolved) {
    return {
      required: true,
      reason: "REPEATED_UNRESOLVED",
      severity: "NORMAL",
      summary: "Conversation has multiple customer turns and should be reviewed by a human.",
      nextAction: "CREATE_TICKET"
    };
  }

  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(latest))) {
      return {
        required: rule.nextAction === "CREATE_TICKET" || rule.nextAction === "EMERGENCY_REDIRECT",
        reason: rule.reason,
        severity: rule.severity,
        summary: rule.summary,
        nextAction: rule.nextAction
      };
    }
  }

  if (latest.trim().length < 12) {
    return {
      required: false,
      reason: "NONE",
      severity: "LOW",
      summary: detailRequest,
      nextAction: "COLLECT_DETAILS"
    };
  }

  return {
    required: false,
    reason: "NONE",
    severity: "LOW",
    summary: "AI assistant can provide basic triage and collect support details.",
    nextAction: "ANSWER"
  };
}

export function emergencySupportCopy(): string {
  return [
    "This may involve safety, water damage, contamination, electrical risk, or chemical exposure.",
    "Stop using the affected equipment if it is safe to do so, isolate water/power only if you are qualified, and contact an emergency professional or local service provider immediately.",
    "I will also prepare this for human support review."
  ].join(" ");
}
