import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface QuarantineProductCommandInput {
  productId: string;
  reason: string;
  note?: string;
}

export interface QuarantineProductCommandDTO {
  id: string;
  workflow: "product-publication";
  status: "QUARANTINED";
  command: "QuarantineProductCommand";
}

export class QuarantineProductCommand implements GovernedCommand<QuarantineProductCommandInput, QuarantineProductCommandDTO> {
  validateInput(input: QuarantineProductCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.productId) throw new Error("productId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: QuarantineProductCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "catalog.quarantine");
  }

  async executeMutation(input: QuarantineProductCommandInput, context: CommandContext): Promise<QuarantineProductCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.productId),
      workflow: "product-publication",
      status: "QUARANTINED",
      command: "QuarantineProductCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: QuarantineProductCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "QuarantineProductCommand",
        workflow: "product-publication",
        entityId: String(input.productId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): QuarantineProductCommandDTO {
    const result = mutationResult as QuarantineProductCommandDTO;
    return {
      id: result.id,
      workflow: "product-publication",
      status: "QUARANTINED",
      command: "QuarantineProductCommand"
    };
  }

  async run(input: QuarantineProductCommandInput, context: CommandContext): Promise<CommandResult<QuarantineProductCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
