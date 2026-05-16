import { exportReadinessRequiresBillingPacket, simplyAccountingExportIsPrepOnly } from "@stax/accounting-handoff";
test("export readiness requires billing packet",()=>{expect(exportReadinessRequiresBillingPacket({approvedInvoice:true,billingPacketCreated:true})).toBe(true); expect(exportReadinessRequiresBillingPacket({approvedInvoice:true,billingPacketCreated:false})).toBe(false)});
test("export is prep only",()=>{expect(simplyAccountingExportIsPrepOnly()).toBe(true)});
