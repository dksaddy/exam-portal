import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '../../../lib/prisma'; // Ensure this is the correct path to your Prisma instance

export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name');
    const image = formData.get('image');
    const questions = JSON.parse(formData.get('questions'));
    const options = JSON.parse(formData.get('options'));
    const correctAns = formData.get('correctAns'); // Correct answer as a string

    console.log('Form data received:', { name, questions, options, correctAns });

    if (!name || !questions || !options || !correctAns) {
      return NextResponse.json(
        { error: 'Name, questions, options, and correct answer are required' },
        { status: 400 }
      );
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (image) {
      const imagePath = path.join(process.cwd(), 'public', 'uploads', image.name);

      // Convert the image to a buffer and save it to disk
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.promises.writeFile(imagePath, buffer);

      imageUrl = `/uploads/${image.name}`; // Save the relative path to the image
      console.log('Image URL:', imageUrl);
    }

    // Save the question data into the database
    const createdQuestion = await prisma.question.create({
      data: {
        name,
        imageUrl, // Store the image path if it's available
        questions, // Store the questions JSON data
        options, // Store options as an array of strings
        correctAns, // Store correct answer as a string
      },
    });

    console.log('Created question:', createdQuestion);

    return NextResponse.json({ message: 'Questions uploaded successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({ error: 'Failed to upload questions' }, { status: 500 });
  }
}
