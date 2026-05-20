import connectDB from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import { requireAdmin } from '@/lib/auth'

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const cat = searchParams.get('category')
    const search = searchParams.get('search')
    let q = {}
    if (cat && cat !== 'All') q.category = cat
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      q.name = { $regex: escapedSearch, $options: 'i' }
    }
    const items = await MenuItem.find(q).sort({ createdAt: -1 })
    return Response.json({ success: true, items })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    const item = await MenuItem.create(body)
    return Response.json({ success: true, item }, { status: 201 })
  } catch (e) {
    console.error('Create error:', e)
    return Response.json({ success: false, error: e.message }, { status: e.message === 'Forbidden' || e.message === 'Unauthorized' ? 401 : 500 })
  }
}