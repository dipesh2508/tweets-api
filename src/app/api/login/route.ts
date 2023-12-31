import { connectToDb } from "@/src/utils";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();

    if (!email && !password)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 422 }
      );

    await connectToDb();
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!existingUser)
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    return NextResponse.json({ user: existingUser }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
