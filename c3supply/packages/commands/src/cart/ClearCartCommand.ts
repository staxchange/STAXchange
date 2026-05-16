import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ClearCartCommandInput { cartId: string; }
export interface ClearCartCommandDTO { id: string; workflow: "commerce-quote"; status: "CLEARED"; command: "ClearCartCommand"; }

export class ClearCartCommand implements GovernedCommand<ClearCartCommandInput, ClearCartCommandDTO> {
  validateInput(input: ClearCartCommandInput): void {
    if (!input.cartId) throw new Error("cartId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ClearCartCommandInput): GovernanceResult { void input; return requirePermission(actor, "cart.item.remove"); }
  async executeMutation(input: ClearCartCommandInput, context: CommandContext): Promise<ClearCartCommandDTO> { void context; return { id: input.cartId, workflow: "commerce-quote", status: "CLEARED", command: "ClearCartCommand" }; }
  async appendAuditEvent(actor: Actor, input: ClearCartCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ClearCartCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ClearCartCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ClearCartCommandDTO { return mutationResult as ClearCartCommandDTO; }
  async run(input: ClearCartCommandInput, context: CommandContext): Promise<CommandResult<ClearCartCommandDTO>> { return runGovernedCommand(this, input, context); }
}
