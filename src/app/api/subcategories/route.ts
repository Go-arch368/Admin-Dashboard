import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';


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
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

// 2. CREATE NEW SUBCATEGORY
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

    // Validate required fields
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
  } catch (error: any) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create subcategory',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// 3. UPDATE SUBCATEGORY
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
  } catch (error: any) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update subcategory',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// 4. DELETE SUBCATEGORY
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
  } catch (error: any) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete subcategory',
        details: error.message.includes('foreign key constraint') 
               ? 'Cannot delete: Subcategory is in use' 
               : error.message
      },
      { status: 500 }
    );
  }
}