import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) throw new Error('Unauthorized')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'admin') throw new Error('Forbidden')
  return decoded
}
