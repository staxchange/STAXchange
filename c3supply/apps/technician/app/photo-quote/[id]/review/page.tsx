import { ExtractionCandidatePanel } from "../../../../components/photo-quote/ExtractionCandidatePanel";
import { HumanReviewRequiredPanel } from "../../../../components/photo-quote/HumanReviewRequiredPanel";
export default async function PhotoQuoteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main><h1>Review {id}</h1><ExtractionCandidatePanel /><HumanReviewRequiredPanel /></main>;
}
