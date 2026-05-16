import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface AddInvoiceLineItemCommandInput {
  invoiceId: string;
  kind: "LABOR" | "PART" | "SERVICE" | "ADJUSTMENT";
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface AddInvoiceLineItemCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "LINE_ITEMS_ADDED";
  command: "AddInvoiceLineItemCommand";
}

export class AddInvoiceLineItemCommand implements GovernedCommand<AddInvoiceLineItemCommandInput, AddInvoiceLineItemCommandDTO> {
  validateInput(input: AddInvoiceLineItemCommandInput): void {
    if (!input.invoiceId) throw new Error("invoiceId is required.");
    if (!input.description) throw new Error("description is required.");
    if ("quantity" in input && typeof input.quantity === "number" && input.quantity <= 0) throw new Error("quantity must be positive.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AddInvoiceLineItemCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.invoice.line_item.add");
  }

  async executeMutation(input: AddInvoiceLineItemCommandInput, context: CommandContext): Promise<AddInvoiceLineItemCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.invoiceId,
      workflow: "service-billing",
      status: "LINE_ITEMS_ADDED",
      command: "AddInvoiceLineItemCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AddInvoiceLineItemCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as AddInvoiceLineItemCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AddInvoiceLineItemCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AddInvoiceLineItemCommandDTO {
    return mutationResult as AddInvoiceLineItemCommandDTO;
  }

  async run(input: AddInvoiceLineItemCommandInput, context: CommandContext): Promise<CommandResult<AddInvoiceLineItemCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
