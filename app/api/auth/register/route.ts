import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

interface UserRequest {
  username: string;
  password: string;
  role: "STOCK" | "SERVICES" | "FINANZAS" | "SUPERADMIN";
}

export async function POST(request: Request): Promise<Response> {
  try {
    const data: UserRequest = await request.json();

    const userFound = await db.user.findUnique({
      where: { username: data.username },
    });

    if (userFound) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await db.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role, // ✅ AQUÍ se guarda el rol recibido
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
