import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface LockQuotePricingCommandInput {
  quoteId: string;
  lockedBy: string;
}

export interface LockQuotePricingCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "QUOTE_PRICING_LOCKED";
  command: "LockQuotePricingCommand";
}

export class LockQuotePricingCommand implements GovernedCommand<LockQuotePricingCommandInput, LockQuotePricingCommandDTO> {
  validateInput(input: LockQuotePricingCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.lockedBy) throw new Error("lockedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: LockQuotePricingCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.quote.lock");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: LockQuotePricingCommandInput, context: CommandContext): Promise<LockQuotePricingCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "QUOTE_PRICING_LOCKED",
      command: "LockQuotePricingCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: LockQuotePricingCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as LockQuotePricingCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "LockQuotePricingCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): LockQuotePricingCommandDTO {
    return mutationResult as LockQuotePricingCommandDTO;
  }

  async run(input: LockQuotePricingCommandInput, context: CommandContext): Promise<CommandResult<LockQuotePricingCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
