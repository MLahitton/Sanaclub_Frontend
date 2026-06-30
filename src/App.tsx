const upcomingModules = [
  "Autenticación interna",
  "Pacientes",
  "Agenda clínica",
  "Documentos PDF",
  "Usuarios internos",
];

function App() {
  return (
    <main className="min-h-screen px-6 py-10 text-[var(--color-sanaclub-text)]">
      <section className="mx-auto flex max-w-5xl flex-col gap-10 rounded-[2rem] border border-[var(--color-sanaclub-border)] bg-white/85 p-8 shadow-[0_24px_80px_rgba(36,51,43,0.08)] backdrop-blur">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/brand/sanaclub-logo.png"
              alt="Logo Sanaclub"
              className="h-20 w-20 rounded-3xl bg-white object-contain p-2 shadow-sm"
            />

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-sanaclub-green)]">
                Aplicación clínica interna
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Sanaclub
              </h1>
            </div>
          </div>

          <span className="w-fit rounded-full bg-[var(--color-sanaclub-green)] px-4 py-2 text-sm font-semibold text-white">
            Frontend foundation activa
          </span>
        </header>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.5rem] bg-[var(--color-sanaclub-bg)] p-6">
            <h2 className="text-2xl font-bold">
              Base frontend lista para construir el MVP
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-sanaclub-muted)]">
              Esta primera base prepara el frontend de Sanaclub con React,
              Vite, TypeScript, Tailwind CSS y una estructura pensada para
              consumir la API clínica interna de forma segura.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--color-sanaclub-green-dark)]">
                React + Vite
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--color-sanaclub-green-dark)]">
                TypeScript
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--color-sanaclub-green-dark)]">
                Tailwind CSS
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--color-sanaclub-green-dark)]">
                pnpm
              </span>
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-[var(--color-sanaclub-border)] bg-white p-6">
            <h3 className="text-lg font-bold">Próximas fases</h3>

            <ul className="mt-5 space-y-3">
              {upcomingModules.map((module) => (
                <li
                  key={module}
                  className="flex items-center gap-3 rounded-2xl bg-[var(--color-sanaclub-bg)] px-4 py-3 text-sm font-medium"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-sanaclub-coral)]" />
                  {module}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;