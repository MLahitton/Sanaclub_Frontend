import { CheckCircle2, CircleOff } from "lucide-react";
import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";

type TreatmentSheetClinicalFlagsCardProps = {
  treatmentSheet: TreatmentSheetResponse;
};

function FlagItem({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      {checked ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-sanaclub-green)]" />
      ) : (
        <CircleOff className="mt-0.5 h-4 w-4 text-[var(--color-sanaclub-muted)]" />
      )}
      <span className="text-sm text-[var(--color-sanaclub-text)]">
        {label}
      </span>
    </li>
  );
}

export function TreatmentSheetClinicalFlagsCard({
  treatmentSheet,
}: TreatmentSheetClinicalFlagsCardProps) {
  const flags = [
    { label: "Descomprimir columna", checked: treatmentSheet.decompressSpine },
    { label: "Descomprimir cuello", checked: treatmentSheet.decompressNeck },
    { label: "Descomprimir espalda", checked: treatmentSheet.decompressBack },
    { label: "Sistema endocrino / nervios", checked: treatmentSheet.endocrineNerves },
    {
      label: "Sistema endocrino / defensas",
      checked: treatmentSheet.endocrineDefenses,
    },
    { label: "Sistema endocrino / hormonas", checked: treatmentSheet.endocrineHormones },
  ];

  const hasActiveFlag = flags.some((item) => item.checked);

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Indicadores clínicos
      </h3>

      {hasActiveFlag ? (
        <ul className="mt-3 grid gap-2 rounded-xl bg-[var(--color-sanaclub-bg)] p-4">
          {flags.map((flag) => (
            <FlagItem key={flag.label} label={flag.label} checked={flag.checked} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-muted)]">
          Sin indicaciones marcadas.
        </p>
      )}
    </section>
  );
}
