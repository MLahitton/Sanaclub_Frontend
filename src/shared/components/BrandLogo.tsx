import { useState } from "react";
import { APP_BRAND, APP_NAME } from "../constants/app.constants";

type BrandLogoProps = {
  compact?: boolean;
  withText?: boolean;
  className?: string;
};

export function BrandLogo({
  compact = false,
  withText = false,
  className,
}: BrandLogoProps) {
  const [showLogo, setShowLogo] = useState(true);

  const wrapperClass = compact
    ? "h-10 w-10"
    : "h-14 w-14";

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] ${wrapperClass}`}
      >
        {showLogo ? (
          <img
            src={APP_BRAND.logoPath}
            alt={`${APP_NAME} logo`}
            className="h-10 w-10 rounded-lg object-contain"
            onError={() => setShowLogo(false)}
          />
        ) : (
          <span className="text-sm font-bold text-[var(--color-sanaclub-green)]">
            {APP_BRAND.fallbackInitials}
          </span>
        )}
      </div>

      {withText && (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-green)]">
            {APP_NAME}
          </p>
        </div>
      )}
    </div>
  );
}

