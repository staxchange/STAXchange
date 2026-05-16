import type { LaunchChecklistItem, LaunchReadinessResult } from "./types";

export const launchChecklist: LaunchChecklistItem[] = [
  { id: "home-copy", label: "Homepage launch copy present", category: "CONTENT", required: true },
  { id: "catalog-copy", label: "Catalog category copy present", category: "CONTENT", required: true },
  { id: "quote-disclaimer", label: "Quote-first disclaimer present", category: "LEGAL", required: true },
  { id: "support-disclaimer", label: "Support/AI boundary disclaimer present", category: "LEGAL", required: true },
  { id: "privacy", label: "Privacy Policy present", category: "LEGAL", required: true },
  { id: "terms", label: "Terms present", category: "LEGAL", required: true },
  { id: "robots", label: "robots.ts present", category: "SEO", required: true },
  { id: "sitemap", label: "sitemap.ts present", category: "SEO", required: true },
  { id: "metadata", label: "Page metadata helper present", category: "SEO", required: true },
  { id: "keyboard", label: "Keyboard-accessible CTAs", category: "ACCESSIBILITY", required: true },
  { id: "vercel", label: "Vercel deployment settings documented", category: "DEPLOYMENT", required: true },
  { id: "no-secrets", label: "No production secrets committed", category: "SECURITY", required: true }
];

export function evaluateLaunchChecklist(completedIds: string[]): LaunchReadinessResult {
  const missingRequired = launchChecklist
    .filter((item) => item.required && !completedIds.includes(item.id))
    .map((item) => item.id);

  return {
    ready: missingRequired.length === 0,
    missingRequired
  };
}
