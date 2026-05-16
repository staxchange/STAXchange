import { ChecklistRunner } from "../../../../components/ChecklistRunner";
import { placeholderChecklist } from "../../../../lib/technician-placeholders";

export default async function ChecklistPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;
  return <><h1>Field Checklist</h1><ChecklistRunner workOrderId={workOrderId} items={placeholderChecklist.map((item) => ({ ...item, workOrderId }))} /></>;
}
