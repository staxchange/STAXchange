import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface TriageServiceRequestCommandInput {
  serviceRequestId: string;
  severity: string;
  category: string;
  reason: string;
}

export interface TriageServiceRequestCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "TRIAGED";
  command: "TriageServiceRequestCommand";
}

export class TriageServiceRequestCommand implements GovernedCommand<TriageServiceRequestCommandInput, TriageServiceRequestCommandDTO> {
  validateInput(input: TriageServiceRequestCommandInput): void {
    if (!input.serviceRequestId) throw new Error("serviceRequestId is required.");
    if (!input.severity) throw new Error("severity is required.");
    if (!input.category) throw new Error("category is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: TriageServiceRequestCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.request.triage");
  }

  async executeMutation(input: TriageServiceRequestCommandInput, context: CommandContext): Promise<TriageServiceRequestCommandDTO> {
    const repository = serviceRepositoryFromContext(context);
    if (repository) {
      await repository.triageServiceRequest({ ...input, requestId: context.requestId });
    }

    return {
      id: input.serviceRequestId,
      workflow: "treatment-system-service",
      status: "TRIAGED",
      command: "TriageServiceRequestCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: TriageServiceRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    void mutationResult;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "TriageServiceRequestCommand",
        workflow: "treatment-system-service",
        entityId: input.serviceRequestId,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { severity: input.severity, category: input.category, reason: input.reason }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): TriageServiceRequestCommandDTO {
    return mutationResult as TriageServiceRequestCommandDTO;
  }

  async run(input: TriageServiceRequestCommandInput, context: CommandContext): Promise<CommandResult<TriageServiceRequestCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
