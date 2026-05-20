import connectDB from '@/lib/db'
import Deal from '@/models/Deal'
import DealClient from '@/components/DealClient'

export default async function DealPage({ params }) {
  const { id } = await params
  let deal = null

  try {
    await connectDB()
    const dealDoc = await Deal.findById(id).populate('items').lean()
    if (dealDoc) deal = JSON.parse(JSON.stringify(dealDoc))
  } catch (e) {
    console.error('Deal page error:', e)
  }

  return <DealClient deal={deal} />
}