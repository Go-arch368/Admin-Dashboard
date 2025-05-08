import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Define a custom error type for database errors
interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id');
    
    let sql = 'SELECT * FROM subcategories';
    const params = [];
    
    if (category_id) {
      sql += ' WHERE category_id = ?';
      params.push(category_id);
    }
    
    sql += ' ORDER BY display_order ASC';
    
    const results = await query(sql, params);
    return NextResponse.json(results, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching subcategories:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch subcategories', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      category_id,
      name, 
      slug,
      description,
      display_order,
      is_active
    } = await request.json();

    if (!category_id || !name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields (category_id, name, slug)' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO subcategories (
        category_id,
        name,
        slug,
        description,
        display_order,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        slug,
        description || null,
        display_order || 0,
        is_active !== undefined ? is_active : true
      ]
    );

    return NextResponse.json(
      { message: 'Subcategory created successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating subcategory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to create subcategory',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      subcategory_id,
      category_id,
      name,
      slug,
      description,
      display_order,
      is_active
    } = await request.json();

    if (!subcategory_id) {
      return NextResponse.json(
        { error: 'subcategory_id is required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE subcategories SET
        category_id = ?,
        name = ?,
        slug = ?,
        description = ?,
        display_order = ?,
        is_active = ?
      WHERE subcategory_id = ?`,
      [
        category_id,
        name,
        slug,
        description || null,
        display_order || 0,
        is_active !== undefined ? is_active : true,
        subcategory_id
      ]
    );

    return NextResponse.json(
      { message: 'Subcategory updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating subcategory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isForeignKeyError = error instanceof Error && 'code' in error 
      ? (error as DatabaseError).code === 'ER_ROW_IS_REFERENCED_2'
      : false;
    
    return NextResponse.json(
      { 
        error: 'Failed to update subcategory',
        details: isForeignKeyError
          ? 'Cannot update: Subcategory is referenced elsewhere'
          : errorMessage
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { subcategory_id } = await request.json();

    if (!subcategory_id) {
      return NextResponse.json(
        { error: 'subcategory_id is required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM subcategories WHERE subcategory_id = ?',
      [subcategory_id]
    );

    return NextResponse.json(
      { message: 'Subcategory deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting subcategory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isForeignKeyError = error instanceof Error && 'code' in error 
      ? (error as DatabaseError).code === 'ER_ROW_IS_REFERENCED_2'
      : false;
    
    return NextResponse.json(
      { 
        error: 'Failed to delete subcategory',
        details: isForeignKeyError
          ? 'Cannot delete: Subcategory is in use' 
          : errorMessage
      },
      { status: 500 }
    );
  }
}