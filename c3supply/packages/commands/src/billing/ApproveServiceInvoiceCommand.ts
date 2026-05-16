import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ApproveServiceInvoiceCommandInput {
  invoiceId: string;
  approvedBy: string;
  financeNote?: string;
}

export interface ApproveServiceInvoiceCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "INVOICE_APPROVED";
  command: "ApproveServiceInvoiceCommand";
}

export class ApproveServiceInvoiceCommand implements GovernedCommand<ApproveServiceInvoiceCommandInput, ApproveServiceInvoiceCommandDTO> {
  validateInput(input: ApproveServiceInvoiceCommandInput): void {
    if (!input.invoiceId) throw new Error("invoiceId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApproveServiceInvoiceCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.invoice.approve");
  }

  async executeMutation(input: ApproveServiceInvoiceCommandInput, context: CommandContext): Promise<ApproveServiceInvoiceCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.invoiceId,
      workflow: "service-billing",
      status: "INVOICE_APPROVED",
      command: "ApproveServiceInvoiceCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ApproveServiceInvoiceCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ApproveServiceInvoiceCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApproveServiceInvoiceCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApproveServiceInvoiceCommandDTO {
    return mutationResult as ApproveServiceInvoiceCommandDTO;
  }

  async run(input: ApproveServiceInvoiceCommandInput, context: CommandContext): Promise<CommandResult<ApproveServiceInvoiceCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
