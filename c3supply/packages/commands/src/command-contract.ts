import type { AuditSink } from "@stax/audit";
import type { Actor, GovernanceResult } from "@stax/governance";
import type { CommandResult } from "./command-result";

export interface CommandContext {
  actor: Actor;
  requestId?: string;
  audit?: AuditSink;
  repositories?: Record<string, unknown>;
  notifications?: Record<string, unknown>;
}

export interface GovernedCommand<TInput, TSafeDTO> {
  validateInput(input: TInput): Promise<void> | void;
  validateActor(actor: Actor): Promise<void> | void;
  governanceGuard(actor: Actor, input: TInput): Promise<GovernanceResult> | GovernanceResult;
  executeMutation(input: TInput, context: CommandContext): Promise<unknown>;
  appendAuditEvent(actor: Actor, input: TInput, mutationResult: unknown, context: CommandContext): Promise<void>;
  returnSafeDTO(mutationResult: unknown): Promise<TSafeDTO> | TSafeDTO;
  run(input: TInput, context: CommandContext): Promise<CommandResult<TSafeDTO>>;
}
