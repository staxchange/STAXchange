import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveRetailPriceCommandInput {
  productId: string;
  retailPriceCents: number;
  note?: string;
}

export interface ApproveRetailPriceCommandDTO {
  id: string;
  workflow: "pricing-approval";
  status: "APPROVED";
  command: "ApproveRetailPriceCommand";
}

export class ApproveRetailPriceCommand implements GovernedCommand<ApproveRetailPriceCommandInput, ApproveRetailPriceCommandDTO> {
  validateInput(input: ApproveRetailPriceCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.productId) throw new Error("productId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApproveRetailPriceCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.approve");
  }

  async executeMutation(input: ApproveRetailPriceCommandInput, context: CommandContext): Promise<ApproveRetailPriceCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.productId),
      workflow: "pricing-approval",
      status: "APPROVED",
      command: "ApproveRetailPriceCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ApproveRetailPriceCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApproveRetailPriceCommand",
        workflow: "pricing-approval",
        entityId: String(input.productId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApproveRetailPriceCommandDTO {
    const result = mutationResult as ApproveRetailPriceCommandDTO;
    return {
      id: result.id,
      workflow: "pricing-approval",
      status: "APPROVED",
      command: "ApproveRetailPriceCommand"
    };
  }

  async run(input: ApproveRetailPriceCommandInput, context: CommandContext): Promise<CommandResult<ApproveRetailPriceCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
