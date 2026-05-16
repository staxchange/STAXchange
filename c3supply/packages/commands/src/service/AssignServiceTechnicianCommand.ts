import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface AssignServiceTechnicianCommandInput {
  workOrderId: string;
  technicianId: string;
}

export interface AssignServiceTechnicianCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "ASSIGNED";
  command: "AssignServiceTechnicianCommand";
}

export class AssignServiceTechnicianCommand implements GovernedCommand<AssignServiceTechnicianCommandInput, AssignServiceTechnicianCommandDTO> {
  validateInput(input: AssignServiceTechnicianCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AssignServiceTechnicianCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.technician.assign");
  }

  async executeMutation(input: AssignServiceTechnicianCommandInput, context: CommandContext): Promise<AssignServiceTechnicianCommandDTO> {
    const repository = serviceRepositoryFromContext(context);
    if (repository) {
      await repository.assignServiceTechnician({ ...input, requestId: context.requestId });
      const [workOrder] = (await repository.listWorkOrders()).filter((item) => item.id === input.workOrderId);
      const notifier = serviceNotifierFromContext(context);
      if (notifier && workOrder) await notifier.notifyWorkOrderAssigned(workOrder);
    }

    return {
      id: input.workOrderId,
      workflow: "treatment-system-service",
      status: "ASSIGNED",
      command: "AssignServiceTechnicianCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: AssignServiceTechnicianCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    void mutationResult;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AssignServiceTechnicianCommand",
        workflow: "treatment-system-service",
        entityId: input.workOrderId,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { technicianId: input.technicianId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AssignServiceTechnicianCommandDTO {
    return mutationResult as AssignServiceTechnicianCommandDTO;
  }

  async run(input: AssignServiceTechnicianCommandInput, context: CommandContext): Promise<CommandResult<AssignServiceTechnicianCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
