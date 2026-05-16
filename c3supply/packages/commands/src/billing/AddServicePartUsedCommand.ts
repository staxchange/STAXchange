import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface AddServicePartUsedCommandInput {
  workOrderId: string;
  sku?: string;
  productId?: string;
  description: string;
  quantity: number;
  billable: boolean;
}

export interface AddServicePartUsedCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "PARTS_RECORDED";
  command: "AddServicePartUsedCommand";
}

export class AddServicePartUsedCommand implements GovernedCommand<AddServicePartUsedCommandInput, AddServicePartUsedCommandDTO> {
  validateInput(input: AddServicePartUsedCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.description) throw new Error("description is required.");
    if ("quantity" in input && typeof input.quantity === "number" && input.quantity <= 0) throw new Error("quantity must be positive.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AddServicePartUsedCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.parts.add");
  }

  async executeMutation(input: AddServicePartUsedCommandInput, context: CommandContext): Promise<AddServicePartUsedCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.workOrderId,
      workflow: "service-billing",
      status: "PARTS_RECORDED",
      command: "AddServicePartUsedCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AddServicePartUsedCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as AddServicePartUsedCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AddServicePartUsedCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AddServicePartUsedCommandDTO {
    return mutationResult as AddServicePartUsedCommandDTO;
  }

  async run(input: AddServicePartUsedCommandInput, context: CommandContext): Promise<CommandResult<AddServicePartUsedCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
