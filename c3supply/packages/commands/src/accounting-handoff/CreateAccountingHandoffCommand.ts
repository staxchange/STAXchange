import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateAccountingHandoffCommandInput { invoiceId: string; billingPacketId: string; createdBy: string; }
export interface CreateAccountingHandoffCommandDTO { id: string; workflow: "accounting-handoff"; status: "HANDOFF_DRAFTED"; command: "CreateAccountingHandoffCommand"; }
export class CreateAccountingHandoffCommand implements GovernedCommand<CreateAccountingHandoffCommandInput, CreateAccountingHandoffCommandDTO> {
  validateInput(input: CreateAccountingHandoffCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).billingPacketId) throw new Error("billingPacketId is required.");
    if (!(input as any).createdBy) throw new Error("createdBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateAccountingHandoffCommandInput): GovernanceResult { void input; return requirePermission(actor, "accounting_handoff.create"); }
  async executeMutation(input: CreateAccountingHandoffCommandInput, context: CommandContext): Promise<CreateAccountingHandoffCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "accounting-handoff", status: "HANDOFF_DRAFTED", command: "CreateAccountingHandoffCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreateAccountingHandoffCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateAccountingHandoffCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateAccountingHandoffCommand", workflow: "accounting-handoff", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateAccountingHandoffCommandDTO { return mutationResult as CreateAccountingHandoffCommandDTO; }
  async run(input: CreateAccountingHandoffCommandInput, context: CommandContext): Promise<CommandResult<CreateAccountingHandoffCommandDTO>> { return runGovernedCommand(this, input, context); }
}
