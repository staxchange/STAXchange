import { supportDisclaimerCopy } from "@stax/launch-readiness";
import { createPageMetadata } from "../metadata";
import { LegalPage } from "../../components/LegalPage";

export const metadata = createPageMetadata({
  title: "Support Disclaimers",
  description: "Technical review, AI support, service intake, and human review disclaimers for DWG Process Supply.",
  path: "/disclaimers"
});

export default function SupportDisclaimersPage() {
  return <LegalPage copy={supportDisclaimerCopy} />;
}
