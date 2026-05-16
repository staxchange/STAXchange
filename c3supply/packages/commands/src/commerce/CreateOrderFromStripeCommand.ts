import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateOrderFromStripeCommandInput {
  stripeSessionId: string;
  note?: string;
}

export interface CreateOrderFromStripeCommandDTO {
  id: string;
  workflow: "checkout";
  status: "ORDER_CREATED";
  command: "CreateOrderFromStripeCommand";
}

export class CreateOrderFromStripeCommand implements GovernedCommand<CreateOrderFromStripeCommandInput, CreateOrderFromStripeCommandDTO> {
  validateInput(input: CreateOrderFromStripeCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.stripeSessionId) throw new Error("stripeSessionId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateOrderFromStripeCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "commerce.order");
  }

  async executeMutation(input: CreateOrderFromStripeCommandInput, context: CommandContext): Promise<CreateOrderFromStripeCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.stripeSessionId),
      workflow: "checkout",
      status: "ORDER_CREATED",
      command: "CreateOrderFromStripeCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateOrderFromStripeCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateOrderFromStripeCommand",
        workflow: "checkout",
        entityId: String(input.stripeSessionId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateOrderFromStripeCommandDTO {
    const result = mutationResult as CreateOrderFromStripeCommandDTO;
    return {
      id: result.id,
      workflow: "checkout",
      status: "ORDER_CREATED",
      command: "CreateOrderFromStripeCommand"
    };
  }

  async run(input: CreateOrderFromStripeCommandInput, context: CommandContext): Promise<CommandResult<CreateOrderFromStripeCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
