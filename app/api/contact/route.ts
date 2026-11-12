import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are all required." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Your message has been received by the CM Grievance Cell.",
        id: enquiry.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to record enquiry" }, { status: 500 });
  }
}
