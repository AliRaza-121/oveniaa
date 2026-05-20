import connectDB from '@/lib/db'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try { await connectDB(); const cats = await Category.find(); return Response.json({ success: true, categories: cats }) }
  catch (e) { return Response.json({ success: false, error: e.message }, { status: 500 }) }
}

export async function POST(req) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    const category = await Category.create(body)
    return Response.json({ success: true, category }, { status: 201 })
  } catch (e) {
    console.error('Create category error:', e)
    return Response.json({ success: false, error: e.message }, { status: e.message === 'Forbidden' || e.message === 'Unauthorized' ? 401 : 500 })
  }
}