import connectDB from '@/lib/db'
import Deal from '@/models/Deal'

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const deal = await Deal.findByIdAndUpdate(id, body, { new: true })
    return Response.json({ success: true, deal }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    await Deal.findByIdAndDelete(id)
    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}