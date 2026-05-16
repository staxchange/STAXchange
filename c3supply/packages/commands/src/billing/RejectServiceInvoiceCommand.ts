import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RejectServiceInvoiceCommandInput {
  invoiceId: string;
  rejectedBy: string;
  reason: string;
}

export interface RejectServiceInvoiceCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "INVOICE_REJECTED";
  command: "RejectServiceInvoiceCommand";
}

export class RejectServiceInvoiceCommand implements GovernedCommand<RejectServiceInvoiceCommandInput, RejectServiceInvoiceCommandDTO> {
  validateInput(input: RejectServiceInvoiceCommandInput): void {
    if (!input.invoiceId) throw new Error("invoiceId is required.");
    if (!input.rejectedBy) throw new Error("rejectedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RejectServiceInvoiceCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.invoice.reject");
  }

  async executeMutation(input: RejectServiceInvoiceCommandInput, context: CommandContext): Promise<RejectServiceInvoiceCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.invoiceId,
      workflow: "service-billing",
      status: "INVOICE_REJECTED",
      command: "RejectServiceInvoiceCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RejectServiceInvoiceCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RejectServiceInvoiceCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RejectServiceInvoiceCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RejectServiceInvoiceCommandDTO {
    return mutationResult as RejectServiceInvoiceCommandDTO;
  }

  async run(input: RejectServiceInvoiceCommandInput, context: CommandContext): Promise<CommandResult<RejectServiceInvoiceCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
