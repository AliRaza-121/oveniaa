import connectDB from '@/lib/db'
import Category from '@/models/Category'

export async function GET() {
  try { await connectDB(); const cats = await Category.find(); return Response.json({ success: true, categories: cats }) }
  catch (e) { return Response.json({ success: false, error: e.message }, { status: 500 }) }
}