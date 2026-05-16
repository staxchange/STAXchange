import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface UpdateCustomerNotificationPreferencesCommandInput {
  customerId: string;
  emailEnabled: boolean;
  serviceUpdatesEnabled: boolean;
  maintenanceRemindersEnabled: boolean;
  billingUpdatesEnabled: boolean;
}

export interface UpdateCustomerNotificationPreferencesCommandDTO {
  id: string;
  workflow: "customer-portal";
  status: "PREFERENCES_UPDATED";
  command: "UpdateCustomerNotificationPreferencesCommand";
}

export class UpdateCustomerNotificationPreferencesCommand implements GovernedCommand<UpdateCustomerNotificationPreferencesCommandInput, UpdateCustomerNotificationPreferencesCommandDTO> {
  validateInput(input: UpdateCustomerNotificationPreferencesCommandInput): void {
    if (!input.customerId) throw new Error("customerId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: UpdateCustomerNotificationPreferencesCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "customer.notification_preferences.update");
  }

  async executeMutation(input: UpdateCustomerNotificationPreferencesCommandInput, context: CommandContext): Promise<UpdateCustomerNotificationPreferencesCommandDTO> {
    void context;
    return {
      id: input.customerId,
      workflow: "customer-portal",
      status: "PREFERENCES_UPDATED",
      command: "UpdateCustomerNotificationPreferencesCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: UpdateCustomerNotificationPreferencesCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as UpdateCustomerNotificationPreferencesCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "UpdateCustomerNotificationPreferencesCommand",
        workflow: "customer-portal",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): UpdateCustomerNotificationPreferencesCommandDTO {
    return mutationResult as UpdateCustomerNotificationPreferencesCommandDTO;
  }

  async run(input: UpdateCustomerNotificationPreferencesCommandInput, context: CommandContext): Promise<CommandResult<UpdateCustomerNotificationPreferencesCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
