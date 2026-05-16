import { WorkOrderList } from "../components/WorkOrderList";
import { HumanReviewRequiredBanner } from "../components/HumanReviewRequiredBanner";
import { placeholderWorkOrders } from "../lib/technician-placeholders";

export default function TechnicianDashboardPage() {
  return <><p className="kicker">Technician portal</p><h1>Assigned field work</h1><HumanReviewRequiredBanner /><h2>Today</h2><WorkOrderList workOrders={placeholderWorkOrders} /></>;
}
