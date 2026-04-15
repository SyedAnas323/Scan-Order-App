import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-config";

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };
}

export function isAdminCookieAuthorized(value?: string | null) {
  return value === ADMIN_COOKIE_VALUE;
}

export { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE };
