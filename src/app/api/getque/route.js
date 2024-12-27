import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust path if necessary

export async function GET() {
  try {
    // Fetch questions from the database
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        name: true,         // Assuming the name is the title of the course
        imageUrl: true,     // Assuming there's an imageUrl
        createdAt: true,    // Just an example, you can remove or add other fields
      },
    });

    // Return the questions as JSON
    return NextResponse.json({ success: true, data: questions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    
    // Return an error response if something goes wrong
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch questions.",
        error: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
