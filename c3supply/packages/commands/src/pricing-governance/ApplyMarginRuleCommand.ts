import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ApplyMarginRuleCommandInput {
  quoteId: string;
  sellPriceCents: number;
  costCents: number;
  minimumMarginPercent: number;
}

export interface ApplyMarginRuleCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "MARGIN_RULE_APPLIED";
  command: "ApplyMarginRuleCommand";
}

export class ApplyMarginRuleCommand implements GovernedCommand<ApplyMarginRuleCommandInput, ApplyMarginRuleCommandDTO> {
  validateInput(input: ApplyMarginRuleCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (input.sellPriceCents === undefined || input.sellPriceCents <= 0) throw new Error("sellPriceCents must be positive.");
    if (input.costCents === undefined || input.costCents <= 0) throw new Error("costCents must be positive.");
    if (input.minimumMarginPercent === undefined || input.minimumMarginPercent <= 0) throw new Error("minimumMarginPercent must be positive.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApplyMarginRuleCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.margin_rule.apply");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: ApplyMarginRuleCommandInput, context: CommandContext): Promise<ApplyMarginRuleCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "MARGIN_RULE_APPLIED",
      command: "ApplyMarginRuleCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ApplyMarginRuleCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ApplyMarginRuleCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApplyMarginRuleCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApplyMarginRuleCommandDTO {
    return mutationResult as ApplyMarginRuleCommandDTO;
  }

  async run(input: ApplyMarginRuleCommandInput, context: CommandContext): Promise<CommandResult<ApplyMarginRuleCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
