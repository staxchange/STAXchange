import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateCapitalSignalCommandInput {
  source: string;
  summary: string;
  note?: string;
}

export interface CreateCapitalSignalCommandDTO {
  id: string;
  workflow: "capital-signal";
  status: "CREATED";
  command: "CreateCapitalSignalCommand";
}

export class CreateCapitalSignalCommand implements GovernedCommand<CreateCapitalSignalCommandInput, CreateCapitalSignalCommandDTO> {
  validateInput(input: CreateCapitalSignalCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.source) throw new Error("source is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateCapitalSignalCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "ops.capital_signal");
  }

  async executeMutation(input: CreateCapitalSignalCommandInput, context: CommandContext): Promise<CreateCapitalSignalCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.source),
      workflow: "capital-signal",
      status: "CREATED",
      command: "CreateCapitalSignalCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateCapitalSignalCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateCapitalSignalCommand",
        workflow: "capital-signal",
        entityId: String(input.source),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateCapitalSignalCommandDTO {
    const result = mutationResult as CreateCapitalSignalCommandDTO;
    return {
      id: result.id,
      workflow: "capital-signal",
      status: "CREATED",
      command: "CreateCapitalSignalCommand"
    };
  }

  async run(input: CreateCapitalSignalCommandInput, context: CommandContext): Promise<CommandResult<CreateCapitalSignalCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
