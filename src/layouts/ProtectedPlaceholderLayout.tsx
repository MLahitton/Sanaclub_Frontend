import type { ReactNode } from "react";
import { PublicLayout } from "./PublicLayout";

type ProtectedPlaceholderLayoutProps = {
  children: ReactNode;
};

export function ProtectedPlaceholderLayout({
  children,
}: ProtectedPlaceholderLayoutProps) {
  return (
    <PublicLayout>
      <section className="w-full py-6">{children}</section>
    </PublicLayout>
  );
}
