import type { GovernedCommand, CommandContext } from "../command-contract";
import type { CommandResult } from "../command-result";
import { fail, ok } from "../command-result";

export async function runGovernedCommand<TInput, TSafeDTO>(
  command: GovernedCommand<TInput, TSafeDTO>,
  input: TInput,
  context: CommandContext
): Promise<CommandResult<TSafeDTO>> {
  try {
    await command.validateInput(input);
    await command.validateActor(context.actor);
    const governance = await command.governanceGuard(context.actor, input);

    if (!governance.allowed) {
      return fail(governance.reason ?? "Governance guard denied command.");
    }

    const mutationResult = await command.executeMutation(input, context);
    await command.appendAuditEvent(context.actor, input, mutationResult, context);
    const safeDTO = await command.returnSafeDTO(mutationResult);
    return ok(safeDTO);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown command error.");
  }
}
