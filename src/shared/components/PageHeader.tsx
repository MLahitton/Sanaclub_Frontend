import { Link } from "react-router-dom";

type Breadcrumb = {
  label: string;
  path?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  badge?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  badge,
}: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {breadcrumbs.length > 0 ? (
        <nav aria-label="Ruta" className="text-xs">
          <ol className="flex flex-wrap items-center gap-2 text-[var(--color-sanaclub-muted)]">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.label} className="inline-flex items-center gap-2">
                {breadcrumb.path ? (
                  <Link
                    to={breadcrumb.path}
                    className="transition hover:text-[var(--color-sanaclub-green)]"
                  >
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span>{breadcrumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-sanaclub-text)]">
          {title}
        </h1>
        {badge ? (
          <span className="rounded-full border border-[var(--color-sanaclub-coral)]/30 bg-[var(--color-sanaclub-coral)]/10 px-3 py-1 text-xs font-medium text-[var(--color-sanaclub-coral-dark)]">
            {badge}
          </span>
        ) : null}
      </div>

      {description ? (
        <p className="max-w-3xl text-sm text-[var(--color-sanaclub-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
