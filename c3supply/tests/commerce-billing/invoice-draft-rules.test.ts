import { financeReviewRequiredBeforeInvoiceApproval, validateInvoiceDraftReferences } from "@stax/commerce-billing";
test("invoice draft requires quote/order/payment/fulfillment references",()=>{expect(validateInvoiceDraftReferences({quoteId:"q",orderId:"o",paymentId:"p",fulfillmentId:"f"})).toEqual([])});
test("finance review required",()=>{expect(financeReviewRequiredBeforeInvoiceApproval()).toBe(true)});
