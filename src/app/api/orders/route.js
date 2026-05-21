import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const myOrders = searchParams.get('myOrders')

    if (myOrders) {
      const cookieStore = await cookies()
      const token = cookieStore.get('token')?.value
      if (!token) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      const decoded = jwt.verify(token, JWT_SECRET)
      const orders = await Order.find({ user: decoded.id }).sort({ createdAt: -1 })
      return Response.json({ success: true, orders }, { status: 200 })
    }

    await requireAdmin()
    const orders = await Order.find().sort({ createdAt: -1 })
    return Response.json({ success: true, orders }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 401 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return Response.json({ success: false, error: 'Please login to place an order' }, { status: 401 })
    
    let userId
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      userId = decoded.id
    } catch {
      return Response.json({ success: false, error: 'Session expired. Please login again' }, { status: 401 })
    }

    const body = await request.json()
    const { items, total, customerName, email, phone, address, orderType, notes } = body
    const order = await Order.create({ items, total, customerName, email, phone, address, orderType, notes, user: userId })
    
    return Response.json({ success: true, order }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}