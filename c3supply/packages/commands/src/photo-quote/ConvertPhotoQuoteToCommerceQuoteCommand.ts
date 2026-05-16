import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ConvertPhotoQuoteToCommerceQuoteCommandInput {
  intakeId: string;
  convertedBy: string;
  commerceQuoteRequestId?: string;
}

export interface ConvertPhotoQuoteToCommerceQuoteCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "QUOTE_REQUEST_CREATED";
  command: "ConvertPhotoQuoteToCommerceQuoteCommand";
}

export class ConvertPhotoQuoteToCommerceQuoteCommand implements GovernedCommand<ConvertPhotoQuoteToCommerceQuoteCommandInput, ConvertPhotoQuoteToCommerceQuoteCommandDTO> {
  validateInput(input: ConvertPhotoQuoteToCommerceQuoteCommandInput): void {
    if (!input.intakeId) throw new Error("intakeId is required.");
    if (!input.convertedBy) throw new Error("convertedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ConvertPhotoQuoteToCommerceQuoteCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.convert_quote");
  }

  async executeMutation(input: ConvertPhotoQuoteToCommerceQuoteCommandInput, context: CommandContext): Promise<ConvertPhotoQuoteToCommerceQuoteCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "QUOTE_REQUEST_CREATED",
      command: "ConvertPhotoQuoteToCommerceQuoteCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ConvertPhotoQuoteToCommerceQuoteCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ConvertPhotoQuoteToCommerceQuoteCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ConvertPhotoQuoteToCommerceQuoteCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ConvertPhotoQuoteToCommerceQuoteCommandDTO {
    return mutationResult as ConvertPhotoQuoteToCommerceQuoteCommandDTO;
  }

  async run(input: ConvertPhotoQuoteToCommerceQuoteCommandInput, context: CommandContext): Promise<CommandResult<ConvertPhotoQuoteToCommerceQuoteCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
