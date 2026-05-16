import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AttachServicePhotoCommandInput { workOrderId: string; technicianId: string; objectPath: string; contentType: string; }

export interface AttachServicePhotoCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "PHOTOS_ATTACHED";
  command: "AttachServicePhotoCommand";
}

export class AttachServicePhotoCommand implements GovernedCommand<AttachServicePhotoCommandInput, AttachServicePhotoCommandDTO> {
  validateInput(input: AttachServicePhotoCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
    if (!input.objectPath) throw new Error("objectPath is required.");
    if (!input.contentType) throw new Error("contentType is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AttachServicePhotoCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.photo.attach");
  }

  async executeMutation(input: AttachServicePhotoCommandInput, context: CommandContext): Promise<AttachServicePhotoCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "technician-work-order",
      status: "PHOTOS_ATTACHED",
      command: "AttachServicePhotoCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: AttachServicePhotoCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AttachServicePhotoCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AttachServicePhotoCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, technicianId: input.technicianId, contentType: input.contentType }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AttachServicePhotoCommandDTO {
    return mutationResult as AttachServicePhotoCommandDTO;
  }

  async run(input: AttachServicePhotoCommandInput, context: CommandContext): Promise<CommandResult<AttachServicePhotoCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
