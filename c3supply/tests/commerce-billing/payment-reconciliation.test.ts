import { canSubmitFinanceReview, paymentReconciliationRequired } from "@stax/commerce-billing";
test("payment reconciliation required",()=>{expect(paymentReconciliationRequired()).toBe(true)});
test("finance review needs reconciliation and tax/freight review",()=>{expect(canSubmitFinanceReview({paymentReconciled:true,taxFreightReviewed:true})).toBe(true); expect(canSubmitFinanceReview({paymentReconciled:false,taxFreightReviewed:true})).toBe(false)});
