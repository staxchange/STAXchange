import { PhotoUploadPanel } from "../../../../components/PhotoUploadPanel";

export default async function PhotosPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;
  return <><h1>Service Photos</h1><PhotoUploadPanel workOrderId={workOrderId} /></>;
}
