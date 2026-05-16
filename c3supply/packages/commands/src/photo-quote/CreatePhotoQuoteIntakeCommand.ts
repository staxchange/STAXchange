import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreatePhotoQuoteIntakeCommandInput {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  siteName: string;
  siteLocation?: string;
  operatorId: string;
  priority: "LOW" | "STANDARD" | "HIGH" | "URGENT";
  notes: string;
}

export interface CreatePhotoQuoteIntakeCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "PHOTO_INTAKE_CREATED";
  command: "CreatePhotoQuoteIntakeCommand";
}

export class CreatePhotoQuoteIntakeCommand implements GovernedCommand<CreatePhotoQuoteIntakeCommandInput, CreatePhotoQuoteIntakeCommandDTO> {
  validateInput(input: CreatePhotoQuoteIntakeCommandInput): void {
    if (!input.customerName) throw new Error("customerName is required.");
    if (!input.siteName) throw new Error("siteName is required.");
    if (!input.operatorId) throw new Error("operatorId is required.");
    if (!input.priority) throw new Error("priority is required.");
    if (!input.notes) throw new Error("notes is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreatePhotoQuoteIntakeCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.intake.create");
  }

  async executeMutation(input: CreatePhotoQuoteIntakeCommandInput, context: CommandContext): Promise<CreatePhotoQuoteIntakeCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "PHOTO_INTAKE_CREATED",
      command: "CreatePhotoQuoteIntakeCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreatePhotoQuoteIntakeCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreatePhotoQuoteIntakeCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreatePhotoQuoteIntakeCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreatePhotoQuoteIntakeCommandDTO {
    return mutationResult as CreatePhotoQuoteIntakeCommandDTO;
  }

  async run(input: CreatePhotoQuoteIntakeCommandInput, context: CommandContext): Promise<CommandResult<CreatePhotoQuoteIntakeCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
