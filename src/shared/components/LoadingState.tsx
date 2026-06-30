type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-sanaclub-bg)] px-4">
      <div className="min-w-[260px] rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-sanaclub-coral)] border-t-[var(--color-sanaclub-green)]" />
        <p className="text-sm font-medium text-[var(--color-sanaclub-text)]">{message}</p>
      </div>
    </div>
  );
}

