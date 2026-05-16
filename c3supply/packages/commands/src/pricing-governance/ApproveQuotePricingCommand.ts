import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ApproveQuotePricingCommandInput {
  quoteId: string;
  approvedBy: string;
}

export interface ApproveQuotePricingCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "PRICING_APPROVED";
  command: "ApproveQuotePricingCommand";
}

export class ApproveQuotePricingCommand implements GovernedCommand<ApproveQuotePricingCommandInput, ApproveQuotePricingCommandDTO> {
  validateInput(input: ApproveQuotePricingCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApproveQuotePricingCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.quote.approve");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: ApproveQuotePricingCommandInput, context: CommandContext): Promise<ApproveQuotePricingCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "PRICING_APPROVED",
      command: "ApproveQuotePricingCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ApproveQuotePricingCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ApproveQuotePricingCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApproveQuotePricingCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApproveQuotePricingCommandDTO {
    return mutationResult as ApproveQuotePricingCommandDTO;
  }

  async run(input: ApproveQuotePricingCommandInput, context: CommandContext): Promise<CommandResult<ApproveQuotePricingCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
