import type { StructuredAsset } from '../structure.types';

export interface CreateStructuredAssetInput {
  asset_id: string;
  ingest_event_id: string;
  structured_at: number;
  raw_reference: StructuredAsset['raw_reference'];
  identity?: StructuredAsset['identity'];
  extracted_fields?: StructuredAsset['extracted_fields'];
}

export const createStructuredAsset = (
  input: CreateStructuredAssetInput,
): StructuredAsset => ({
  asset_id: input.asset_id,
  ingest_event_id: input.ingest_event_id,
  structured_at: input.structured_at,
  identity: input.identity ?? {},
  raw_reference: input.raw_reference,
  extracted_fields: input.extracted_fields ?? {},
});