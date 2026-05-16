import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AcceptQuoteCommandInput {
  quoteId: string;
  note?: string;
}

export interface AcceptQuoteCommandDTO {
  id: string;
  workflow: "quote-first";
  status: "ACCEPTED";
  command: "AcceptQuoteCommand";
}

export class AcceptQuoteCommand implements GovernedCommand<AcceptQuoteCommandInput, AcceptQuoteCommandDTO> {
  validateInput(input: AcceptQuoteCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.quoteId) throw new Error("quoteId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AcceptQuoteCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "quotes.accept");
  }

  async executeMutation(input: AcceptQuoteCommandInput, context: CommandContext): Promise<AcceptQuoteCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.quoteId),
      workflow: "quote-first",
      status: "ACCEPTED",
      command: "AcceptQuoteCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AcceptQuoteCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "AcceptQuoteCommand",
        workflow: "quote-first",
        entityId: String(input.quoteId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AcceptQuoteCommandDTO {
    const result = mutationResult as AcceptQuoteCommandDTO;
    return {
      id: result.id,
      workflow: "quote-first",
      status: "ACCEPTED",
      command: "AcceptQuoteCommand"
    };
  }

  async run(input: AcceptQuoteCommandInput, context: CommandContext): Promise<CommandResult<AcceptQuoteCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
