import { supplierPOAutoSendAllowed, supplierPOCustomerVisible, supplierPORequiresHumanApproval } from "@stax/supplier-purchasing";
test("supplier PO requires human review and cannot auto-send",()=>{ expect(supplierPORequiresHumanApproval()).toBe(true); expect(supplierPOAutoSendAllowed()).toBe(false); expect(supplierPOCustomerVisible()).toBe(false); });
