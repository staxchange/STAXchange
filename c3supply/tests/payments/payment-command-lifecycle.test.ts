import { CreatePaymentRequestCommand, CreateStripeCheckoutSessionCommand, RecordPaymentSucceededCommand } from "@stax/commands";
test("payment commands expose lifecycle", () => {
  for (const command of [new CreatePaymentRequestCommand(), new CreateStripeCheckoutSessionCommand(), new RecordPaymentSucceededCommand()]) {
    expect(typeof command.validateInput).toBe("function");
    expect(typeof command.validateActor).toBe("function");
    expect(typeof command.governanceGuard).toBe("function");
    expect(typeof command.executeMutation).toBe("function");
    expect(typeof command.appendAuditEvent).toBe("function");
    expect(typeof command.returnSafeDTO).toBe("function");
    expect(typeof command.run).toBe("function");
  }
});
