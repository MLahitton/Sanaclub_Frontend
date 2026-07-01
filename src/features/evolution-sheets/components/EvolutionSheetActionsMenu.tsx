import { useNavigate } from "react-router-dom";
import { ClipboardList, Eye } from "lucide-react";
import { isEvolutionPending } from "../utils/evolutionSheetFormatters";
import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";

type EvolutionSheetActionsMenuProps = {
  evolutionSheet: EvolutionSheetResponse;
  canRead: boolean;
  canUpdateDraft: boolean;
};

export function EvolutionSheetActionsMenu({
  evolutionSheet,
  canRead,
  canUpdateDraft,
}: EvolutionSheetActionsMenuProps) {
  const navigate = useNavigate();
  const showCompleteDraft = canUpdateDraft
    && isEvolutionPending(evolutionSheet)
    && evolutionSheet.isActive;

  const handleViewDetail = () => {
    navigate(`/app/evolution-sheets/${evolutionSheet.id}`);
  };

  const handleCompleteDraft = () => {
    navigate(`/app/evolution-sheets/${evolutionSheet.id}/new-indications`);
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {canRead ? (
        <button
          type="button"
          onClick={handleViewDetail}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver detalle
        </button>
      ) : null}

      {showCompleteDraft ? (
        <button
          type="button"
          onClick={handleCompleteDraft}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Completar nuevas indicaciones
        </button>
      ) : null}
    </div>
  );
}
