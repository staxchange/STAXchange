import { autoFulfillmentAllowed } from "@stax/fulfillment";
test("auto fulfillment is disabled",()=>{ expect(autoFulfillmentAllowed()).toBe(false); });
