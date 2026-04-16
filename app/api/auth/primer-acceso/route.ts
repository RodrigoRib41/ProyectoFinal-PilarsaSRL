import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";
import { AppError, getErrorPayload } from "@/lib/core/api-errors";
import { initialPasswordChangeSchema } from "@/lib/domain/schemas";
import { db } from "@/lib/db";
import { getPasswordState, wrapActivePassword } from "@/lib/auth/password-state";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const username = session?.user?.username ?? session?.user?.name;

    if (!username) {
      throw new AppError("No se encontro una sesion valida.", 401);
    }

    if (!session?.user?.mustChangePassword) {
      throw new AppError("Este usuario no requiere definir una contrasena nueva.", 409);
    }

    const data = initialPasswordChangeSchema.parse(await request.json());
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new AppError("No se encontro el usuario actual.", 404);
    }

    const passwordState = getPasswordState(user.password);

    if (!passwordState.mustChangePassword) {
      throw new AppError("La contrasena inicial ya fue reemplazada.", 409);
    }

    const validCurrentPassword = await bcrypt.compare(data.currentPassword, passwordState.hash);

    if (!validCurrentPassword) {
      throw new AppError("La contrasena inicial es incorrecta.", 400);
    }

    const nextPassword = await bcrypt.hash(data.newPassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: wrapActivePassword(nextPassword),
      },
    });

    return NextResponse.json({
      success: true,
      message: "La contrasena se actualizo correctamente. Ingresa nuevamente con la nueva clave.",
    });
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
