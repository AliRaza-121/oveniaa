import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  isPopular: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  sizes: [{ type: String }],
  sizePrices: { type: Map, of: Number, default: {} },
  addOns: [{ name: String, price: Number }],
}, { timestamps: true })

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema)