import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateCartCommandInput { cartId?: string; customerEmail?: string; }
export interface CreateCartCommandDTO { id: string; workflow: "commerce-quote"; status: "CART_CREATED"; command: "CreateCartCommand"; }

export class CreateCartCommand implements GovernedCommand<CreateCartCommandInput, CreateCartCommandDTO> {
  validateInput(input: CreateCartCommandInput): void {
    if (!input.customerEmail) throw new Error("customerEmail is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateCartCommandInput): GovernanceResult { void input; return requirePermission(actor, "cart.create"); }
  async executeMutation(input: CreateCartCommandInput, context: CommandContext): Promise<CreateCartCommandDTO> { void context; return { id: crypto.randomUUID(), workflow: "commerce-quote", status: "CART_CREATED", command: "CreateCartCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateCartCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateCartCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateCartCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateCartCommandDTO { return mutationResult as CreateCartCommandDTO; }
  async run(input: CreateCartCommandInput, context: CommandContext): Promise<CommandResult<CreateCartCommandDTO>> { return runGovernedCommand(this, input, context); }
}
