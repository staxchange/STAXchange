import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ValidateProductPricingCommandInput {
  productId: string;
  sourceCostCents: number;
  marginPercent: number;
  note?: string;
}

export interface ValidateProductPricingCommandDTO {
  id: string;
  workflow: "pricing-approval";
  status: "VALIDATED";
  command: "ValidateProductPricingCommand";
}

export class ValidateProductPricingCommand implements GovernedCommand<ValidateProductPricingCommandInput, ValidateProductPricingCommandDTO> {
  validateInput(input: ValidateProductPricingCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.productId) throw new Error("productId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ValidateProductPricingCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.validate");
  }

  async executeMutation(input: ValidateProductPricingCommandInput, context: CommandContext): Promise<ValidateProductPricingCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.productId),
      workflow: "pricing-approval",
      status: "VALIDATED",
      command: "ValidateProductPricingCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ValidateProductPricingCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "ValidateProductPricingCommand",
        workflow: "pricing-approval",
        entityId: String(input.productId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ValidateProductPricingCommandDTO {
    const result = mutationResult as ValidateProductPricingCommandDTO;
    return {
      id: result.id,
      workflow: "pricing-approval",
      status: "VALIDATED",
      command: "ValidateProductPricingCommand"
    };
  }

  async run(input: ValidateProductPricingCommandInput, context: CommandContext): Promise<CommandResult<ValidateProductPricingCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
