import mongoose from 'mongoose'

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  discount: { type: String, default: '' },
  price: { type: Number, default: 0 },
  originalPrice: { type: Number, default: 0 },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  isActive: { type: Boolean, default: true },
  backgroundColor: { type: String, default: 'from-primary/20 to-secondary/10' },
  expiresAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.models.Deal || mongoose.model('Deal', dealSchema)