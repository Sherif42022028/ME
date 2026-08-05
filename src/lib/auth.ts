import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";
import { normalizeEmail } from "./validators";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "super-secret-me-jwt-token-key-2026-micaela-ella"
);
const COOKIE_NAME = "me_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Server Authorization Helper:
 * Verifies that the current request has an active ADMIN or STAFF session.
 * Throws error or returns session if authorized.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED_NO_SESSION");
  }
  if (session.role !== "ADMIN" && session.role !== "STAFF") {
    throw new Error("UNAUTHORIZED_FORBIDDEN_ROLE");
  }
  return session;
}

/**
 * Authenticates user credentials with detailed failure reporting
 */
export async function authenticateAdminUser(emailInput: string, passwordInput: string) {
  const normalized = normalizeEmail(emailInput);

  // Search user by email
  const user = await prisma.user.findUnique({
    where: { email: normalized },
  });

  if (!user) {
    return { success: false, code: "INVALID_CREDENTIALS", message: "Incorrect email or password." };
  }

  const isPasswordValid = await verifyPassword(passwordInput, user.passwordHash);
  if (!isPasswordValid) {
    return { success: false, code: "INVALID_CREDENTIALS", message: "Incorrect email or password." };
  }

  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    return {
      success: false,
      code: "UNAUTHORIZED_ACCOUNT",
      message: "Access denied. Only administrators and authorized staff can log in to the ME Admin Dashboard.",
    };
  }

  // Create session
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  await createSession(payload);

  return {
    success: true,
    user: payload,
  };
}
