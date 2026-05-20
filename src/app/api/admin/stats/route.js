import connectDB from '@/lib/db'
import Order from '@/models/Order'
import MenuItem from '@/models/MenuItem'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    await connectDB()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      totalOrdersAgg,
      todayOrdersAgg,
      pendingCount,
      monthlyAgg,
      popularItemAgg,
      menuCount,
      unavailableItems,
      categoriesCount
    ] = await Promise.all([
      Order.aggregate([
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$total" }
          }
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: { $subtract: ["$_id.month", 1] },
            orders: 1,
            revenue: 1
          }
        },
        { $sort: { year: 1, month: 1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.name", count: { $sum: "$items.quantity" } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),
      MenuItem.countDocuments(),
      MenuItem.find({ isAvailable: false }, 'name'),
      Category.countDocuments()
    ])

    const totalOrders = totalOrdersAgg[0] || { count: 0, revenue: 0 }
    const todayOrders = todayOrdersAgg[0] || { count: 0, revenue: 0 }
    const popularItem = popularItemAgg[0] ? { name: popularItemAgg[0]._id, count: popularItemAgg[0].count } : null

    return Response.json({
      success: true,
      stats: {
        orders: totalOrders.count,
        revenue: totalOrders.revenue,
        todayOrders: todayOrders.count,
        todayRevenue: todayOrders.revenue,
        pending: pendingCount,
        menu: menuCount,
        categories: categoriesCount,
      },
      monthlyData: monthlyAgg,
      popularItem,
      unavailableItems
    }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
