import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface CreateServiceRequestCommandInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  siteAddress?: string;
  systemId?: string;
  systemType?: string;
  issueDescription: string;
  preferredServiceWindow?: string;
  siteAccessNotes?: string;
  severity: string;
  category: string;
  emergencyEscalation: boolean;
}

export interface CreateServiceRequestCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "NEW";
  command: "CreateServiceRequestCommand";
}

export class CreateServiceRequestCommand implements GovernedCommand<CreateServiceRequestCommandInput, CreateServiceRequestCommandDTO> {
  validateInput(input: CreateServiceRequestCommandInput): void {
    if (!input.customerName?.trim()) throw new Error("customerName is required.");
    if (!input.customerEmail?.trim()) throw new Error("customerEmail is required.");
    if (!input.issueDescription?.trim()) throw new Error("issueDescription is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateServiceRequestCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.request.create");
  }

  async executeMutation(input: CreateServiceRequestCommandInput, context: CommandContext): Promise<CreateServiceRequestCommandDTO> {
    const repository = serviceRepositoryFromContext(context);

    if (repository) {
      const record = await repository.createServiceRequest({
        brandId: "dwg",
        customer: {
          name: input.customerName,
          email: input.customerEmail,
          phone: input.customerPhone,
          company: input.company,
          siteAddress: input.siteAddress
        },
        systemId: input.systemId,
        systemType: input.systemType,
        issueDescription: input.issueDescription,
        preferredServiceWindow: input.preferredServiceWindow,
        siteAccessNotes: input.siteAccessNotes,
        classification: {
          severity: input.severity as never,
          category: input.category as never,
          requiresHumanReview: true,
          emergencyEscalation: input.emergencyEscalation,
          reason: "Persisted through CreateServiceRequestCommand."
        },
        requestId: context.requestId
      });

      const notifier = serviceNotifierFromContext(context);
      if (notifier) await notifier.notifyServiceRequestCreated(record);

      return {
        id: record.id,
        workflow: "treatment-system-service",
        status: "NEW",
        command: "CreateServiceRequestCommand"
      };
    }

    return {
      id: crypto.randomUUID(),
      workflow: "treatment-system-service",
      status: "NEW",
      command: "CreateServiceRequestCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: CreateServiceRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateServiceRequestCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateServiceRequestCommand",
        workflow: "treatment-system-service",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { severity: input.severity, category: input.category, emergencyEscalation: input.emergencyEscalation }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateServiceRequestCommandDTO {
    return mutationResult as CreateServiceRequestCommandDTO;
  }

  async run(input: CreateServiceRequestCommandInput, context: CommandContext): Promise<CommandResult<CreateServiceRequestCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
