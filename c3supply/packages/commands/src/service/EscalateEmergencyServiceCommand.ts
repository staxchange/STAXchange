import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface EscalateEmergencyServiceCommandInput {
  serviceRequestId: string;
  reason: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface EscalateEmergencyServiceCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "ESCALATED";
  command: "EscalateEmergencyServiceCommand";
}

export class EscalateEmergencyServiceCommand implements GovernedCommand<EscalateEmergencyServiceCommandInput, EscalateEmergencyServiceCommandDTO> {
  validateInput(input: EscalateEmergencyServiceCommandInput): void {
    if (!input.serviceRequestId) throw new Error("serviceRequestId is required.");
    if (!input.reason?.trim()) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: EscalateEmergencyServiceCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.emergency.escalate");
  }

  async executeMutation(input: EscalateEmergencyServiceCommandInput, context: CommandContext): Promise<EscalateEmergencyServiceCommandDTO> {
    const repository = serviceRepositoryFromContext(context);
    const escalationInput = { ...input, requestId: context.requestId };

    if (repository) {
      await repository.escalateEmergencyService(escalationInput);
    }

    const notifier = serviceNotifierFromContext(context);
    if (notifier) {
      await notifier.notifyEmergencyEscalation(escalationInput);
    }

    return {
      id: input.serviceRequestId,
      workflow: "treatment-system-service",
      status: "ESCALATED",
      command: "EscalateEmergencyServiceCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: EscalateEmergencyServiceCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    void mutationResult;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "EscalateEmergencyServiceCommand",
        workflow: "treatment-system-service",
        entityId: input.serviceRequestId,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { reason: input.reason, hasPhone: Boolean(input.customerPhone), hasEmail: Boolean(input.customerEmail) }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): EscalateEmergencyServiceCommandDTO {
    return mutationResult as EscalateEmergencyServiceCommandDTO;
  }

  async run(input: EscalateEmergencyServiceCommandInput, context: CommandContext): Promise<CommandResult<EscalateEmergencyServiceCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
