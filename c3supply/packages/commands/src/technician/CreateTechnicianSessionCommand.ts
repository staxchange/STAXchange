import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateTechnicianSessionCommandInput { technicianId: string; ttlMinutes?: number; }

export interface CreateTechnicianSessionCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "TECHNICIAN_SESSION_CREATED";
  command: "CreateTechnicianSessionCommand";
}

export class CreateTechnicianSessionCommand implements GovernedCommand<CreateTechnicianSessionCommandInput, CreateTechnicianSessionCommandDTO> {
  validateInput(input: CreateTechnicianSessionCommandInput): void {
    if (!input.technicianId) throw new Error("technicianId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateTechnicianSessionCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.session.create");
  }

  async executeMutation(input: CreateTechnicianSessionCommandInput, context: CommandContext): Promise<CreateTechnicianSessionCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "technician-work-order",
      status: "TECHNICIAN_SESSION_CREATED",
      command: "CreateTechnicianSessionCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: CreateTechnicianSessionCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateTechnicianSessionCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateTechnicianSessionCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { technicianId: input.technicianId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateTechnicianSessionCommandDTO {
    return mutationResult as CreateTechnicianSessionCommandDTO;
  }

  async run(input: CreateTechnicianSessionCommandInput, context: CommandContext): Promise<CommandResult<CreateTechnicianSessionCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
