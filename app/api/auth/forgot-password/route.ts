import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validation";
import { resetUserPasswordByEmail } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const parsed = forgotPasswordSchema.parse(await request.json());
    const user = await resetUserPasswordByEmail(parsed.email, parsed.password);

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to reset password." },
      { status: 400 }
    );
  }
}

