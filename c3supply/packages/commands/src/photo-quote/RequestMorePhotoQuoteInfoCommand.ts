import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RequestMorePhotoQuoteInfoCommandInput {
  intakeId: string;
  requestedBy: string;
  reason: string;
}

export interface RequestMorePhotoQuoteInfoCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "MORE_INFO_REQUIRED";
  command: "RequestMorePhotoQuoteInfoCommand";
}

export class RequestMorePhotoQuoteInfoCommand implements GovernedCommand<RequestMorePhotoQuoteInfoCommandInput, RequestMorePhotoQuoteInfoCommandDTO> {
  validateInput(input: RequestMorePhotoQuoteInfoCommandInput): void {
    if (!input.intakeId) throw new Error("intakeId is required.");
    if (!input.requestedBy) throw new Error("requestedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RequestMorePhotoQuoteInfoCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.more_info.request");
  }

  async executeMutation(input: RequestMorePhotoQuoteInfoCommandInput, context: CommandContext): Promise<RequestMorePhotoQuoteInfoCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "MORE_INFO_REQUIRED",
      command: "RequestMorePhotoQuoteInfoCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RequestMorePhotoQuoteInfoCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RequestMorePhotoQuoteInfoCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RequestMorePhotoQuoteInfoCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RequestMorePhotoQuoteInfoCommandDTO {
    return mutationResult as RequestMorePhotoQuoteInfoCommandDTO;
  }

  async run(input: RequestMorePhotoQuoteInfoCommandInput, context: CommandContext): Promise<CommandResult<RequestMorePhotoQuoteInfoCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
