import type { ReleaseCandidateChecklistDTO } from "./types";

export const releaseCandidateChecklist: ReleaseCandidateChecklistDTO[] = [
  { id: "no-secrets", label: "No production secrets committed", required: true, complete: true },
  { id: "audits-pass", label: "All audits pass", required: true, complete: false },
  { id: "tests-pass", label: "All tests pass", required: true, complete: false },
  { id: "builds-pass", label: "All app builds pass", required: true, complete: false },
  { id: "supabase-reviewed", label: "Supabase migrations reviewed", required: true, complete: false },
  { id: "buckets-reviewed", label: "Storage buckets reviewed", required: true, complete: false },
  { id: "vercel-envs-reviewed", label: "Vercel envs reviewed", required: true, complete: false },
  { id: "no-direct-accounting", label: "No direct Simply Accounting sync", required: true, complete: true },
  { id: "stripe-live-approval", label: "No Stripe live mode until explicit approval", required: true, complete: true }
];

export function releaseCandidateReady(items: ReleaseCandidateChecklistDTO[]): boolean {
  return items.every((item) => !item.required || item.complete);
}
