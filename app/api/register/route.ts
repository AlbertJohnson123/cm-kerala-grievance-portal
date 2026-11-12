import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findUserByEmail, saveUser } from "@/lib/usersStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check in-memory store
    if (findUserByEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // 2. Check DB if accessible
    try {
      const existing = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }
    } catch (e) {
      // Prisma error fallback - continue
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = "user_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile ? mobile.trim() : null,
      passwordHash,
      plainPassword: password,
      role: "CITIZEN",
    };

    // Save in in-memory store so login works immediately
    saveUser(newUser);

    // Also persist to DB in background / best-effort
    try {
      await prisma.user.create({
        data: {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          passwordHash,
          role: "CITIZEN",
        },
      });
    } catch (dbErr) {
      console.warn("DB user creation warning (stored in fallback):", dbErr);
    }

    return NextResponse.json(
      {
        message: "Registration successful. You can now login.",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error?.message || "Registration failed due to a server error." },
      { status: 500 }
    );
  }
}
