import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AddServicePartUsedCommandInput { workOrderId: string; technicianId: string; description: string; sku?: string; quantity: number; }

export interface AddServicePartUsedCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "PARTS_RECORDED";
  command: "AddServicePartUsedCommand";
}

export class AddServicePartUsedCommand implements GovernedCommand<AddServicePartUsedCommandInput, AddServicePartUsedCommandDTO> {
  validateInput(input: AddServicePartUsedCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
    if (!input.description?.trim()) throw new Error("description is required.");
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new Error("quantity must be greater than zero.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AddServicePartUsedCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.parts.add");
  }

  async executeMutation(input: AddServicePartUsedCommandInput, context: CommandContext): Promise<AddServicePartUsedCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "technician-work-order",
      status: "PARTS_RECORDED",
      command: "AddServicePartUsedCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: AddServicePartUsedCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AddServicePartUsedCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AddServicePartUsedCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, technicianId: input.technicianId, sku: input.sku, quantity: input.quantity }
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
