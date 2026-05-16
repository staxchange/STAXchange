import { WorkOrderList } from "../../components/WorkOrderList";
import { placeholderWorkOrders } from "../../lib/technician-placeholders";

export default function WorkOrdersPage() {
  return <><h1>Assigned Work Orders</h1><WorkOrderList workOrders={placeholderWorkOrders} /></>;
}
