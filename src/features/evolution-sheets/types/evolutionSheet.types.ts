export type EvolutionSheetResponse = {
  id: string;
  patientId: string;
  treatmentSheetId: string;
  evolutionStatusId: string;
  therapyNumber?: string | null;
  evolutionDate?: string | null;
  entryTime?: string | null;
  exitTime?: string | null;
  assignedStaffName?: string | null;
  therapyName?: string | null;
  evolutionNotes: string;
  newIndications?: string | null;
  completedAtUtc?: string | null;
  completedByUserId?: string | null;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
};

export type CreateEvolutionSheetRequest = {
  treatmentSheetId: string;
  therapyNumber?: string | null;
  evolutionDate?: string | null;
  entryTime?: string | null;
  exitTime?: string | null;
  assignedStaffName?: string | null;
  therapyName?: string | null;
  evolutionNotes: string;
};

export type CompleteEvolutionSheetNewIndicationsRequest = {
  newIndications: string;
};

export type EvolutionSheetStatusKind = "pending" | "completed";
