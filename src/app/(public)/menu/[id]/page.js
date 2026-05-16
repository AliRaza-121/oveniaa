import connectDB from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import Review from '@/models/Review'
import ItemDetailClient from '@/components/ItemDetailClient'

export default async function ItemDetail({ params }) {
  const { id } = await params
  let item = null
  let reviews = []

  try {
    await connectDB()
    const itemDoc = await MenuItem.findById(id).lean()
    if (itemDoc) {
      item = JSON.parse(JSON.stringify(itemDoc))
      const reviewDocs = await Review.find({ menuItem: id }).populate('user', 'name').sort({ createdAt: -1 }).lean()
      reviews = JSON.parse(JSON.stringify(reviewDocs))
    }
  } catch {}

  return <ItemDetailClient item={item} reviews={reviews} />
}