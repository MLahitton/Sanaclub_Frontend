import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-sanaclub-bg)] px-4 py-8 text-[var(--color-sanaclub-text)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">{children}</div>
    </div>
  );
}
