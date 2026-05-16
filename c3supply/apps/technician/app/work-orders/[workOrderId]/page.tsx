import { WorkOrderDetailCard } from "../../../components/WorkOrderDetailCard";
import { HumanReviewRequiredBanner } from "../../../components/HumanReviewRequiredBanner";
import { placeholderWorkOrders } from "../../../lib/technician-placeholders";

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;
  const fallback = placeholderWorkOrders[0];
  if (!fallback) {
    return <><h1>Work Order Detail</h1><p>No placeholder work orders are available.</p></>;
  }
  const workOrder = placeholderWorkOrders.find((item) => item.id === workOrderId) ?? fallback;
  return <><h1>Work Order Detail</h1><HumanReviewRequiredBanner /><WorkOrderDetailCard workOrder={workOrder} /></>;
}
