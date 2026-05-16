import type { AuditSink } from "@stax/audit";
import type { ServiceRepository } from "./repository-contracts";
import { createInMemoryServiceRepository } from "./in-memory-service-repository";
import { createMultiDestinationServiceNotifier } from "./multi-destination-service-notifier";
import { createSupabaseAuditSink } from "./supabase-audit-sink";
import { createSupabaseServiceRoleClient, hasSupabaseServiceRoleConfig } from "./supabase-admin-client";
import { createSupabaseServiceRepository } from "./supabase-service-repository";

export interface ServiceCommandContextEnv extends NodeJS.ProcessEnv {
  [key: string]: string | undefined;
  SERVICE_USE_SUPABASE?: string;
  SERVICE_ESCALATION_WEBHOOK_URL?: string;
  SERVICE_TEAMS_WEBHOOK_URL?: string;
  SERVICE_EMAIL_WEBHOOK_URL?: string;
  SERVICE_CRM_WEBHOOK_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export interface ServiceCommandContextAdapters {
  repositories: {
    service: ServiceRepository;
  };
  notifications: {
    service: ReturnType<typeof createMultiDestinationServiceNotifier>;
  };
  audit?: AuditSink;
}

export function createServiceCommandContextAdapters(env: ServiceCommandContextEnv = process.env): ServiceCommandContextAdapters {
  const useSupabase = env.SERVICE_USE_SUPABASE !== "false" && hasSupabaseServiceRoleConfig(env);
  const supabase = useSupabase ? createSupabaseServiceRoleClient(env) : undefined;

  return {
    repositories: {
      service: supabase ? createSupabaseServiceRepository(supabase) : createInMemoryServiceRepository()
    },
    notifications: {
      service: createMultiDestinationServiceNotifier(env)
    },
    audit: supabase ? createSupabaseAuditSink(supabase) : undefined
  };
}
