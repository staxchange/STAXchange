import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateLaborEntryCommandInput {
  workOrderId: string;
  technicianId: string;
  description: string;
  hours: number;
  rateCents?: number;
}

export interface CreateLaborEntryCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "LABOR_RECORDED";
  command: "CreateLaborEntryCommand";
}

export class CreateLaborEntryCommand implements GovernedCommand<CreateLaborEntryCommandInput, CreateLaborEntryCommandDTO> {
  validateInput(input: CreateLaborEntryCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
    if (!input.description) throw new Error("description is required.");
    if (input.hours <= 0 || input.hours > 24) throw new Error("hours must be between 0 and 24.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateLaborEntryCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.labor.create");
  }

  async executeMutation(input: CreateLaborEntryCommandInput, context: CommandContext): Promise<CreateLaborEntryCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.workOrderId,
      workflow: "service-billing",
      status: "LABOR_RECORDED",
      command: "CreateLaborEntryCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateLaborEntryCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateLaborEntryCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateLaborEntryCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateLaborEntryCommandDTO {
    return mutationResult as CreateLaborEntryCommandDTO;
  }

  async run(input: CreateLaborEntryCommandInput, context: CommandContext): Promise<CommandResult<CreateLaborEntryCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
