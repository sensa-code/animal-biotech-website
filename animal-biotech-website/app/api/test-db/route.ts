import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if supabaseAdmin exists
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'supabaseAdmin is null',
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        }
      })
    }

    // Test simple query to product_categories
    const { data: categories, error: catError } = await supabaseAdmin
      .from('product_categories')
      .select('*')

    if (catError) {
      return NextResponse.json({
        success: false,
        error: 'categories query failed',
        message: catError.message,
        details: catError
      })
    }

    // Test simple query to products
    const { data: products, error: prodError } = await supabaseAdmin
      .from('products')
      .select('*')

    if (prodError) {
      return NextResponse.json({
        success: false,
        error: 'products query failed',
        message: prodError.message,
        details: prodError
      })
    }

    return NextResponse.json({
      success: true,
      categoriesCount: categories?.length || 0,
      productsCount: products?.length || 0,
      categories: categories,
      products: products?.slice(0, 3) // Only first 3 for brevity
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'exception',
      message: error instanceof Error ? error.message : String(error)
    })
  }
}
