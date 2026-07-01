export type TreatmentSheetResponse = {
  id: string;
  patientId: string;
  treatmentStatusId: string;
  treatmentNumber?: string | null;
  consultationDate?: string | null;
  epsTreatingDoctorDiagnosis?: string | null;
  referredClinicalHistory?: string | null;
  indicationDate?: string | null;
  assignedStaffName?: string | null;
  therapyName?: string | null;
  nervousSystemIndications?: string | null;
  decompressSpine: boolean;
  decompressNeck: boolean;
  decompressBack: boolean;
  endocrineNerves: boolean;
  endocrineDefenses: boolean;
  endocrineHormones: boolean;
  cardiovascularReflexologyWith?: string | null;
  digestiveColonReflexologyWith?: string | null;
  respiratoryReflexologyWith?: string | null;
  urinaryReflexologyWithAcidFruits?: string | null;
  otherIndications?: string | null;
  observations?: string | null;
  approvedAtUtc?: string | null;
  approvedByUserId?: string | null;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
};

export type TreatmentSheetStatusKind = "draft" | "approved" | "unknown";

export type CreateTreatmentSheetRequest = {
  treatmentNumber?: string | null;
  consultationDate?: string | null;
  epsTreatingDoctorDiagnosis?: string | null;
  referredClinicalHistory?: string | null;
};

export type UpdateTreatmentSheetMedicalIndicationRequest = {
  indicationDate?: string | null;
  assignedStaffName?: string | null;
  therapyName?: string | null;
  nervousSystemIndications?: string | null;
  decompressSpine: boolean;
  decompressNeck: boolean;
  decompressBack: boolean;
  endocrineNerves: boolean;
  endocrineDefenses: boolean;
  endocrineHormones: boolean;
  cardiovascularReflexologyWith?: string | null;
  digestiveColonReflexologyWith?: string | null;
  respiratoryReflexologyWith?: string | null;
  urinaryReflexologyWithAcidFruits?: string | null;
  otherIndications?: string | null;
  observations?: string | null;
};
