import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface GenerateServiceKpiSnapshotCommandInput {
  openServiceRequests: number;
  emergencyEscalations: number;
  completedWorkOrders: number;
}

export interface GenerateServiceKpiSnapshotCommandDTO {
  id: string;
  workflow: "ops-reporting";
  status: "SERVICE_KPI_CREATED";
  command: "GenerateServiceKpiSnapshotCommand";
}

export class GenerateServiceKpiSnapshotCommand implements GovernedCommand<GenerateServiceKpiSnapshotCommandInput, GenerateServiceKpiSnapshotCommandDTO> {
  validateInput(input: GenerateServiceKpiSnapshotCommandInput): void {
    if (!input) throw new Error("input is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: GenerateServiceKpiSnapshotCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "reporting.kpi_snapshot.create");
  }

  async executeMutation(input: GenerateServiceKpiSnapshotCommandInput, context: CommandContext): Promise<GenerateServiceKpiSnapshotCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "ops-reporting",
      status: "SERVICE_KPI_CREATED",
      command: "GenerateServiceKpiSnapshotCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: GenerateServiceKpiSnapshotCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as GenerateServiceKpiSnapshotCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "GenerateServiceKpiSnapshotCommand",
        workflow: "ops-reporting",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): GenerateServiceKpiSnapshotCommandDTO {
    return mutationResult as GenerateServiceKpiSnapshotCommandDTO;
  }

  async run(input: GenerateServiceKpiSnapshotCommandInput, context: CommandContext): Promise<CommandResult<GenerateServiceKpiSnapshotCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
