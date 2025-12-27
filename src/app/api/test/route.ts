import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const hamperCount = await prisma.hamper.count();
    const vendorCount = await prisma.vendor.count();

    return NextResponse.json({
      success: true,
      message: "Database connected!",
      stats: {
        users: userCount,
        hampers: hamperCount,
        vendors: vendorCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error,
      },
      { status: 500 }
    );
  }
}
