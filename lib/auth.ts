import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionPayload } from "@/lib/types";
import { getUserById } from "@/lib/data-store";

const cookieName = "sofraqr_session";

function getSecret() {
  return process.env.APP_SESSION_SECRET || "local-demo-secret-change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function serializeSession(payload: SessionPayload) {
  const json = JSON.stringify(payload);
  const encoded = Buffer.from(json, "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function parseSession(value?: string | null): SessionPayload | null {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) {
    return null;
  }

  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const store = await cookies();
  store.set(cookieName, serializeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function getSession() {
  const store = await cookies();
  return parseSession(store.get(cookieName)?.value);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/en/login");
  }
  return session;
}

export async function requireUser() {
  const session = await requireSession();
  const user = await getUserById(session.userId);

  if (!user) {
    redirect("/en/login");
  }

  return { session, user };
}
