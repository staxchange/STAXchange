import { QuoteFunnelCards } from "../../components/QuoteFunnelCards";
import { EmergencyServiceCTA } from "../../components/EmergencyServiceCTA";
import ServiceRequestForm from "./ServiceRequestForm";

export default function ServicePage() {
  return (
    <main className="page">
      <p className="kicker">Treatment system service</p>
      <h1>Request boiler-room service review</h1>
      <p>
        Submit service issues for DWG Process Supply review. Leaks, flooding, electrical,
        chemical, installation, and safety concerns are routed to urgent human review.
      </p>
      <QuoteFunnelCards mode="service" />
      <EmergencyServiceCTA />
      <ServiceRequestForm />
    </main>
  );
}
