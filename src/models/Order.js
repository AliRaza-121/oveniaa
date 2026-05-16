import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ name: String, price: Number, quantity: Number, size: String, addOns: [{ name: String, price: Number }] }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'], default: 'pending' },
  orderType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], default: 'delivery' },
  customerName: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', orderSchema)