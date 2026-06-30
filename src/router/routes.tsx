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
const TreatmentSheetDetailPage = lazy(() =>
  import("../features/treatment-sheets/pages/TreatmentSheetDetailPage").then((module) => ({
    default: module.TreatmentSheetDetailPage,
  })),
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
        path: "treatment-sheets/:treatmentSheetId",
        element: (
          <PermissionGuard permissions={["treatments.read"]}>
            <TreatmentSheetDetailPage />
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
            <ModulePlaceholderPage
              title="Agenda"
              moduleName="Agenda"
              description="Módulo placeholder para agenda. No hay calendario real en esta fase."
              requiredPermissions={["appointments.read"]}
            />
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
