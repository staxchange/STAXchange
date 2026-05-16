import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateNotificationPreferenceCommandInput {
  customerId: string;
  emailEnabled: boolean;
}

export interface CreateNotificationPreferenceCommandDTO {
  id: string;
  workflow: "notification-delivery";
  status: "PREFERENCE_CREATED";
  command: "CreateNotificationPreferenceCommand";
}

export class CreateNotificationPreferenceCommand implements GovernedCommand<CreateNotificationPreferenceCommandInput, CreateNotificationPreferenceCommandDTO> {
  validateInput(input: CreateNotificationPreferenceCommandInput): void {
    if (!input.customerId) throw new Error("customerId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateNotificationPreferenceCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "notification.preference.create");
  }

  async executeMutation(input: CreateNotificationPreferenceCommandInput, context: CommandContext): Promise<CreateNotificationPreferenceCommandDTO> {
    void context;
    return {
      id: input.customerId,
      workflow: "notification-delivery",
      status: "PREFERENCE_CREATED",
      command: "CreateNotificationPreferenceCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateNotificationPreferenceCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateNotificationPreferenceCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateNotificationPreferenceCommand",
        workflow: "notification-delivery",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateNotificationPreferenceCommandDTO {
    return mutationResult as CreateNotificationPreferenceCommandDTO;
  }

  async run(input: CreateNotificationPreferenceCommandInput, context: CommandContext): Promise<CommandResult<CreateNotificationPreferenceCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
