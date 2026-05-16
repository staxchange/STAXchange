import { createCustomerFulfillmentView, customerViewContainsSupplierPO } from "@stax/fulfillment";
test("customer view is safe status only",()=>{ const view=createCustomerFulfillmentView({orderId:"o1",status:"SHIPMENT_PENDING"}); expect(view.customerMessage).toContain("Shipment"); expect(customerViewContainsSupplierPO()).toBe(false); });
