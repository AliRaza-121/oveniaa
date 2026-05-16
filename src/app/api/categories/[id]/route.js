import connectDB from '@/lib/db'
import Category from '@/models/Category'

export async function PUT(req, { params }) {
  const { id } = await params; const body = await req.json()
  await connectDB(); const c = await Category.findByIdAndUpdate(id, body, { new: true })
  return Response.json({ success: true, category: c })
}
export async function DELETE(req, { params }) {
  const { id } = await params
  await connectDB(); await Category.findByIdAndDelete(id)
  return Response.json({ success: true })
}