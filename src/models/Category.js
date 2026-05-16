import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model('Category', categorySchema)