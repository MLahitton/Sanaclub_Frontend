import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { IndexRedirect } from "./guards/IndexRedirect";
import { PermissionGuard } from "./guards/PermissionGuard";
import { AppLayout } from "../layouts/AppLayout";

// eslint-disable-next-line react-refresh/only-export-components
const ChangePasswordPage = lazy(() =>
  import("../features/auth/pages/ChangePasswordPage").then((module) => ({
    default: module.ChangePasswordPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const DashboardPlaceholderPage = lazy(() =>
  import("../pages/DashboardPlaceholderPage").then((module) => ({
    default: module.DashboardPlaceholderPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const CreateEvolutionSheetPage = lazy(() =>
  import("../features/evolution-sheets/pages/CreateEvolutionSheetPage").then((module) => ({
    default: module.CreateEvolutionSheetPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() =>
  import("../features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const LandingPlaceholderPage = lazy(() =>
  import("../pages/LandingPlaceholderPage").then((module) => ({
    default: module.LandingPlaceholderPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const ModulePlaceholderPage = lazy(() =>
  import("../pages/ModulePlaceholderPage").then((module) => ({
    default: module.ModulePlaceholderPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const AppointmentsPage = lazy(() =>
  import("../features/appointments/pages/AppointmentsPage").then((module) => ({
    default: module.AppointmentsPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const AppointmentsCalendarPage = lazy(() =>
  import("../features/appointments/pages/AppointmentsCalendarPage").then((module) => ({
    default: module.AppointmentsCalendarPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const CreateAppointmentPage = lazy(() =>
  import("../features/appointments/pages/CreateAppointmentPage").then((module) => ({
    default: module.CreateAppointmentPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const AppointmentDetailPage = lazy(() =>
  import("../features/appointments/pages/AppointmentDetailPage").then((module) => ({
    default: module.AppointmentDetailPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const EditAppointmentPage = lazy(() =>
  import("../features/appointments/pages/EditAppointmentPage").then((module) => ({
    default: module.EditAppointmentPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const PatientsListPage = lazy(() =>
  import("../features/patients/pages/PatientsListPage").then((module) => ({
    default: module.PatientsListPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const PatientDetailPage = lazy(() =>
  import("../features/patients/pages/PatientDetailPage").then((module) => ({
    default: module.PatientDetailPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const CreateTreatmentSheetPage = lazy(() =>
  import("../features/treatment-sheets/pages/CreateTreatmentSheetPage").then((module) => ({
    default: module.CreateTreatmentSheetPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const EvolutionSheetDetailPage = lazy(() =>
  import("../features/evolution-sheets/pages/EvolutionSheetDetailPage").then((module) => ({
    default: module.EvolutionSheetDetailPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const CompleteEvolutionSheetNewIndicationsPage = lazy(() =>
  import("../features/evolution-sheets/pages/CompleteEvolutionSheetNewIndicationsPage").then(
    (module) => ({
      default: module.CompleteEvolutionSheetNewIndicationsPage,
    }),
  ),
);
// eslint-disable-next-line react-refresh/only-export-components
const TreatmentSheetDetailPage = lazy(() =>
  import("../features/treatment-sheets/pages/TreatmentSheetDetailPage").then((module) => ({
    default: module.TreatmentSheetDetailPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const UpdateTreatmentSheetMedicalIndicationPage = lazy(() =>
  import("../features/treatment-sheets/pages/UpdateTreatmentSheetMedicalIndicationPage").then(
    (module) => ({
      default: module.UpdateTreatmentSheetMedicalIndicationPage,
    }),
  ),
);
// eslint-disable-next-line react-refresh/only-export-components
const EditPatientPage = lazy(() =>
  import("../features/patients/pages/EditPatientPage").then((module) => ({
    default: module.EditPatientPage,
  })),
);
// eslint-disable-next-line react-refresh/only-export-components
const CreatePatientPage = lazy(() =>
  import("../features/patients/pages/CreatePatientPage").then((module) => ({
    default: module.CreatePatientPage,
  })),
);

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <IndexRedirect />,
  },
  {
    path: "/foundation",
    element: <LandingPlaceholderPage />,
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/change-password",
    element: (
      <AuthGuard>
        <ChangePasswordPage />
      </AuthGuard>
    ),
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPlaceholderPage />,
      },
      {
        path: "patients",
        element: (
          <PermissionGuard permissions={["patients.read"]}>
            <PatientsListPage />
          </PermissionGuard>
        ),
      },
      {
        path: "patients/new",
        element: (
          <PermissionGuard
            permissions={["patients.create", "catalogs.read"]}
            mode="all"
          >
            <CreatePatientPage />
          </PermissionGuard>
        ),
      },
      {
        path: "patients/:id",
        element: (
          <PermissionGuard permissions={["patients.read"]}>
            <PatientDetailPage />
          </PermissionGuard>
        ),
      },
      {
        path: "patients/:patientId/treatment-sheets/new",
        element: (
          <PermissionGuard permissions={["patients.read", "treatments.create"]} mode="all">
            <CreateTreatmentSheetPage />
          </PermissionGuard>
        ),
      },
      {
        path: "patients/:patientId/evolution-sheets/new",
        element: (
          <PermissionGuard
            permissions={["patients.read", "evolutions.create", "treatments.read"]}
            mode="all"
          >
            <CreateEvolutionSheetPage />
          </PermissionGuard>
        ),
      },
      {
        path: "evolution-sheets/:evolutionSheetId",
        element: (
          <PermissionGuard permissions={["evolutions.read"]}>
            <EvolutionSheetDetailPage />
          </PermissionGuard>
        ),
      },
      {
        path: "evolution-sheets/:evolutionSheetId/new-indications",
        element: (
          <PermissionGuard permissions={["evolutions.update_draft"]}>
            <CompleteEvolutionSheetNewIndicationsPage />
          </PermissionGuard>
        ),
      },
      {
        path: "treatment-sheets/:treatmentSheetId",
        element: (
          <PermissionGuard permissions={["treatments.read"]}>
            <TreatmentSheetDetailPage />
          </PermissionGuard>
        ),
      },
      {
        path: "treatment-sheets/:treatmentSheetId/medical-indication",
        element: (
          <PermissionGuard permissions={["treatments.update_medical_indication"]}>
            <UpdateTreatmentSheetMedicalIndicationPage />
          </PermissionGuard>
        ),
      },
      {
        path: "patients/:id/edit",
        element: (
          <PermissionGuard permissions={["patients.update", "catalogs.read"]} mode="all">
            <EditPatientPage />
          </PermissionGuard>
        ),
      },
      {
        path: "appointments",
        element: (
          <PermissionGuard permissions={["appointments.read"]}>
            <AppointmentsPage />
          </PermissionGuard>
        ),
      },
      {
        path: "appointments/new",
        element: (
          <PermissionGuard permissions={["appointments.create", "patients.read"]} mode="all">
            <CreateAppointmentPage />
          </PermissionGuard>
        ),
      },
      {
        path: "appointments/calendar",
        element: (
          <PermissionGuard permissions={["appointments.read"]}>
            <AppointmentsCalendarPage />
          </PermissionGuard>
        ),
      },
      {
        path: "appointments/:appointmentId/edit",
        element: (
          <PermissionGuard permissions={["appointments.read", "appointments.update"]} mode="all">
            <EditAppointmentPage />
          </PermissionGuard>
        ),
      },
      {
        path: "appointments/:appointmentId",
        element: (
          <PermissionGuard permissions={["appointments.read"]}>
            <AppointmentDetailPage />
          </PermissionGuard>
        ),
      },
      {
        path: "medical-requests",
        element: (
          <PermissionGuard
            permissions={[
              "treatments.update_medical_indication",
              "evolutions.update_draft",
            ]}
            mode="any"
          >
            <ModulePlaceholderPage
              title="Solicitudes médicas"
              moduleName="Solicitudes médicas"
              description="Módulo placeholder para solicitudes médicas. Sin flujo real todavía."
              requiredPermissions={[
                "treatments.update_medical_indication",
                "evolutions.update_draft",
              ]}
            />
          </PermissionGuard>
        ),
      },
      {
        path: "clinical-documentation",
        element: (
          <PermissionGuard
            permissions={["treatments.read", "evolutions.read", "consents.read"]}
            mode="any"
          >
            <ModulePlaceholderPage
              title="Documentación clínica"
              moduleName="Documentación clínica"
              description="Módulo placeholder para documentación clínica. Sin datos reales."
              requiredPermissions={["treatments.read", "evolutions.read", "consents.read"]}
            />
          </PermissionGuard>
        ),
      },
      {
        path: "documents",
        element: (
          <PermissionGuard permissions={["documents.read"]}>
            <ModulePlaceholderPage
              title="Documentos"
              moduleName="Documentos"
              description="Módulo placeholder para documentos clínicos. No se descargan documentos en esta fase."
              requiredPermissions={["documents.read"]}
            />
          </PermissionGuard>
        ),
      },
      {
        path: "users",
        element: (
          <PermissionGuard permissions={["users.read"]}>
            <ModulePlaceholderPage
              title="Usuarios internos"
              moduleName="Usuarios internos"
              description="Módulo placeholder para usuarios internos y control de acceso."
              requiredPermissions={["users.read"]}
            />
          </PermissionGuard>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
