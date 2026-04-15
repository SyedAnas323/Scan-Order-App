import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-config";

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
