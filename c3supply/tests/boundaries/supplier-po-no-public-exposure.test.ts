import { supplierPOCustomerVisible } from "@stax/supplier-purchasing";
test("supplier PO is not customer visible",()=>{ expect(supplierPOCustomerVisible()).toBe(false); });
