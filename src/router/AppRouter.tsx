import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { appRoutes } from "./routes";
import { LoadingState } from "../shared/components/LoadingState";

export function AppRouter() {
  const router = createBrowserRouter(appRoutes);

  return (
    <Suspense fallback={<LoadingState message="Cargando sección interna..." />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
