import { directAccountingSyncAllowed, autoPostingEntriesAllowed } from "@stax/accounting-handoff";
test("accounting handoff does not allow direct sync or auto posting",()=>{expect(directAccountingSyncAllowed()).toBe(false); expect(autoPostingEntriesAllowed()).toBe(false)});
