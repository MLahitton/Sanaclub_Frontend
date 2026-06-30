import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { PatientResponse } from "../types/patient.types";
import { PatientActionsMenu } from "./PatientActionsMenu";
import { PatientStatusBadge } from "./PatientStatusBadge";
import { UserInitialsAvatar } from "../../../shared/components/UserInitialsAvatar";
import {
  formatPatientCreatedAt,
  getCityDisplay,
  getEmailDisplay,
  getPatientDisplayName,
  getPhoneDisplay,
} from "../utils/patientFormatters";

type PatientsTableProps = {
  patients: PatientResponse[];
  canEdit: boolean;
  canArchive: boolean;
  onView: (patient: PatientResponse) => void;
  onEdit: (patient: PatientResponse) => void;
  onArchive: (patient: PatientResponse) => void;
};

export function PatientsTable({
  patients,
  canEdit,
  canArchive,
  onView,
  onEdit,
  onArchive,
}: PatientsTableProps) {
  const columns = [
    {
      accessorKey: "fullName",
      header: "Paciente",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex min-w-0 items-center gap-3">
            <UserInitialsAvatar fullName={getPatientDisplayName(patient)} size="sm" />
            <p className="min-w-0 truncate font-medium">{getPatientDisplayName(patient)}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "identificationNumber",
      header: "Identificación",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "phoneNumber",
      header: "Teléfono",
      cell: ({ row }) => getPhoneDisplay(row.original.phoneNumber),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => getEmailDisplay(row.original.email),
    },
    {
      accessorKey: "cityOrMunicipality",
      header: "Ciudad/Municipio",
      cell: ({ row }) => getCityDisplay(row.original.cityOrMunicipality),
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: ({ getValue }) => <PatientStatusBadge isActive={Boolean(getValue())} />,
    },
    {
      accessorKey: "createdAtUtc",
      header: "Fecha de creación",
      cell: ({ getValue }) => formatPatientCreatedAt(getValue() as string),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <PatientActionsMenu
          patient={row.original}
          canEdit={canEdit}
          canArchive={canArchive}
          onView={onView}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ),
    },
  ] satisfies ColumnDef<PatientResponse>[];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-sanaclub-border)] bg-white">
      <table className="min-w-full divide-y divide-[var(--color-sanaclub-border)] text-sm">
        <thead className="bg-[var(--color-sanaclub-bg)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="divide-x divide-[var(--color-sanaclub-border)]">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-sanaclub-muted)]"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-[var(--color-sanaclub-border)]">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="divide-x divide-[var(--color-sanaclub-border)]">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm text-[var(--color-sanaclub-text)]"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
