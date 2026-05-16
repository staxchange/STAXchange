import { privacyPolicyCopy } from "@stax/launch-readiness";
import { createPageMetadata } from "../metadata";
import { LegalPage } from "../../components/LegalPage";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "DWG Process Supply privacy policy for quote, service, support, and customer workflows.",
  path: "/privacy"
});

export default function PrivacyPolicyPage() {
  return <LegalPage copy={privacyPolicyCopy} />;
}
