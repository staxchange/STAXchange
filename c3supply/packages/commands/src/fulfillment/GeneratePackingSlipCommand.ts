import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface GeneratePackingSlipCommandInput {
  fulfillmentRequestId: string;
  note?: string;
}

export interface GeneratePackingSlipCommandDTO {
  id: string;
  workflow: "fulfillment";
  status: "PACKING_SLIP_GENERATED";
  command: "GeneratePackingSlipCommand";
}

export class GeneratePackingSlipCommand implements GovernedCommand<GeneratePackingSlipCommandInput, GeneratePackingSlipCommandDTO> {
  validateInput(input: GeneratePackingSlipCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.fulfillmentRequestId) throw new Error("fulfillmentRequestId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: GeneratePackingSlipCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "fulfillment.packing_slip");
  }

  async executeMutation(input: GeneratePackingSlipCommandInput, context: CommandContext): Promise<GeneratePackingSlipCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.fulfillmentRequestId),
      workflow: "fulfillment",
      status: "PACKING_SLIP_GENERATED",
      command: "GeneratePackingSlipCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: GeneratePackingSlipCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "GeneratePackingSlipCommand",
        workflow: "fulfillment",
        entityId: String(input.fulfillmentRequestId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): GeneratePackingSlipCommandDTO {
    const result = mutationResult as GeneratePackingSlipCommandDTO;
    return {
      id: result.id,
      workflow: "fulfillment",
      status: "PACKING_SLIP_GENERATED",
      command: "GeneratePackingSlipCommand"
    };
  }

  async run(input: GeneratePackingSlipCommandInput, context: CommandContext): Promise<CommandResult<GeneratePackingSlipCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
