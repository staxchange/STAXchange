import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface SubmitInvoiceForReviewCommandInput {
  invoiceId: string;
  submittedBy: string;
}

export interface SubmitInvoiceForReviewCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "INVOICE_REVIEW_REQUIRED";
  command: "SubmitInvoiceForReviewCommand";
}

export class SubmitInvoiceForReviewCommand implements GovernedCommand<SubmitInvoiceForReviewCommandInput, SubmitInvoiceForReviewCommandDTO> {
  validateInput(input: SubmitInvoiceForReviewCommandInput): void {
    if (!input.invoiceId) throw new Error("invoiceId is required.");
    if (!input.submittedBy) throw new Error("submittedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: SubmitInvoiceForReviewCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.invoice.submit_review");
  }

  async executeMutation(input: SubmitInvoiceForReviewCommandInput, context: CommandContext): Promise<SubmitInvoiceForReviewCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.invoiceId,
      workflow: "service-billing",
      status: "INVOICE_REVIEW_REQUIRED",
      command: "SubmitInvoiceForReviewCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: SubmitInvoiceForReviewCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as SubmitInvoiceForReviewCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "SubmitInvoiceForReviewCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): SubmitInvoiceForReviewCommandDTO {
    return mutationResult as SubmitInvoiceForReviewCommandDTO;
  }

  async run(input: SubmitInvoiceForReviewCommandInput, context: CommandContext): Promise<CommandResult<SubmitInvoiceForReviewCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
