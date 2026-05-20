import connectDB from '@/lib/db'
import Contact from '@/models/Contact'

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, email, message } = body
    if (!name || !email || !message) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }
    await Contact.create({ name, email, message })
    return Response.json({ success: true, message: 'Message sent successfully' }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}