import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RejectQuotePricingCommandInput {
  quoteId: string;
  rejectedBy: string;
  reason: string;
}

export interface RejectQuotePricingCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "PRICING_REJECTED";
  command: "RejectQuotePricingCommand";
}

export class RejectQuotePricingCommand implements GovernedCommand<RejectQuotePricingCommandInput, RejectQuotePricingCommandDTO> {
  validateInput(input: RejectQuotePricingCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.rejectedBy) throw new Error("rejectedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RejectQuotePricingCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.quote.reject");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: RejectQuotePricingCommandInput, context: CommandContext): Promise<RejectQuotePricingCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "PRICING_REJECTED",
      command: "RejectQuotePricingCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RejectQuotePricingCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RejectQuotePricingCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RejectQuotePricingCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RejectQuotePricingCommandDTO {
    return mutationResult as RejectQuotePricingCommandDTO;
  }

  async run(input: RejectQuotePricingCommandInput, context: CommandContext): Promise<CommandResult<RejectQuotePricingCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
