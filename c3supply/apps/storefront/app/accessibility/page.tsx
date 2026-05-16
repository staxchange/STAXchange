import { accessibilityCopy } from "@stax/launch-readiness";
import { createPageMetadata } from "../metadata";
import { LegalPage } from "../../components/LegalPage";

export const metadata = createPageMetadata({
  title: "Accessibility",
  description: "Accessibility statement for the DWG Process Supply storefront.",
  path: "/accessibility"
});

export default function AccessibilityPage() {
  return <LegalPage copy={accessibilityCopy} />;
}
