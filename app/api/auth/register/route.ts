import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth/options";
import { AppError, getErrorPayload } from "@/lib/core/api-errors";
import { registerUserSchema } from "@/lib/domain/schemas";
import { wrapInitialPassword } from "@/lib/auth/password-state";
import { assertSuperAdminSession } from "@/lib/auth/root-admin";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    assertSuperAdminSession(session);

    const data = registerUserSchema.parse(await request.json());

    const userFound = await db.user.findUnique({
      where: { username: data.username },
    });

    if (userFound) {
      throw new AppError("El usuario ya existe.", 409);
    }

    const password = wrapInitialPassword(await bcrypt.hash(data.password, 10));
    const user = await db.user.create({
      data: {
        username: data.username,
        password,
        role: data.role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          mustChangePassword: true,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const payload = getErrorPayload(error);
    return NextResponse.json(
      {
        success: false,
        message: payload.message,
        details: payload.details,
      },
      { status: payload.statusCode },
    );
  }
}
