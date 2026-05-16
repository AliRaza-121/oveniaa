import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import OrdersClient from '@/components/OrdersClient'

export default async function Orders() {
  let orders = []
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      await connectDB()
      const docs = await Order.find({ user: decoded.id }).sort({ createdAt: -1 }).lean()
      orders = JSON.parse(JSON.stringify(docs))
    }
  } catch {}
  return <OrdersClient orders={orders} />
}