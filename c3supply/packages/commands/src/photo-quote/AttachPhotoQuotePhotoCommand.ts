import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface AttachPhotoQuotePhotoCommandInput {
  intakeId: string;
  photoType: string;
  storageBucket: string;
  storagePath: string;
  uploadedBy: string;
}

export interface AttachPhotoQuotePhotoCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "PHOTOS_ATTACHED";
  command: "AttachPhotoQuotePhotoCommand";
}

export class AttachPhotoQuotePhotoCommand implements GovernedCommand<AttachPhotoQuotePhotoCommandInput, AttachPhotoQuotePhotoCommandDTO> {
  validateInput(input: AttachPhotoQuotePhotoCommandInput): void {
    if (!input.intakeId) throw new Error("intakeId is required.");
    if (!input.photoType) throw new Error("photoType is required.");
    if (!input.storageBucket) throw new Error("storageBucket is required.");
    if (!input.storagePath) throw new Error("storagePath is required.");
    if (!input.uploadedBy) throw new Error("uploadedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AttachPhotoQuotePhotoCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.photo.attach");
  }

  async executeMutation(input: AttachPhotoQuotePhotoCommandInput, context: CommandContext): Promise<AttachPhotoQuotePhotoCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "PHOTOS_ATTACHED",
      command: "AttachPhotoQuotePhotoCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AttachPhotoQuotePhotoCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as AttachPhotoQuotePhotoCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AttachPhotoQuotePhotoCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AttachPhotoQuotePhotoCommandDTO {
    return mutationResult as AttachPhotoQuotePhotoCommandDTO;
  }

  async run(input: AttachPhotoQuotePhotoCommandInput, context: CommandContext): Promise<CommandResult<AttachPhotoQuotePhotoCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
