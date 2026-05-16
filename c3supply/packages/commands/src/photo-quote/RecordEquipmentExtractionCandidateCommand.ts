import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RecordEquipmentExtractionCandidateCommandInput {
  intakeId: string;
  visibleText?: string;
  modelCandidate?: string;
  serialCandidate?: string;
  equipmentCategoryCandidate?: string;
  humanReviewSummary: string;
}

export interface RecordEquipmentExtractionCandidateCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "AI_EXTRACTION_OPTIONAL";
  command: "RecordEquipmentExtractionCandidateCommand";
}

export class RecordEquipmentExtractionCandidateCommand implements GovernedCommand<RecordEquipmentExtractionCandidateCommandInput, RecordEquipmentExtractionCandidateCommandDTO> {
  validateInput(input: RecordEquipmentExtractionCandidateCommandInput): void {
    if (!input.intakeId) throw new Error("intakeId is required.");
    if (!input.humanReviewSummary) throw new Error("humanReviewSummary is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RecordEquipmentExtractionCandidateCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.extraction.record");
  }

  async executeMutation(input: RecordEquipmentExtractionCandidateCommandInput, context: CommandContext): Promise<RecordEquipmentExtractionCandidateCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "AI_EXTRACTION_OPTIONAL",
      command: "RecordEquipmentExtractionCandidateCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RecordEquipmentExtractionCandidateCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RecordEquipmentExtractionCandidateCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RecordEquipmentExtractionCandidateCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RecordEquipmentExtractionCandidateCommandDTO {
    return mutationResult as RecordEquipmentExtractionCandidateCommandDTO;
  }

  async run(input: RecordEquipmentExtractionCandidateCommandInput, context: CommandContext): Promise<CommandResult<RecordEquipmentExtractionCandidateCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
