import type { LaunchRoute } from "./types";

export const requiredLaunchRoutes: LaunchRoute[] = [
  { path: "/", label: "Home", required: true, public: true },
  { path: "/catalog", label: "Catalog", required: true, public: true },
  { path: "/quote", label: "Quote request", required: true, public: true },
  { path: "/service", label: "Service request", required: true, public: true },
  { path: "/support", label: "Support intake", required: true, public: true },
  { path: "/contact", label: "Contact", required: true, public: true },
  { path: "/privacy", label: "Privacy Policy", required: true, public: true },
  { path: "/terms", label: "Terms", required: true, public: true },
  { path: "/disclaimers", label: "Disclaimers", required: true, public: true },
  { path: "/accessibility", label: "Accessibility", required: true, public: true }
];
