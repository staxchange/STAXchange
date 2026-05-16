import { supplierPOAutoSendAllowed } from "@stax/supplier-purchasing";
test("supplier PO cannot auto-send",()=>{ expect(supplierPOAutoSendAllowed()).toBe(false); });
