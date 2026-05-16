import type { EmergencyCue } from "./types";

export const serviceEmergencyCues: EmergencyCue[] = [
  {
    id: "leak",
    label: "Active leak or water damage?",
    body: "Submit a service request and mark the issue clearly. Leaks and flood risk are routed to urgent human review.",
    href: "/service"
  },
  {
    id: "electrical",
    label: "Electrical, chemical, or safety concern?",
    body: "Do not rely on automated guidance. Use the service request flow for human review.",
    href: "/service"
  },
  {
    id: "sizing",
    label: "Need sizing or compatibility?",
    body: "Large systems, sizing, and compatibility require quote-first human review.",
    href: "/quote"
  }
];
