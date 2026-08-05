import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { authenticateAdminUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation & Email Normalization
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_EMAIL_FORMAT",
          message: issue.message || "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 2. Authenticate against Neon PostgreSQL DB
    const result = await authenticateAdminUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: result.code,
          message: result.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "An error occurred while connecting to the database server. Please try again.",
      },
      { status: 500 }
    );
  }
}
