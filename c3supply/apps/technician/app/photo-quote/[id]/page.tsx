import { HumanReviewRequiredPanel } from "../../../components/photo-quote/HumanReviewRequiredPanel";
export default async function PhotoQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main><h1>Photo quote {id}</h1><HumanReviewRequiredPanel /></main>;
}
