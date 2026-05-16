import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveProductLaunchCommandInput {
  productId: string;
  note?: string;
}

export interface ApproveProductLaunchCommandDTO {
  id: string;
  workflow: "product-publication";
  status: "APPROVED";
  command: "ApproveProductLaunchCommand";
}

export class ApproveProductLaunchCommand implements GovernedCommand<ApproveProductLaunchCommandInput, ApproveProductLaunchCommandDTO> {
  validateInput(input: ApproveProductLaunchCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.productId) throw new Error("productId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApproveProductLaunchCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "catalog.approve");
  }

  async executeMutation(input: ApproveProductLaunchCommandInput, context: CommandContext): Promise<ApproveProductLaunchCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.productId),
      workflow: "product-publication",
      status: "APPROVED",
      command: "ApproveProductLaunchCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ApproveProductLaunchCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApproveProductLaunchCommand",
        workflow: "product-publication",
        entityId: String(input.productId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApproveProductLaunchCommandDTO {
    const result = mutationResult as ApproveProductLaunchCommandDTO;
    return {
      id: result.id,
      workflow: "product-publication",
      status: "APPROVED",
      command: "ApproveProductLaunchCommand"
    };
  }

  async run(input: ApproveProductLaunchCommandInput, context: CommandContext): Promise<CommandResult<ApproveProductLaunchCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
