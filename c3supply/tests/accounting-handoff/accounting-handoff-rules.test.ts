import { accountingHandoffRequiresApprovedInvoice, directAccountingSyncAllowed, autoPostingEntriesAllowed } from "@stax/accounting-handoff";
test("accounting handoff requires approved invoice",()=>{expect(accountingHandoffRequiresApprovedInvoice("INVOICE_APPROVED")).toBe(true); expect(accountingHandoffRequiresApprovedInvoice("INVOICE_DRAFT_CREATED")).toBe(false)});
test("no direct sync or auto posting",()=>{expect(directAccountingSyncAllowed()).toBe(false); expect(autoPostingEntriesAllowed()).toBe(false)});
