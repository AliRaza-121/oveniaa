import connectDB from '@/lib/db'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'All fields required' }, { status: 400 })
    }
    if (password.length < 6) {
      return Response.json({ success: false, error: 'Password must be 6+ characters' }, { status: 400 })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    await User.create({ name, email: email.toLowerCase(), password })
    return Response.json({ success: true, message: 'Account created. Please login.' }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}