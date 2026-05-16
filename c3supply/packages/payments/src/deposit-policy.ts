import type { DepositRequirementDTO } from "./types";

export function depositAmountMustBeExplicit(input: DepositRequirementDTO): boolean {
  return !input.required || Boolean(input.depositAmountCents && input.depositAmountCents > 0);
}

export function noAutonomousDepositCalculation(): true { return true; }
