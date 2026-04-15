import { cookies } from "next/headers";

export const ADMIN_EMAIL = "admin@sofraqr.com";
export const ADMIN_PASSWORD = "admin123";
export const ADMIN_COOKIE_NAME = "sofraqr_admin";
export const ADMIN_COOKIE_VALUE = "authorized";

export async function setAdminSession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;
}
