import { sageExportIsPrepOnly } from "@stax/service-billing";

export default function SageExportPage() {
  return (
    <section>
      <h1>Simply Accounting Export Prep</h1>
      <p>
        Batch preparation only. Direct Simply Accounting sync is disabled: {String(sageExportIsPrepOnly())}.
      </p>
    </section>
  );
}
