import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateQuoteRequestCommandInput {
  company?: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
  note?: string;
}

export interface CreateQuoteRequestCommandDTO {
  id: string;
  workflow: "quote-first";
  status: "REVIEWING";
  command: "CreateQuoteRequestCommand";
}

export class CreateQuoteRequestCommand implements GovernedCommand<CreateQuoteRequestCommandInput, CreateQuoteRequestCommandDTO> {
  validateInput(input: CreateQuoteRequestCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.name) throw new Error("name is required.");
    if (!input.email) throw new Error("email is required.");
    if (!input.details) throw new Error("details is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateQuoteRequestCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "quotes.create");
  }

  async executeMutation(input: CreateQuoteRequestCommandInput, context: CommandContext): Promise<CreateQuoteRequestCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.name),
      workflow: "quote-first",
      status: "REVIEWING",
      command: "CreateQuoteRequestCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateQuoteRequestCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateQuoteRequestCommand",
        workflow: "quote-first",
        entityId: String(input.name),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateQuoteRequestCommandDTO {
    const result = mutationResult as CreateQuoteRequestCommandDTO;
    return {
      id: result.id,
      workflow: "quote-first",
      status: "REVIEWING",
      command: "CreateQuoteRequestCommand"
    };
  }

  async run(input: CreateQuoteRequestCommandInput, context: CommandContext): Promise<CommandResult<CreateQuoteRequestCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
