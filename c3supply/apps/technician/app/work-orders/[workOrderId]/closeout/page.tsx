import { CloseoutForm } from "../../../../components/CloseoutForm";
import { technicianCopy } from "../../../../lib/technician-copy";

export default async function CloseoutPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;
  return <><h1>Technician Closeout</h1><p>{technicianCopy.closeout}</p><CloseoutForm workOrderId={workOrderId} /></>;
}
