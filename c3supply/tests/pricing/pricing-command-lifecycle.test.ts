import {
  CreateSupplierCostRecordCommand,
  ApproveQuotePricingCommand,
  LockQuotePricingCommand
} from "@stax/commands";

test("pricing commands expose lifecycle methods", () => {
  for (const command of [
    new CreateSupplierCostRecordCommand(),
    new ApproveQuotePricingCommand(),
    new LockQuotePricingCommand()
  ]) {
    expect(typeof command.validateInput).toBe("function");
    expect(typeof command.validateActor).toBe("function");
    expect(typeof command.governanceGuard).toBe("function");
    expect(typeof command.executeMutation).toBe("function");
    expect(typeof command.appendAuditEvent).toBe("function");
    expect(typeof command.returnSafeDTO).toBe("function");
    expect(typeof command.run).toBe("function");
  }
});
