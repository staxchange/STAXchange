import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface StartTechnicianWorkOrderCommandInput { workOrderId: string; technicianId: string; }

export interface StartTechnicianWorkOrderCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "IN_PROGRESS";
  command: "StartTechnicianWorkOrderCommand";
}

export class StartTechnicianWorkOrderCommand implements GovernedCommand<StartTechnicianWorkOrderCommandInput, StartTechnicianWorkOrderCommandDTO> {
  validateInput(input: StartTechnicianWorkOrderCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: StartTechnicianWorkOrderCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.work_order.start");
  }

  async executeMutation(input: StartTechnicianWorkOrderCommandInput, context: CommandContext): Promise<StartTechnicianWorkOrderCommandDTO> {
    void context;
    return {
      id: input.workOrderId,
      workflow: "technician-work-order",
      status: "IN_PROGRESS",
      command: "StartTechnicianWorkOrderCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: StartTechnicianWorkOrderCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as StartTechnicianWorkOrderCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "StartTechnicianWorkOrderCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { technicianId: input.technicianId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): StartTechnicianWorkOrderCommandDTO {
    return mutationResult as StartTechnicianWorkOrderCommandDTO;
  }

  async run(input: StartTechnicianWorkOrderCommandInput, context: CommandContext): Promise<CommandResult<StartTechnicianWorkOrderCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
