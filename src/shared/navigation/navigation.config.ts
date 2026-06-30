import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  FolderOpen,
  LayoutDashboard,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import type { NavigationItem } from "./navigation.types";

export const APP_INTERNAL_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/app",
    icon: LayoutDashboard,
    description: "Panel interno protegido.",
  },
  {
    label: "Pacientes",
    path: "/app/patients",
    icon: UsersRound,
    requiredPermissions: ["patients.read"],
    description: "Acceso a pacientes y su ficha clínica.",
  },
  {
    label: "Agenda",
    path: "/app/appointments",
    icon: CalendarDays,
    requiredPermissions: ["appointments.read"],
    description: "Gestión base de citas y horarios internos.",
  },
  {
    label: "Solicitudes médicas",
    path: "/app/medical-requests",
    icon: ClipboardCheck,
    requiredPermissions: [
      "treatments.update_medical_indication",
      "evolutions.update_draft",
    ],
    requireAnyPermission: true,
    description: "Módulo inicial de solicitudes clínicas.",
  },
  {
    label: "Documentación clínica",
    path: "/app/clinical-documentation",
    icon: FileText,
    requiredPermissions: ["treatments.read", "evolutions.read", "consents.read"],
    requireAnyPermission: true,
    description: "Módulo base para la documentación clínica.",
  },
  {
    label: "Documentos",
    path: "/app/documents",
    icon: FolderOpen,
    requiredPermissions: ["documents.read"],
    description: "Centro temporal para documentos clínicos.",
  },
  {
    label: "Usuarios internos",
    path: "/app/users",
    icon: ShieldCheck,
    requiredPermissions: ["users.read"],
    description: "Administración interna y control de acceso.",
  },
];
