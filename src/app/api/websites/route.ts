import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');
    const category_id = searchParams.get('category_id');
    const subcategory_id = searchParams.get('subcategory_id');
    const status = searchParams.get('status');
    const is_featured = searchParams.get('is_featured');
    const state = searchParams.get('state');
    const city = searchParams.get('city');

    let sql = `SELECT 
      id, website_id, website_name, website_url, logo_url,
      is_featured, status, category_id, category_name,
      subcategory_id, subcategory_name, pincode, city, state
    FROM websites WHERE 1=1`;
    
    const params = [];

    if (pincode) {
      sql += ' AND pincode = ?';
      params.push(pincode);
    }
    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }
    if (subcategory_id) {
      sql += ' AND subcategory_id = ?';
      params.push(subcategory_id);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (is_featured) {
      sql += ' AND is_featured = ?';
      params.push(is_featured === 'true');
    }
    if (state) {
      sql += ' AND state = ?';
      params.push(state);
    }
    if (city) {
      sql += ' AND city = ?';
      params.push(city);
    }

    // Optimized for partitioned table
    sql += ' ORDER BY website_name ASC LIMIT 1000';

    const results = await query(sql, params);
    return NextResponse.json(results, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching websites:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch websites', details: errorMessage },
      { status: 500 }
    );
  }
}

// 2. CREATE WEBSITE (with partition-aware insertion)
export async function POST(request: NextRequest) {
  try {
    const { 
      website_id,
      website_name,
      website_url,
      logo_url,
      is_featured = false,
      status = 'active',
      category_id,
      category_name,
      category_slug,
      subcategory_id,
      subcategory_name,
      subcategory_slug,
      pincode,
      city,
      state
    } = await request.json();

    // Validate required fields
    const requiredFields = [
      'website_id', 'website_name', 'website_url', 
      'category_id', 'category_name', 'category_slug',
      'subcategory_id', 'subcategory_name', 'subcategory_slug',
      'pincode', 'city', 'state'
    ];
    
    const missingFields = requiredFields.filter(field => !eval(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO websites (
        website_id, website_name, website_url, logo_url,
        is_featured, status, category_id, category_name, category_slug,
        subcategory_id, subcategory_name, subcategory_slug,
        pincode, city, state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        website_id,
        website_name,
        website_url,
        logo_url || null,
        is_featured,
        status,
        category_id,
        category_name,
        category_slug,
        subcategory_id,
        subcategory_name,
        subcategory_slug,
        pincode,
        city,
        state
      ]
    );

    return NextResponse.json(
      { message: 'Website created successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating website:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to create website',
        details: errorMessage.includes('Duplicate entry') 
               ? 'Website already exists for this category and pincode' 
               : errorMessage
      },
      { status: 500 }
    );
  }
}

// 3. UPDATE WEBSITE (partition-aware update)
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      pincode,
      website_name,
      website_url,
      logo_url,
      is_featured,
      status,
      category_id,
      category_name,
      subcategory_id,
      subcategory_name
    } = await request.json();

    if (!id || !pincode) {
      return NextResponse.json(
        { error: 'Both id and pincode are required for updates' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE websites SET
        website_name = ?,
        website_url = ?,
        logo_url = ?,
        is_featured = ?,
        status = ?,
        category_id = ?,
        category_name = ?,
        subcategory_id = ?,
        subcategory_name = ?
      WHERE id = ? AND pincode = ?`,
      [
        website_name,
        website_url,
        logo_url || null,
        is_featured !== undefined ? is_featured : false,
        status || 'active',
        category_id,
        category_name,
        subcategory_id,
        subcategory_name,
        id,
        pincode
      ]
    );

    return NextResponse.json(
      { message: 'Website updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating website:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to update website',
        details: errorMessage.includes('Duplicate entry') 
               ? 'Website conflicts with existing entry' 
               : errorMessage
      },
      { status: 500 }
    );
  }
}

// 4. DELETE WEBSITE (partition-aware deletion)
export async function DELETE(request: NextRequest) {
  try {
    const { id, pincode } = await request.json();

    if (!id || !pincode) {
      return NextResponse.json(
        { error: 'Both id and pincode are required for deletion' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM websites WHERE id = ? AND pincode = ?',
      [id, pincode]
    );

    return NextResponse.json(
      { message: 'Website deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting website:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to delete website',
        details: errorMessage.includes('foreign key constraint') 
               ? 'Website is referenced elsewhere' 
               : errorMessage
      },
      { status: 500 }
    );
  }
}