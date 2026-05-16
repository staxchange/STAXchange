import { billingPacketRequiresApprovedInvoice, billingPacketRequiredBeforeExport } from "@stax/commerce-billing";
test("billing packet requires approved invoice",()=>{expect(billingPacketRequiresApprovedInvoice("INVOICE_APPROVED")).toBe(true); expect(billingPacketRequiresApprovedInvoice("FINANCE_REVIEW_REQUIRED")).toBe(false)});
test("billing packet required before export",()=>{expect(billingPacketRequiredBeforeExport()).toBe(true)});
