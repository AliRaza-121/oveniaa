import connectDB from '@/lib/db'
import Deal from '@/models/Deal'

export async function GET() {
  try {
    await connectDB()
    const deals = await Deal.find().populate('items').sort({ createdAt: -1 })
    return Response.json({ success: true, deals }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const deal = await Deal.create(body)
    return Response.json({ success: true, deal }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}