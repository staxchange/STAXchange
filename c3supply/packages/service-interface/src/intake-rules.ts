import type {
  ServiceClassification,
  ServiceIssueCategory,
  ServiceRequestInput,
  ServiceSeverity
} from "./types";

interface IntakeRule {
  category: ServiceIssueCategory;
  severity: ServiceSeverity;
  reason: string;
  terms: string[];
  emergency?: boolean;
}

const rules: IntakeRule[] = [
  {
    category: "FLOOD_RISK",
    severity: "EMERGENCY",
    emergency: true,
    reason: "Possible flood or active water damage.",
    terms: ["flood", "flooding", "water damage", "basement filling", "standing water", "burst"]
  },
  {
    category: "LEAK",
    severity: "HIGH",
    reason: "Leak or active water escape requires human service review.",
    terms: ["leak", "leaking", "dripping", "spraying", "water everywhere"]
  },
  {
    category: "ELECTRICAL",
    severity: "EMERGENCY",
    emergency: true,
    reason: "Electrical concern around water treatment equipment.",
    terms: ["shock", "sparking", "burning smell", "breaker", "electrical", "wiring", "voltage"]
  },
  {
    category: "CHEMICAL_FEED",
    severity: "HIGH",
    reason: "Chemical feed or chemical handling requires human review.",
    terms: ["chemical", "chlorine", "acid", "caustic", "bleach", "chemical feed", "pump feed"]
  },
  {
    category: "NO_WATER",
    severity: "HIGH",
    reason: "No water/service interruption requires priority triage.",
    terms: ["no water", "nothing coming out", "no flow", "system shut down"]
  },
  {
    category: "LOW_PRESSURE",
    severity: "MEDIUM",
    reason: "Low pressure requires service review.",
    terms: ["low pressure", "pressure drop", "slow flow", "reduced flow"]
  },
  {
    category: "WATER_QUALITY",
    severity: "MEDIUM",
    reason: "Water quality issue requires intake and possible testing/service review.",
    terms: ["bad water", "dirty water", "cloudy", "smell", "odor", "taste"]
  },
  {
    category: "IRON_STAINING",
    severity: "MEDIUM",
    reason: "Iron staining issue requires water treatment service review.",
    terms: ["iron", "rust", "orange", "staining", "brown water"]
  },
  {
    category: "HARDNESS",
    severity: "LOW",
    reason: "Hardness issue can be routed through standard service intake.",
    terms: ["hard water", "hardness", "scale", "softener", "salt"]
  },
  {
    category: "CHLORINE_CHLORAMINE",
    severity: "MEDIUM",
    reason: "Chlorine/chloramine issue requires treatment review.",
    terms: ["chlorine", "chloramine", "pool smell"]
  },
  {
    category: "FILTER_REPLACEMENT",
    severity: "LOW",
    reason: "Filter replacement can be routed through standard service intake.",
    terms: ["filter replacement", "replace filter", "cartridge", "sediment filter"]
  },
  {
    category: "RO_SYSTEM",
    severity: "MEDIUM",
    reason: "RO service request requires system review.",
    terms: ["ro", "reverse osmosis", "membrane", "storage tank"]
  },
  {
    category: "INSTALLATION",
    severity: "HIGH",
    reason: "Installation guidance requires human service review.",
    terms: ["install", "installation", "plumb", "pipe", "hook up", "wire"]
  }
];

export function classifyServiceRequest(input: ServiceRequestInput): ServiceClassification {
  const text = [
    input.issueDescription,
    input.systemType,
    input.siteAccessNotes,
    input.preferredServiceWindow
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const rule of rules) {
    if (rule.terms.some((term) => text.includes(term))) {
      return {
        severity: rule.severity,
        category: rule.category,
        requiresHumanReview: true,
        emergencyEscalation: Boolean(rule.emergency),
        reason: rule.reason
      };
    }
  }

  return {
    severity: "LOW",
    category: "UNKNOWN",
    requiresHumanReview: true,
    emergencyEscalation: false,
    reason: "General service request requires human service intake."
  };
}
