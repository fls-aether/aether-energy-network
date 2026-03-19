import { getAlchemistDefinition } from '@/lib/lexicon'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { telemetry: true }
    });

    if (!user || !user.telemetry) {
      return NextResponse.json({ telemetry: null }, { status: 200 });
    }

    return NextResponse.json({ telemetry: user.telemetry }, { status: 200 });
  } catch (error) {
    console.error("Telemetry API GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { operatorCode, avatarUrl, payload } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const telemetry = await prisma.telemetry.upsert({
      where: { userId: user.id },
      update: {
        ...(operatorCode && { operatorCode }),
        ...(avatarUrl && { avatarUrl }),
        ...(payload && { payload }),
      },
      create: {
        userId: user.id,
        operatorCode: operatorCode || "",
        avatarUrl: avatarUrl || "",
        payload: payload || {},
      }
    });

    return NextResponse.json({ telemetry }, { status: 200 });
  } catch (error) {
    console.error("Telemetry API POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
