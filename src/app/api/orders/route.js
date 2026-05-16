import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 })
    return Response.json({ success: true, orders }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    let userId = null
    if (token) { try { const d = jwt.verify(token, JWT_SECRET); userId = d.id } catch {} }
    const order = await Order.create({ ...body, user: userId })
    return Response.json({ success: true, order }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}