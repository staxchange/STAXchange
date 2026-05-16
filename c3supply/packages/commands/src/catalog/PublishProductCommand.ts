import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface PublishProductCommandInput {
  productId: string;
  note?: string;
}

export interface PublishProductCommandDTO {
  id: string;
  workflow: "product-publication";
  status: "PUBLISHED";
  command: "PublishProductCommand";
}

export class PublishProductCommand implements GovernedCommand<PublishProductCommandInput, PublishProductCommandDTO> {
  validateInput(input: PublishProductCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.productId) throw new Error("productId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: PublishProductCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "catalog.publish");
  }

  async executeMutation(input: PublishProductCommandInput, context: CommandContext): Promise<PublishProductCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.productId),
      workflow: "product-publication",
      status: "PUBLISHED",
      command: "PublishProductCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: PublishProductCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "PublishProductCommand",
        workflow: "product-publication",
        entityId: String(input.productId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): PublishProductCommandDTO {
    const result = mutationResult as PublishProductCommandDTO;
    return {
      id: result.id,
      workflow: "product-publication",
      status: "PUBLISHED",
      command: "PublishProductCommand"
    };
  }

  async run(input: PublishProductCommandInput, context: CommandContext): Promise<CommandResult<PublishProductCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
