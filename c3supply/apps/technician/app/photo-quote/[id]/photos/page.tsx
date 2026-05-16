import { PhotoUploadChecklist } from "../../../../components/photo-quote/PhotoUploadChecklist";
export default async function PhotoQuotePhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main><h1>Photos for {id}</h1><PhotoUploadChecklist /></main>;
}
