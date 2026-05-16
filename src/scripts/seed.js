import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌')

const { default: connectDB } = await import('../lib/db.js')
const { default: User } = await import('../models/User.js')
const { default: Category } = await import('../models/Category.js')
const { default: MenuItem } = await import('../models/MenuItem.js')

const categories = [
  { name: 'Burgers' },
  { name: 'Pizzas' },
  { name: 'Fries & Sides' },
  { name: 'Drinks' },
  { name: 'Wings' },
]

const menuItems = [
  { name: 'Classic Beef Burger', price: 350, category: 'Burgers', description: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce.', isPopular: true, addOns: [{ name: 'Extra Cheese', price: 50 }, { name: 'Bacon', price: 80 }] },
  { name: 'Zinger Burger', price: 380, category: 'Burgers', description: 'Crispy fried chicken fillet with spicy mayo and coleslaw.', isPopular: true, addOns: [{ name: 'Extra Cheese', price: 50 }, { name: 'Jalapenos', price: 30 }] },
  { name: 'Chicken Tikka Pizza', price: 750, category: 'Pizzas', description: 'Loaded with tikka chicken, bell peppers, and mozzarella.', isPopular: true, sizes: ['Small', 'Medium', 'Large', 'Extra Large'], sizePrices: { Small: 750, Medium: 950, Large: 1150, 'Extra Large': 1350 }, addOns: [{ name: 'Extra Cheese', price: 80 }] },
  { name: 'Supreme Pizza', price: 850, category: 'Pizzas', description: 'Beef pepperoni, chicken, mushrooms, olives, and capsicum.', isPopular: false, sizes: ['Small', 'Medium', 'Large', 'Extra Large'], sizePrices: { Small: 850, Medium: 1050, Large: 1250, 'Extra Large': 1450 }, addOns: [{ name: 'Extra Cheese', price: 80 }] },
  { name: 'Loaded Fries', price: 250, category: 'Fries & Sides', description: 'Crispy fries topped with cheese sauce and jalapenos.', isPopular: true, sizes: ['Regular', 'Large'], sizePrices: { Regular: 250, Large: 400 }, addOns: [{ name: 'Extra Cheese Sauce', price: 40 }] },
  { name: 'Chicken Wings', price: 550, category: 'Fries & Sides', description: 'Spicy buffalo wings with blue cheese dip.', isPopular: true, sizes: ['6 pcs', '12 pcs', '18 pcs'], sizePrices: { '6 pcs': 550, '12 pcs': 750, '18 pcs': 950 }, addOns: [{ name: 'Extra Dip', price: 30 }] },
  { name: 'Mango Shake', price: 200, category: 'Drinks', description: 'Thick creamy mango shake made with fresh mangoes.', isPopular: true, sizes: ['Small', 'Medium', 'Large'], sizePrices: { Small: 200, Medium: 260, Large: 320 }, addOns: [{ name: 'Ice Cream', price: 60 }] },
  { name: 'Fresh Lime', price: 100, category: 'Drinks', description: 'Tangy refreshing fresh lime soda.', isPopular: false, sizes: ['Small', 'Medium', 'Large'], sizePrices: { Small: 100, Medium: 140, Large: 180 } },
]

const users = [
  { name: 'Admin', email: 'admin@oveniaa.com', password: 'admin123', role: 'admin' },
  { name: 'Customer', email: 'customer@oveniaa.com', password: 'customer123', role: 'customer' },
]

async function seed() {
  try {
    await connectDB()
    await Category.deleteMany()
    await Category.insertMany(categories)
    console.log('✅ Categories seeded')
    await MenuItem.deleteMany()
    await MenuItem.insertMany(menuItems)
    console.log('✅ Menu items seeded')
    await User.deleteMany()
    for (const u of users) await User.create(u)
    console.log('✅ Users seeded')
    console.log('📧 Admin: admin@oveniaa.com / admin123')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()