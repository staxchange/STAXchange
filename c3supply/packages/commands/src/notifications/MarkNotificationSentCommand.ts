import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface MarkNotificationSentCommandInput {
  notificationId: string;
  providerMessageId?: string;
}

export interface MarkNotificationSentCommandDTO {
  id: string;
  workflow: "notification-delivery";
  status: "SENT";
  command: "MarkNotificationSentCommand";
}

export class MarkNotificationSentCommand implements GovernedCommand<MarkNotificationSentCommandInput, MarkNotificationSentCommandDTO> {
  validateInput(input: MarkNotificationSentCommandInput): void {
    if (!input.notificationId) throw new Error("notificationId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: MarkNotificationSentCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "notification.mark_sent");
  }

  async executeMutation(input: MarkNotificationSentCommandInput, context: CommandContext): Promise<MarkNotificationSentCommandDTO> {
    void context;
    return {
      id: input.notificationId,
      workflow: "notification-delivery",
      status: "SENT",
      command: "MarkNotificationSentCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: MarkNotificationSentCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as MarkNotificationSentCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "MarkNotificationSentCommand",
        workflow: "notification-delivery",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): MarkNotificationSentCommandDTO {
    return mutationResult as MarkNotificationSentCommandDTO;
  }

  async run(input: MarkNotificationSentCommandInput, context: CommandContext): Promise<CommandResult<MarkNotificationSentCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
