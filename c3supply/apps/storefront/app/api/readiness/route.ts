import { NextResponse } from "next/server";
import { evaluateProductionPreflight } from "@stax/deployment-switchboard";

export const runtime = "nodejs";

export async function GET() {
  const result = evaluateProductionPreflight({
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_DOMAIN: process.env.NEXT_PUBLIC_SITE_DOMAIN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_SUPPORT_MODEL: process.env.OPENAI_SUPPORT_MODEL,
    SERVICE_ATTACHMENTS_BUCKET: process.env.SERVICE_ATTACHMENTS_BUCKET,
    SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET: process.env.SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET
  });

  return NextResponse.json({
    ok: result.ready,
    missingEnvKeys: result.missingEnvKeys,
    warnings: result.warnings
  }, { status: result.ready ? 200 : 503 });
}
