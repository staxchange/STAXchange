import { dropshipAutoOrderAllowed, dropshipRequestIsPreparationOnly } from "@stax/supplier-purchasing";
test("dropship request is prep only",()=>{ expect(dropshipRequestIsPreparationOnly()).toBe(true); expect(dropshipAutoOrderAllowed()).toBe(false); });
