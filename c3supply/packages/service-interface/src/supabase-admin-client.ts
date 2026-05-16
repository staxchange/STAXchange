import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertServerOnly } from "./server-only";

export interface SupabaseServiceRoleEnv extends NodeJS.ProcessEnv {
  SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SERVICE_ATTACHMENTS_BUCKET?: string;
}

export interface SupabaseServerConfig {
  url: string;
  serviceRoleKey: string;
  attachmentsBucket: string;
}

export function getSupabaseServerConfig(env: SupabaseServiceRoleEnv = process.env): SupabaseServerConfig | undefined {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return undefined;

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
    attachmentsBucket: env.SERVICE_ATTACHMENTS_BUCKET ?? "service-attachments"
  };
}


export function getRequiredSupabaseServerConfig(env: SupabaseServiceRoleEnv = process.env): SupabaseServerConfig {
  const config = getSupabaseServerConfig(env);
  if (!config) {
    throw new Error("SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  return config;
}

export function hasSupabaseServiceRoleConfig(env: SupabaseServiceRoleEnv = process.env): boolean {
  return Boolean(getSupabaseServerConfig(env));
}

export function createSupabaseServiceRoleClient(env: SupabaseServiceRoleEnv = process.env): SupabaseClient {
  assertServerOnly("createSupabaseServiceRoleClient");

  const config = getSupabaseServerConfig(env);

  if (!config) {
    throw new Error("SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        "X-STAX-Service": "treatment-service-interface"
      }
    }
  });
}
