import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { grievanceId, citizenId, rating, comment } = await req.json();

    if (!grievanceId || !citizenId || !rating) {
      return NextResponse.json(
        { error: "Grievance ID, citizen ID, and rating are required." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        grievanceId,
        citizenId,
        rating: Number(rating),
        comment: comment ? comment.trim() : null,
      },
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully. Thank you for helping us improve governance.", feedback },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}
