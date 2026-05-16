import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ClosePhotoQuoteIntakeCommandInput {
  intakeId: string;
  closedBy: string;
  reason: string;
}

export interface ClosePhotoQuoteIntakeCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "CLOSED";
  command: "ClosePhotoQuoteIntakeCommand";
}

export class ClosePhotoQuoteIntakeCommand implements GovernedCommand<ClosePhotoQuoteIntakeCommandInput, ClosePhotoQuoteIntakeCommandDTO> {
  validateInput(input: ClosePhotoQuoteIntakeCommandInput): void {
    if (!input.intakeId) throw new Error("intakeId is required.");
    if (!input.closedBy) throw new Error("closedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ClosePhotoQuoteIntakeCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.close");
  }

  async executeMutation(input: ClosePhotoQuoteIntakeCommandInput, context: CommandContext): Promise<ClosePhotoQuoteIntakeCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "CLOSED",
      command: "ClosePhotoQuoteIntakeCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ClosePhotoQuoteIntakeCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ClosePhotoQuoteIntakeCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ClosePhotoQuoteIntakeCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ClosePhotoQuoteIntakeCommandDTO {
    return mutationResult as ClosePhotoQuoteIntakeCommandDTO;
  }

  async run(input: ClosePhotoQuoteIntakeCommandInput, context: CommandContext): Promise<CommandResult<ClosePhotoQuoteIntakeCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
