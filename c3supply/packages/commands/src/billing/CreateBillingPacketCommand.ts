import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateBillingPacketCommandInput {
  invoiceId: string;
  customerId?: string;
}

export interface CreateBillingPacketCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "BILLING_PACKET_CREATED";
  command: "CreateBillingPacketCommand";
}

export class CreateBillingPacketCommand implements GovernedCommand<CreateBillingPacketCommandInput, CreateBillingPacketCommandDTO> {
  validateInput(input: CreateBillingPacketCommandInput): void {
    if (!input.invoiceId) throw new Error("invoiceId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateBillingPacketCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.packet.create");
  }

  async executeMutation(input: CreateBillingPacketCommandInput, context: CommandContext): Promise<CreateBillingPacketCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.invoiceId,
      workflow: "service-billing",
      status: "BILLING_PACKET_CREATED",
      command: "CreateBillingPacketCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateBillingPacketCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateBillingPacketCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateBillingPacketCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateBillingPacketCommandDTO {
    return mutationResult as CreateBillingPacketCommandDTO;
  }

  async run(input: CreateBillingPacketCommandInput, context: CommandContext): Promise<CommandResult<CreateBillingPacketCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
