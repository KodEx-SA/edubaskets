import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      phoneNumber,
      role,
      businessName,
      businessAddress,
      businessPhone,
      description,
    } = body;

    // Validate required fields
    if (!email || !password || !name || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        role: role || "STUDENT",
        isActive: true,
      },
    });

    // If vendor, create vendor profile
    if (role === "VENDOR") {
      if (!businessName || !businessAddress || !businessPhone) {
        // Delete the user if vendor creation fails
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { error: "Missing required vendor fields" },
          { status: 400 }
        );
      }

      await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName,
          businessAddress,
          businessPhone,
          description: description || "",
          status: "PENDING_APPROVAL",
        },
      });
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
