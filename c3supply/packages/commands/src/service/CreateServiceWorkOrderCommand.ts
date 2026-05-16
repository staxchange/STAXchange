import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface CreateServiceWorkOrderCommandInput {
  serviceRequestId: string;
  priority: string;
  summary: string;
}

export interface CreateServiceWorkOrderCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "WORK_ORDER_CREATED";
  command: "CreateServiceWorkOrderCommand";
}

export class CreateServiceWorkOrderCommand implements GovernedCommand<CreateServiceWorkOrderCommandInput, CreateServiceWorkOrderCommandDTO> {
  validateInput(input: CreateServiceWorkOrderCommandInput): void {
    if (!input.serviceRequestId) throw new Error("serviceRequestId is required.");
    if (!input.priority) throw new Error("priority is required.");
    if (!input.summary?.trim()) throw new Error("summary is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateServiceWorkOrderCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.work_order.create");
  }

  async executeMutation(input: CreateServiceWorkOrderCommandInput, context: CommandContext): Promise<CreateServiceWorkOrderCommandDTO> {
    const repository = serviceRepositoryFromContext(context);
    if (repository) {
      const workOrder = await repository.createServiceWorkOrder({ ...input, requestId: context.requestId });
      return {
        id: workOrder.id,
        workflow: "treatment-system-service",
        status: "WORK_ORDER_CREATED",
        command: "CreateServiceWorkOrderCommand"
      };
    }

    return {
      id: crypto.randomUUID(),
      workflow: "treatment-system-service",
      status: "WORK_ORDER_CREATED",
      command: "CreateServiceWorkOrderCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: CreateServiceWorkOrderCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateServiceWorkOrderCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateServiceWorkOrderCommand",
        workflow: "treatment-system-service",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { serviceRequestId: input.serviceRequestId, priority: input.priority }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateServiceWorkOrderCommandDTO {
    return mutationResult as CreateServiceWorkOrderCommandDTO;
  }

  async run(input: CreateServiceWorkOrderCommandInput, context: CommandContext): Promise<CommandResult<CreateServiceWorkOrderCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
