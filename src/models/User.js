import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
  lastLogin: { type: Date, default: null },
  provider: { type: String, enum: ['local', 'google', 'both'], default: 'local' },
  googleId: { type: String, default: null },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model('User', userSchema)