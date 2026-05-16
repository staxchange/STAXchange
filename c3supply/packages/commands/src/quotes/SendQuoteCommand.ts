import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SendQuoteCommandInput {
  quoteId: string;
  note?: string;
}

export interface SendQuoteCommandDTO {
  id: string;
  workflow: "quote-first";
  status: "SENT";
  command: "SendQuoteCommand";
}

export class SendQuoteCommand implements GovernedCommand<SendQuoteCommandInput, SendQuoteCommandDTO> {
  validateInput(input: SendQuoteCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.quoteId) throw new Error("quoteId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: SendQuoteCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "quotes.send");
  }

  async executeMutation(input: SendQuoteCommandInput, context: CommandContext): Promise<SendQuoteCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.quoteId),
      workflow: "quote-first",
      status: "SENT",
      command: "SendQuoteCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: SendQuoteCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "SendQuoteCommand",
        workflow: "quote-first",
        entityId: String(input.quoteId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): SendQuoteCommandDTO {
    const result = mutationResult as SendQuoteCommandDTO;
    return {
      id: result.id,
      workflow: "quote-first",
      status: "SENT",
      command: "SendQuoteCommand"
    };
  }

  async run(input: SendQuoteCommandInput, context: CommandContext): Promise<CommandResult<SendQuoteCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
