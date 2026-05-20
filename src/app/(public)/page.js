import connectDB from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import Category from '@/models/Category'
import Review from '@/models/Review'
import Deal from '@/models/Deal'
import HomeClient from '@/components/HomeClient'

export const metadata = {
  title: 'Oveniaa - Hot & Fresh Food Delivery in Faisalabad',
  description: 'Order the best pizzas, burgers, fries, and deals in Faisalabad. Fast delivery in 30 minutes. Hot, fresh, and delicious!',
}

export default async function Home() {
  let popularItems = []
  let categories = []
  let deals = []
  let stats = { menuCount: 0, avgRating: '4.8', deliveryTime: '30 min' }

  try {
    await connectDB()
    categories = await Category.find({ status: 'active' }).lean()
    
    const allItems = await MenuItem.find({ isAvailable: true }).lean()
    stats.menuCount = allItems.length

    const reviewStats = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ])
    if (reviewStats.length > 0) stats.avgRating = reviewStats[0].avgRating.toFixed(1)

    const itemRatings = await Review.aggregate([
      { $group: { _id: '$menuItem', avgRating: { $avg: '$rating' } } }
    ])

    const items = allItems.filter(i => i.isPopular)
    for (const item of items) {
      const ratingObj = itemRatings.find(r => r._id && r._id.toString() === item._id.toString())
      item.avgRating = ratingObj ? Math.round(ratingObj.avgRating) : 0
    }

    popularItems = JSON.parse(JSON.stringify(items))
    categories = JSON.parse(JSON.stringify(categories))
    
    const dealsData = await Deal.find({ isActive: true }).populate('items').sort({ createdAt: -1 }).lean()
    deals = JSON.parse(JSON.stringify(dealsData))
  } catch (e) {
    console.error('Homepage error:', e)
  }

  return <HomeClient popularItems={popularItems} categories={categories} deals={deals} stats={stats} />
}