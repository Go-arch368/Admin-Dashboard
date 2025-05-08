import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';


export async function GET() {
  try {
    const results = await query('SELECT * FROM categories');
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, flag, description, display_order, is_active } = await request.json();
    
    await query(
      `INSERT INTO categories 
      (name, flag, description, display_order, is_active, created_at) 
      VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, flag, description, display_order, is_active]
    );
    
    return NextResponse.json(
      { message: 'Category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}


export async function PUT(request: NextRequest) {
  try {
    const { category_id, name, flag, description, display_order, is_active } = await request.json();
    
    await query(
      `UPDATE categories SET 
      name = ?, 
      flag = ?, 
      description = ?, 
      display_order = ?, 
      is_active = ?,
      updated_at = NOW()
      WHERE category_id = ?`,
      [name, flag, description, display_order, is_active, category_id]
    );
    
    return NextResponse.json(
      { message: 'Category updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { category_id } = await request.json();
    await query('DELETE FROM categories WHERE category_id = ?', [category_id]);
    
    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}