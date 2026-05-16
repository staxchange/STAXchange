import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateCustomerPortalSessionCommandInput {
  customerId: string;
  email: string;
}

export interface CreateCustomerPortalSessionCommandDTO {
  id: string;
  workflow: "customer-portal";
  status: "SESSION_CREATED";
  command: "CreateCustomerPortalSessionCommand";
}

export class CreateCustomerPortalSessionCommand implements GovernedCommand<CreateCustomerPortalSessionCommandInput, CreateCustomerPortalSessionCommandDTO> {
  validateInput(input: CreateCustomerPortalSessionCommandInput): void {
    if (!input.customerId) throw new Error("customerId is required.");
    if (!input.email) throw new Error("email is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateCustomerPortalSessionCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "customer.portal.session.create");
  }

  async executeMutation(input: CreateCustomerPortalSessionCommandInput, context: CommandContext): Promise<CreateCustomerPortalSessionCommandDTO> {
    void context;
    return {
      id: input.customerId,
      workflow: "customer-portal",
      status: "SESSION_CREATED",
      command: "CreateCustomerPortalSessionCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateCustomerPortalSessionCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateCustomerPortalSessionCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateCustomerPortalSessionCommand",
        workflow: "customer-portal",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateCustomerPortalSessionCommandDTO {
    return mutationResult as CreateCustomerPortalSessionCommandDTO;
  }

  async run(input: CreateCustomerPortalSessionCommandInput, context: CommandContext): Promise<CommandResult<CreateCustomerPortalSessionCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
