import { memo } from "react";
import { getInitials } from "../utils/getInitials";

type UserInitialsAvatarProps = {
  fullName: string;
  email?: string;
  size?: "sm" | "md" | "lg";
};

function getAvatarColor(seed: string): string {
  const palette = [
    "#3f7f59",
    "#2f6045",
    "#ff6b6f",
    "#e85a61",
    "#dfa889",
  ];
  const index = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return palette[index % palette.length] ?? palette[0];
}

function getSizeClass(size: UserInitialsAvatarProps["size"]) {
  switch (size) {
    case "sm":
      return "h-8 w-8 text-xs";
    case "lg":
      return "h-14 w-14 text-sm";
    case "md":
    default:
      return "h-10 w-10 text-sm";
  }
}

function Avatar({
  fullName,
  email,
  size = "md",
}: UserInitialsAvatarProps) {
  const initials = getInitials(fullName || email).replace(/\s+/g, "");
  const circleColor = getAvatarColor(fullName || email || "SC");

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${getSizeClass(size)}`}
      style={{
        background: `linear-gradient(135deg, ${circleColor}, ${circleColor}c0)`,
      }}
      aria-label={`Avatar de ${fullName || "usuario interno"}`}
      title={fullName || email || "Usuario interno"}
    >
      {initials}
    </span>
  );
}

export const UserInitialsAvatar = memo(Avatar);

