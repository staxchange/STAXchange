import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateCommerceBillingPacketCommandInput { invoiceId: string; createdBy: string; }
export interface CreateCommerceBillingPacketCommandDTO { id: string; workflow: "commerce-billing"; status: "BILLING_PACKET_CREATED"; command: "CreateCommerceBillingPacketCommand"; }
export class CreateCommerceBillingPacketCommand implements GovernedCommand<CreateCommerceBillingPacketCommandInput, CreateCommerceBillingPacketCommandDTO> {
  validateInput(input: CreateCommerceBillingPacketCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).createdBy) throw new Error("createdBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateCommerceBillingPacketCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_billing_packet.create"); }
  async executeMutation(input: CreateCommerceBillingPacketCommandInput, context: CommandContext): Promise<CreateCommerceBillingPacketCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "BILLING_PACKET_CREATED", command: "CreateCommerceBillingPacketCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreateCommerceBillingPacketCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateCommerceBillingPacketCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateCommerceBillingPacketCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateCommerceBillingPacketCommandDTO { return mutationResult as CreateCommerceBillingPacketCommandDTO; }
  async run(input: CreateCommerceBillingPacketCommandInput, context: CommandContext): Promise<CommandResult<CreateCommerceBillingPacketCommandDTO>> { return runGovernedCommand(this, input, context); }
}
