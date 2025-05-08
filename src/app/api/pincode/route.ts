import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 1. GET ALL PINCODES (with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const is_active = searchParams.get('is_active');
    const region = searchParams.get('region');

    let sql = 'SELECT * FROM pincodes WHERE 1=1';
    const params = [];

    if (state) {
      sql += ' AND state = ?';
      params.push(state);
    }
    if (city) {
      sql += ' AND city = ?';
      params.push(city);
    }
    if (is_active) {
      sql += ' AND is_active = ?';
      params.push(is_active === 'true');
    }
    if (region) {
      sql += ' AND region = ?';
      params.push(region);
    }

    sql += ' ORDER BY pincode ASC';
    
    const results = await query(sql, params);
    return NextResponse.json(results, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching pincodes:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch pincodes', details: errorMessage },
      { status: 500 }
    );
  }
}

// 2. CREATE NEW PINCODE
export async function POST(request: NextRequest) {
  try {
    const { 
      pincode,
      city,
      state,
      country = 'India',
      region,
      latitude,
      longitude,
      is_active = true
    } = await request.json();

    // Validate required fields
    if (!pincode || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields (pincode, city, state)' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO pincodes (
        pincode,
        city,
        state,
        country,
        region,
        latitude,
        longitude,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pincode,
        city,
        state,
        country,
        region || null,
        latitude || null,
        longitude || null,
        is_active
      ]
    );

    return NextResponse.json(
      { message: 'Pincode created successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating pincode:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to create pincode',
        details: errorMessage.includes('Duplicate entry') 
               ? 'Pincode already exists' 
               : errorMessage
      },
      { status: 500 }
    );
  }
}

// 3. UPDATE PINCODE
export async function PUT(request: NextRequest) {
  try {
    const {
      pincode_id,
      pincode,
      city,
      state,
      country,
      region,
      latitude,
      longitude,
      is_active
    } = await request.json();

    if (!pincode_id) {
      return NextResponse.json(
        { error: 'pincode_id is required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE pincodes SET
        pincode = ?,
        city = ?,
        state = ?,
        country = ?,
        region = ?,
        latitude = ?,
        longitude = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE pincode_id = ?`,
      [
        pincode,
        city,
        state,
        country || 'India',
        region || null,
        latitude || null,
        longitude || null,
        is_active !== undefined ? is_active : true,
        pincode_id
      ]
    );

    return NextResponse.json(
      { message: 'Pincode updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating pincode:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to update pincode',
        details: errorMessage.includes('Duplicate entry') 
               ? 'Pincode already exists' 
               : errorMessage
      },
      { status: 500 }
    );
  }
}

// 4. DELETE PINCODE
export async function DELETE(request: NextRequest) {
  try {
    const { pincode_id } = await request.json();

    if (!pincode_id) {
      return NextResponse.json(
        { error: 'pincode_id is required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM pincodes WHERE pincode_id = ?',
      [pincode_id]
    );

    return NextResponse.json(
      { message: 'Pincode deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting pincode:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to delete pincode',
        details: errorMessage.includes('foreign key constraint') 
               ? 'Cannot delete: Pincode is in use' 
               : errorMessage
      },
      { status: 500 }
    );
  }
}