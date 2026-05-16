import { termsOfServiceCopy } from "@stax/launch-readiness";
import { createPageMetadata } from "../metadata";
import { LegalPage } from "../../components/LegalPage";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "DWG Process Supply terms for quote-first ecommerce, service intake, support, billing, and accounting export prep.",
  path: "/terms"
});

export default function TermsofServicePage() {
  return <LegalPage copy={termsOfServiceCopy} />;
}
