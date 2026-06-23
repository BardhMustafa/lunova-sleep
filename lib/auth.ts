import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const COOKIE_NAME = "lunova_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.SESSION_SECRET || "insecure-dev-secret";
}

/** Create a signed token: base64(payload).hmac */
function sign(payload: string): string {
  const sig = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

function verify(token: string): boolean {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  let payload: string;
  try {
    payload = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return false;
  }
  // payload is "admin:<issuedAt>" — check not expired
  const parts = payload.split(":");
  const issued = Number(parts[1]);
  if (!issued || Date.now() / 1000 - issued > MAX_AGE) return false;
  return true;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "lunova-admin";
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSession() {
  const payload = `admin:${Math.floor(Date.now() / 1000)}`;
  const token = sign(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function destroySession() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export function isAuthenticated(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verify(token);
}

/** For protected pages — redirects to login if not authenticated. */
export function requireAuth() {
  if (!isAuthenticated()) redirect("/admin/login");
}
