import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface GenerateQuotePdfCommandInput { quoteDocumentId: string; documentApproved: boolean; generatedBy: string; }
export interface GenerateQuotePdfCommandDTO { id: string; workflow: "quote-document"; status: "PDF_READY"; command: "GenerateQuotePdfCommand"; }

export class GenerateQuotePdfCommand implements GovernedCommand<GenerateQuotePdfCommandInput, GenerateQuotePdfCommandDTO> {
  validateInput(input: GenerateQuotePdfCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.generatedBy) throw new Error("generatedBy is required.");
    if (!input.documentApproved) throw new Error("documentApproved is required before PDF generation.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: GenerateQuotePdfCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.generate_pdf"); }
  async executeMutation(input: GenerateQuotePdfCommandInput, context: CommandContext): Promise<GenerateQuotePdfCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "PDF_READY", command: "GenerateQuotePdfCommand" }; }
  async appendAuditEvent(actor: Actor, input: GenerateQuotePdfCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as GenerateQuotePdfCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "GenerateQuotePdfCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): GenerateQuotePdfCommandDTO { return mutationResult as GenerateQuotePdfCommandDTO; }
  async run(input: GenerateQuotePdfCommandInput, context: CommandContext): Promise<CommandResult<GenerateQuotePdfCommandDTO>> { return runGovernedCommand(this, input, context); }
}
