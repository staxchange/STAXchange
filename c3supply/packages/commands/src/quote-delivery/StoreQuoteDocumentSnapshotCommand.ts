import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface StoreQuoteDocumentSnapshotCommandInput { quoteDeliveryId: string; quoteDocumentId: string; storageBucket: string; storagePath: string; contentType: "text/html" | "application/pdf"; }

export interface StoreQuoteDocumentSnapshotCommandDTO { id: string; workflow: "quote-delivery"; status: "DOCUMENT_STORED"; command: "StoreQuoteDocumentSnapshotCommand"; }

export class StoreQuoteDocumentSnapshotCommand implements GovernedCommand<StoreQuoteDocumentSnapshotCommandInput, StoreQuoteDocumentSnapshotCommandDTO> {
  validateInput(input: StoreQuoteDocumentSnapshotCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.storageBucket) throw new Error("storageBucket is required.");
    if (!input.storagePath) throw new Error("storagePath is required.");
    if (!input.contentType) throw new Error("contentType is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: StoreQuoteDocumentSnapshotCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.document.store"); }
  async executeMutation(input: StoreQuoteDocumentSnapshotCommandInput, context: CommandContext): Promise<StoreQuoteDocumentSnapshotCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "DOCUMENT_STORED", command: "StoreQuoteDocumentSnapshotCommand" };
  }
  async appendAuditEvent(actor: Actor, input: StoreQuoteDocumentSnapshotCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as StoreQuoteDocumentSnapshotCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "StoreQuoteDocumentSnapshotCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): StoreQuoteDocumentSnapshotCommandDTO { return mutationResult as StoreQuoteDocumentSnapshotCommandDTO; }
  async run(input: StoreQuoteDocumentSnapshotCommandInput, context: CommandContext): Promise<CommandResult<StoreQuoteDocumentSnapshotCommandDTO>> { return runGovernedCommand(this, input, context); }
}
