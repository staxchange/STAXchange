import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface DraftQuoteCommandInput {
  quoteId: string;
  note?: string;
}

export interface DraftQuoteCommandDTO {
  id: string;
  workflow: "quote-first";
  status: "DRAFTED";
  command: "DraftQuoteCommand";
}

export class DraftQuoteCommand implements GovernedCommand<DraftQuoteCommandInput, DraftQuoteCommandDTO> {
  validateInput(input: DraftQuoteCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.quoteId) throw new Error("quoteId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: DraftQuoteCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "quotes.draft");
  }

  async executeMutation(input: DraftQuoteCommandInput, context: CommandContext): Promise<DraftQuoteCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.quoteId),
      workflow: "quote-first",
      status: "DRAFTED",
      command: "DraftQuoteCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: DraftQuoteCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "DraftQuoteCommand",
        workflow: "quote-first",
        entityId: String(input.quoteId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): DraftQuoteCommandDTO {
    const result = mutationResult as DraftQuoteCommandDTO;
    return {
      id: result.id,
      workflow: "quote-first",
      status: "DRAFTED",
      command: "DraftQuoteCommand"
    };
  }

  async run(input: DraftQuoteCommandInput, context: CommandContext): Promise<CommandResult<DraftQuoteCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
