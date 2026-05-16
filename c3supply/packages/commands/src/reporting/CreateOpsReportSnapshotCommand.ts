import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateOpsReportSnapshotCommandInput {
  reportDate: string;
  serviceSnapshotId?: string;
  billingSnapshotId?: string;
  inventorySnapshotId?: string;
}

export interface CreateOpsReportSnapshotCommandDTO {
  id: string;
  workflow: "ops-reporting";
  status: "OPS_REPORT_CREATED";
  command: "CreateOpsReportSnapshotCommand";
}

export class CreateOpsReportSnapshotCommand implements GovernedCommand<CreateOpsReportSnapshotCommandInput, CreateOpsReportSnapshotCommandDTO> {
  validateInput(input: CreateOpsReportSnapshotCommandInput): void {
    if (!input.reportDate) throw new Error("reportDate is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateOpsReportSnapshotCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "reporting.ops_report.create");
  }

  async executeMutation(input: CreateOpsReportSnapshotCommandInput, context: CommandContext): Promise<CreateOpsReportSnapshotCommandDTO> {
    void context;
    return {
      id: input.reportDate,
      workflow: "ops-reporting",
      status: "OPS_REPORT_CREATED",
      command: "CreateOpsReportSnapshotCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateOpsReportSnapshotCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateOpsReportSnapshotCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateOpsReportSnapshotCommand",
        workflow: "ops-reporting",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateOpsReportSnapshotCommandDTO {
    return mutationResult as CreateOpsReportSnapshotCommandDTO;
  }

  async run(input: CreateOpsReportSnapshotCommandInput, context: CommandContext): Promise<CommandResult<CreateOpsReportSnapshotCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
