import type { FunnelStep } from "./types";

export const quoteFunnelSteps: FunnelStep[] = [
  {
    id: "intake",
    label: "1. Intake",
    body: "Tell us the system, water issue, component need, or service request.",
    href: "/quote"
  },
  {
    id: "human-review",
    label: "2. Human review",
    body: "DWG reviews system fit, safety, service context, and quote requirements."
  },
  {
    id: "quote-service",
    label: "3. Quote or service path",
    body: "The request routes to quote, service, support, or customer follow-up workflow.",
    href: "/service"
  }
];

export const serviceFunnelSteps: FunnelStep[] = [
  {
    id: "service-intake",
    label: "Service intake",
    body: "Submit leaks, low pressure, filter replacement, system trouble, or maintenance needs.",
    href: "/service"
  },
  {
    id: "triage",
    label: "Triage",
    body: "Urgent risks and technical issues are flagged for human review."
  },
  {
    id: "work-order",
    label: "Work order",
    body: "Approved service requests move into technician and manager-review workflow."
  }
];
