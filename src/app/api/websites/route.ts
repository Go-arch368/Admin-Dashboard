import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Adjust the path as needed for your query utility

// GET: Fetch all websites
export async function GET() {
  try {
    const results = await query('SELECT * FROM website');
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}

// POST: Create a new website
export async function POST(request: NextRequest) {
  try {
    const {
      website_id, website_name, website_url, logo_url, is_featured, status,
      category_id, category_name, category_slug, subcategory_id, subcategory_name, subcategory_slug,
      pincode, city, state 
    } = await request.json();

    await query(
      'INSERT INTO website (website_id, website_name, website_url, logo_url, is_featured, status, category_id, category_name, category_slug, subcategory_id, subcategory_name, subcategory_slug, pincode, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        website_id, website_name, website_url, logo_url, is_featured, status,
        category_id, category_name, category_slug, subcategory_id, subcategory_name, subcategory_slug,
        pincode, city, state
      ]
    );
    return NextResponse.json({ message: 'Website created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating website:', error);
    return NextResponse.json({ error: 'Failed to create website' }, { status: 500 });
  }
}

// PUT: Update an existing website
export async function PUT(request: NextRequest) {
  try {
    const {
      id, website_id, website_name, website_url, logo_url, is_featured, status,
      category_id, category_name, category_slug, subcategory_id, subcategory_name, subcategory_slug,
      pincode, city, state 
    } = await request.json();

    await query(
      'UPDATE website SET website_id = ?, website_name = ?, website_url = ?, logo_url = ?, is_featured = ?, status = ?, category_id = ?, category_name = ?, category_slug = ?, subcategory_id = ?, subcategory_name = ?, subcategory_slug = ?, pincode = ?, city = ?, state = ? WHERE id = ?',
      [
        website_id, website_name, website_url, logo_url, is_featured, status,
        category_id, category_name, category_slug, subcategory_id, subcategory_name, subcategory_slug,
        pincode, city, state, id
      ]
    );
    return NextResponse.json({ message: 'Website updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
  }
}

// DELETE: Delete a website
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await query('DELETE FROM website WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Website deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting website:', error);
    return NextResponse.json({ error: 'Failed to delete website' }, { status: 500 });
  }
}
