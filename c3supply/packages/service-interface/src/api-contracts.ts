import type {
  ServiceRequestDTO,
  ServiceRequestInput,
  ServiceWorkOrderDTO,
  TreatmentSystemDTO
} from "./types";

export interface CreateServiceRequestApiRequest extends ServiceRequestInput {}

export interface CreateServiceRequestApiResponse {
  serviceRequest: ServiceRequestDTO;
  message: string;
}

export interface TreatmentSystemLookupApiRequest {
  serialNumber?: string;
  systemId?: string;
  customerEmail?: string;
}

export interface TreatmentSystemLookupApiResponse {
  systems: TreatmentSystemDTO[];
}

export interface ServiceWorkOrderApiResponse {
  workOrder: ServiceWorkOrderDTO;
}
