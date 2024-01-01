import { connectToDb } from "@/src/utils";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDb();
    const tweet = await prisma.tweets.findFirst({
      where: { id: params.id },
    });

    return NextResponse.json({ tweet }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { tweet } = await req.json();

    if (!tweet)
      return NextResponse.json({ error: "Missing Data" }, { status: 422 });

    await connectToDb();
    const updatedTweet = await prisma.tweets.update({
      where: { id: params.id },
      data: { tweet },
    });

    return NextResponse.json({ tweet: updatedTweet }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDb();
    const deletedTweet = await prisma.tweets.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ tweet: deletedTweet }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
