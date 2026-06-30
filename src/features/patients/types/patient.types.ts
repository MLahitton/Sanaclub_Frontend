import type { PaginatedResult } from "../../../shared/types/api.types";

export type PatientResponse = {
  id: string;
  identificationTypeId: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate?: string | null;
  genderId?: string | null;
  civilStatusId?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  cityOrMunicipality?: string | null;
  occupation?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;
  patientStatusId: string;
  isActive: boolean;
  createdAtUtc: string;
};

export type PatientListParams = {
  search?: string;
  isActive?: boolean;
  patientStatusId?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type PatientActiveFilter = "all" | "active" | "inactive";

export type PatientListResult = PaginatedResult<PatientResponse>;

export type CatalogItemResponse = {
  id: string;
  code: string;
  name: string;
};

export type PatientFormOptionsResponse = {
  identificationTypes: CatalogItemResponse[];
  genders: CatalogItemResponse[];
  civilStatuses: CatalogItemResponse[];
  patientStatuses: CatalogItemResponse[];
};

export type CreatePatientRequest = {
  identificationTypeId: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  genderId?: string | null;
  civilStatusId?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  cityOrMunicipality?: string | null;
  occupation?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;
  patientStatusId: string;
};

export type UpdatePatientRequest = CreatePatientRequest;

export type ArchivePatientParams = {
  patientId: string;
};
