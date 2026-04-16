import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";
import { getPasswordState, isRootAdminUsername, wrapInitialPassword } from "@/lib/auth/password-state";
import { assertSuperAdminSession } from "@/lib/auth/root-admin";
import { AppError, getErrorPayload } from "@/lib/core/api-errors";
import { resetInternalUserPasswordSchema } from "@/lib/domain/schemas";
import { db } from "@/lib/db";

function parseUserIdFromRequest(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("El usuario solicitado es invalido.", 400);
  }

  return id;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    assertSuperAdminSession(session);

    const users = await db.user.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    const data = users
      .map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updateAt,
        mustChangePassword: getPasswordState(user.password).mustChangePassword,
        isRootAdmin: isRootAdminUsername(user.username),
      }))
      .sort((left, right) => Number(right.isRootAdmin) - Number(left.isRootAdmin));

    return NextResponse.json({
      success: true,
      data,
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

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    assertSuperAdminSession(session);

    const data = resetInternalUserPasswordSchema.parse(await request.json());
    const user = await db.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      throw new AppError("No se encontro el usuario solicitado.", 404);
    }

    if (isRootAdminUsername(user.username)) {
      throw new AppError("La cuenta admin no puede resetearse desde este modulo.", 409);
    }

    const password = wrapInitialPassword(await bcrypt.hash(data.password, 10));

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        password,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updateAt,
        mustChangePassword: true,
        isRootAdmin: false,
      },
      message:
        "La contrasena se restablecio como inicial. El usuario debera cambiarla en el proximo ingreso.",
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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    assertSuperAdminSession(session);

    const id = parseUserIdFromRequest(request);
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError("No se encontro el usuario solicitado.", 404);
    }

    if (isRootAdminUsername(user.username)) {
      throw new AppError("La cuenta admin no puede eliminarse desde este modulo.", 409);
    }

    await db.user.delete({
      where: { id: user.id },
    });

    return new NextResponse(null, { status: 204 });
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
