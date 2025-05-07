import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Your existing query function

// GET: Fetch all students
export async function GET() {
  try {
    const results = await query('SELECT * FROM students');
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

// POST: Create a new student
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone_number, gender } = await request.json();
    await query(
      'INSERT INTO students (name, email, phone_number, gender) VALUES (?, ?, ?, ?)',
      [name, email, phone_number, gender]
    );
    return NextResponse.json({ message: 'Student created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}

// PUT: Update an existing student
export async function PUT(request: NextRequest) {
  try {
    const { id, name, email, phone_number, gender } = await request.json();
    await query(
      'UPDATE students SET name = ?, email = ?, phone_number = ?, gender = ? WHERE id = ?',
      [name, email, phone_number, gender, id]
    );
    return NextResponse.json({ message: 'Student updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE: Delete a student
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await query('DELETE FROM students WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}