import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SubmitTechnicianCloseoutCommandInput { workOrderId: string; technicianId: string; findings: string; actionsTaken: string; followUpRequired?: boolean; }

export interface SubmitTechnicianCloseoutCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "MANAGER_REVIEW_REQUIRED";
  command: "SubmitTechnicianCloseoutCommand";
}

export class SubmitTechnicianCloseoutCommand implements GovernedCommand<SubmitTechnicianCloseoutCommandInput, SubmitTechnicianCloseoutCommandDTO> {
  validateInput(input: SubmitTechnicianCloseoutCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
    if (!input.findings?.trim()) throw new Error("findings are required.");
    if (!input.actionsTaken?.trim()) throw new Error("actionsTaken is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: SubmitTechnicianCloseoutCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.closeout.submit");
  }

  async executeMutation(input: SubmitTechnicianCloseoutCommandInput, context: CommandContext): Promise<SubmitTechnicianCloseoutCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "technician-work-order",
      status: "MANAGER_REVIEW_REQUIRED",
      command: "SubmitTechnicianCloseoutCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: SubmitTechnicianCloseoutCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SubmitTechnicianCloseoutCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "SubmitTechnicianCloseoutCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, technicianId: input.technicianId, followUpRequired: input.followUpRequired }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): SubmitTechnicianCloseoutCommandDTO {
    return mutationResult as SubmitTechnicianCloseoutCommandDTO;
  }

  async run(input: SubmitTechnicianCloseoutCommandInput, context: CommandContext): Promise<CommandResult<SubmitTechnicianCloseoutCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
