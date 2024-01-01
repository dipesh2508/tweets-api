import { connectToDb } from "@/src/utils";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectToDb();
    const tweets = await prisma.tweets.findMany();

    return NextResponse.json({ tweets }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request) => {
  try {
    const { tweet, userId } = await req.json();

    if (!tweet || !userId)
      return NextResponse.json({ error: "Missing Data" }, { status: 422 });

    await connectToDb();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 422 });

    const newTweet = await prisma.tweets.create({
      data: { tweet, userId },
    });

    return NextResponse.json({ tweet: newTweet }, { status: 201 });
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
