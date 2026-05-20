import connectDB from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import Category from '@/models/Category'
import MenuClient from '@/components/MenuClient'

export const metadata = {
  title: 'Our Menu - Oveniaa | Pizzas, Burgers & More',
  description: 'Explore Oveniaa\'s menu featuring hot pizzas, juicy burgers, crispy fries, and refreshing drinks. Order online for quick delivery in Faisalabad.',
}

export default async function Menu({ searchParams }) {
  const params = await searchParams
  const category = params?.category || 'All'
  const search = params?.search || ''

  let items = []
  let categories = []

  try {
    await connectDB()
    categories = await Category.find({ status: 'active' }).lean()
    let query = {}
    if (category !== 'All') query.category = category
    if (search) query.name = { $regex: search, $options: 'i' }
    items = await MenuItem.find(query).sort({ createdAt: -1 }).lean()
  } catch {}

  return (
    <MenuClient
      items={JSON.parse(JSON.stringify(items))}
      categories={JSON.parse(JSON.stringify(categories))}
      activeCategory={category}
      searchTerm={search}
    />
  )
}