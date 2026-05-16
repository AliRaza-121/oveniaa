import connectDB from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import Category from '@/models/Category'
import Review from '@/models/Review'
import Deal from '@/models/Deal'
import HomeClient from '@/components/HomeClient'

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

    const reviews = await Review.find({}).lean()
    if (reviews.length > 0) {
      stats.avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    }

    const items = allItems.filter(i => i.isPopular)
    for (const item of items) {
      const itemReviews = reviews.filter(r => r.menuItem.toString() === item._id.toString())
      item.avgRating = itemReviews.length > 0 ? Math.round(itemReviews.reduce((s, r) => s + r.rating, 0) / itemReviews.length) : 0
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