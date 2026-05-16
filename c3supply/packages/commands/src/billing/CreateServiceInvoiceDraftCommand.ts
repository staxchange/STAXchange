import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateServiceInvoiceDraftCommandInput {
  workOrderId: string;
  customerId?: string;
  currency: "CAD" | "USD";
}

export interface CreateServiceInvoiceDraftCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "INVOICE_DRAFT_CREATED";
  command: "CreateServiceInvoiceDraftCommand";
}

export class CreateServiceInvoiceDraftCommand implements GovernedCommand<CreateServiceInvoiceDraftCommandInput, CreateServiceInvoiceDraftCommandDTO> {
  validateInput(input: CreateServiceInvoiceDraftCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.currency) throw new Error("currency is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateServiceInvoiceDraftCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.invoice.create");
  }

  async executeMutation(input: CreateServiceInvoiceDraftCommandInput, context: CommandContext): Promise<CreateServiceInvoiceDraftCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.workOrderId,
      workflow: "service-billing",
      status: "INVOICE_DRAFT_CREATED",
      command: "CreateServiceInvoiceDraftCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateServiceInvoiceDraftCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateServiceInvoiceDraftCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateServiceInvoiceDraftCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateServiceInvoiceDraftCommandDTO {
    return mutationResult as CreateServiceInvoiceDraftCommandDTO;
  }

  async run(input: CreateServiceInvoiceDraftCommandInput, context: CommandContext): Promise<CommandResult<CreateServiceInvoiceDraftCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
