// src/app/api/exam/route.js

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";  // Adjust the import path if necessary

// Define the GET method to fetch course data by id
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");  // Get the id from query string

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the course with the corresponding id
    const course = await prisma.question.findUnique({
      where: {
        id: parseInt(id),  // Ensure id is converted to an integer
      },
      select: {
        name: true,
        questions: true,
        options: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch course data.",
        error: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
