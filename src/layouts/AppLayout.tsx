import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { APP_NAME } from "../shared/constants/app.constants";
import { useAuth } from "../features/auth/hooks/useAuth";
import { usePermissions } from "../features/auth/hooks/usePermissions";
import { BrandLogo } from "../shared/components/BrandLogo";
import { PageHeader } from "../shared/components/PageHeader";
import { UserInitialsAvatar } from "../shared/components/UserInitialsAvatar";
import { APP_INTERNAL_NAVIGATION } from "../shared/navigation/navigation.config";

type LayoutNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  description?: string;
};

function hasAccessToNavigationItem(
  item: (typeof APP_INTERNAL_NAVIGATION)[number],
  canAny: (permissions: string[]) => boolean,
  canAll: (permissions: string[]) => boolean,
) {
  if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
    return true;
  }

  return item.requireAnyPermission ? canAny(item.requiredPermissions) : canAll(item.requiredPermissions);
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const { canAny, canAll } = usePermissions();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRoles = user?.roles ?? [];
  const userFullName = user?.fullName ?? "Usuario interno";

  const visibleNavigation = useMemo(
    () =>
      APP_INTERNAL_NAVIGATION.filter((item) =>
        hasAccessToNavigationItem(item, canAny, canAll),
      ),
    [canAny, canAll],
  );

  const currentSection = useMemo(() => {
    const exactSection = visibleNavigation.find((item) => item.path === location.pathname);

    if (exactSection) return exactSection;

    return (
      visibleNavigation.find(
        (item) =>
          item.path !== "/app" &&
          item.path.length > 1 &&
          location.pathname.startsWith(`${item.path}/`),
      ) ?? visibleNavigation[0]
    );
  }, [location.pathname, visibleNavigation]);

  const sectionLabel = currentSection?.label ?? "Dashboard";
  const sectionDescription =
    currentSection?.description ?? "Bienvenido al panel interno de Sanaclub.";
  const navigationItems: LayoutNavItem[] = visibleNavigation.map((item) => {
    const Icon = item.icon;
    return {
      label: item.label,
      href: item.path,
      icon: <Icon className="h-4 w-4" />,
      description: item.description,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--color-sanaclub-bg)]">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      <div className="mx-auto flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-[var(--color-sanaclub-border)] bg-white/95 shadow-[0_20px_60px_rgba(36,51,43,0.15)] transition-transform duration-200 md:static md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:w-[300px]`}
        >
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo withText compact={false} />
              <button
                type="button"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-muted)]">
              {APP_NAME} interno
            </p>

            <nav className="mt-3 flex-1 overflow-y-auto">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-start gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive
                          ? "bg-[var(--color-sanaclub-green)]/12 text-[var(--color-sanaclub-green-dark)]"
                          : "text-[var(--color-sanaclub-text)] hover:bg-[var(--color-sanaclub-bg)]"}`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {({ isActive }) => (
                        <Fragment>
                          <span className="pt-0.5">{item.icon}</span>
                          <span className="flex-1">
                            <span
                              className={`block font-medium ${isActive ? "text-[var(--color-sanaclub-green-dark)]" : "text-[var(--color-sanaclub-text)]"}`}
                            >
                              {item.label}
                            </span>
                            {item.description ? (
                              <span className="mt-1 block text-[11px] text-[var(--color-sanaclub-muted)]">
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                          {isActive ? (
                            <ChevronRight className="h-4 w-4 text-[var(--color-sanaclub-green-dark)]" />
                          ) : null}
                        </Fragment>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 rounded-2xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-3">
              <div className="flex items-center gap-3">
                <UserInitialsAvatar fullName={userFullName} email={user?.email} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{userFullName}</p>
                  <p className="truncate text-xs text-[var(--color-sanaclub-muted)]">
                    {user?.email ?? "interno@sanaclub.local"}
                  </p>
                </div>
              </div>

              {userRoles.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {userRoles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full border border-[var(--color-sanaclub-green)]/30 bg-[var(--color-sanaclub-green)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-sanaclub-green-dark)]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={logout}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-sanaclub-green)] px-3 py-2 text-xs font-semibold text-[var(--color-sanaclub-green)] transition hover:bg-[var(--color-sanaclub-green)] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        <section className="min-h-screen flex-1">
          <header className="sticky top-0 z-30 border-b border-[var(--color-sanaclub-border)] bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
              <button
                type="button"
                className="rounded-full border border-[var(--color-sanaclub-border)] p-2 md:hidden"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Abrir menú"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="flex-1">
                <PageHeader
                  title={sectionLabel}
                  description={sectionDescription}
                  breadcrumbs={[
                    { label: "Inicio", path: "/app" },
                    { label: sectionLabel },
                  ]}
                />
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
