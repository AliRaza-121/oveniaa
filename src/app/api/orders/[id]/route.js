import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { sendOrderStatusEmail } from '@/lib/email'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    await connectDB()
    const { id } = await params
    const { status } = await request.json()

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) return Response.json({ success: false, error: 'Order not found' }, { status: 404 })

    if (order.email && status) {
      try {
        await sendOrderStatusEmail(order.email, order._id.toString(), order.customerName, status)
      } catch (e) { console.error('Email failed:', e) }
    }

    return Response.json({ success: true, order }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}