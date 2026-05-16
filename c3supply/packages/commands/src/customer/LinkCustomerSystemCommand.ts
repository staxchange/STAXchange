import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface LinkCustomerSystemCommandInput {
  customerId: string;
  treatmentSystemId: string;
  accessLevel: "VIEW_ONLY" | "SERVICE_REQUEST";
}

export interface LinkCustomerSystemCommandDTO {
  id: string;
  workflow: "customer-portal";
  status: "SYSTEM_LINKED";
  command: "LinkCustomerSystemCommand";
}

export class LinkCustomerSystemCommand implements GovernedCommand<LinkCustomerSystemCommandInput, LinkCustomerSystemCommandDTO> {
  validateInput(input: LinkCustomerSystemCommandInput): void {
    if (!input.customerId) throw new Error("customerId is required.");
    if (!input.treatmentSystemId) throw new Error("treatmentSystemId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: LinkCustomerSystemCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "customer.system.link");
  }

  async executeMutation(input: LinkCustomerSystemCommandInput, context: CommandContext): Promise<LinkCustomerSystemCommandDTO> {
    void context;
    return {
      id: input.customerId,
      workflow: "customer-portal",
      status: "SYSTEM_LINKED",
      command: "LinkCustomerSystemCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: LinkCustomerSystemCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as LinkCustomerSystemCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "LinkCustomerSystemCommand",
        workflow: "customer-portal",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): LinkCustomerSystemCommandDTO {
    return mutationResult as LinkCustomerSystemCommandDTO;
  }

  async run(input: LinkCustomerSystemCommandInput, context: CommandContext): Promise<CommandResult<LinkCustomerSystemCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
