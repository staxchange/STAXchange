import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateCheckoutSessionCommandInput {
  cartId: string;
  note?: string;
}

export interface CreateCheckoutSessionCommandDTO {
  id: string;
  workflow: "checkout";
  status: "CHECKOUT_CREATED";
  command: "CreateCheckoutSessionCommand";
}

export class CreateCheckoutSessionCommand implements GovernedCommand<CreateCheckoutSessionCommandInput, CreateCheckoutSessionCommandDTO> {
  validateInput(input: CreateCheckoutSessionCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.cartId) throw new Error("cartId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateCheckoutSessionCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "commerce.checkout");
  }

  async executeMutation(input: CreateCheckoutSessionCommandInput, context: CommandContext): Promise<CreateCheckoutSessionCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.cartId),
      workflow: "checkout",
      status: "CHECKOUT_CREATED",
      command: "CreateCheckoutSessionCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateCheckoutSessionCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateCheckoutSessionCommand",
        workflow: "checkout",
        entityId: String(input.cartId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateCheckoutSessionCommandDTO {
    const result = mutationResult as CreateCheckoutSessionCommandDTO;
    return {
      id: result.id,
      workflow: "checkout",
      status: "CHECKOUT_CREATED",
      command: "CreateCheckoutSessionCommand"
    };
  }

  async run(input: CreateCheckoutSessionCommandInput, context: CommandContext): Promise<CommandResult<CreateCheckoutSessionCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
