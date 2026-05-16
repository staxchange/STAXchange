import {
  getServiceNotifier,
  getServiceRepository,
  type ServiceNotifier,
  type ServiceRepository
} from "@stax/service-interface";
import type { CommandContext } from "../command-contract";

export function serviceRepositoryFromContext(context: CommandContext): ServiceRepository | undefined {
  return getServiceRepository(context.repositories);
}

export function serviceNotifierFromContext(context: CommandContext): ServiceNotifier | undefined {
  return getServiceNotifier(context.notifications);
}
