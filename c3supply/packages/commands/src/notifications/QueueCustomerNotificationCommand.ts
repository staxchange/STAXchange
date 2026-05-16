import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface QueueCustomerNotificationCommandInput {
  recipient: string;
  channel: "EMAIL" | "TEAMS" | "CRM_WEBHOOK" | "IN_APP";
  templateId: string;
  payload?: Record<string, unknown>;
}

export interface QueueCustomerNotificationCommandDTO {
  id: string;
  workflow: "notification-delivery";
  status: "QUEUED";
  command: "QueueCustomerNotificationCommand";
}

export class QueueCustomerNotificationCommand implements GovernedCommand<QueueCustomerNotificationCommandInput, QueueCustomerNotificationCommandDTO> {
  validateInput(input: QueueCustomerNotificationCommandInput): void {
    if (!input.recipient) throw new Error("recipient is required.");
    if (!input.channel) throw new Error("channel is required.");
    if (!input.templateId) throw new Error("templateId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: QueueCustomerNotificationCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "notification.queue.create");
  }

  async executeMutation(input: QueueCustomerNotificationCommandInput, context: CommandContext): Promise<QueueCustomerNotificationCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "notification-delivery",
      status: "QUEUED",
      command: "QueueCustomerNotificationCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: QueueCustomerNotificationCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as QueueCustomerNotificationCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "QueueCustomerNotificationCommand",
        workflow: "notification-delivery",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): QueueCustomerNotificationCommandDTO {
    return mutationResult as QueueCustomerNotificationCommandDTO;
  }

  async run(input: QueueCustomerNotificationCommandInput, context: CommandContext): Promise<CommandResult<QueueCustomerNotificationCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
