import { NextResponse } from "next/server";
import { StoreQuoteDocumentSnapshotCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","quoteDocumentId":"doc-placeholder","storageBucket":"quote-documents","storagePath":"quotes/doc.html","contentType":"text/html"}; const result = await new StoreQuoteDocumentSnapshotCommand().run(input, { actor: { id: "admin-delivery-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
