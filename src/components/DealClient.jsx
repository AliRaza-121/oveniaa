'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

export default function DealClient({ deal }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [added, setAdded] = useState(false)

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="text-5xl">⚡</span>
          <p className="text-text-muted mt-4 text-lg">Deal not found or expired</p>
          <Link href="/" className="inline-block mt-4 text-primary font-medium hover:underline">Back to Home</Link>
        </div>
      </div>
    )
  }

  const handleAddAllToCart = () => {
    if (!deal.items || deal.items.length === 0) return
    addToCart(
      { _id: deal._id, name: deal.title, price: deal.price, category: 'Deal', image: deal.image || '', description: deal.description || '', sizes: ['Deal'], addOns: [], dealItems: deal.items },
      'Deal', [], 1
    )
    setAdded(true)
    toast('Deal added to cart! 🎉', 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  const totalOriginal = deal.items?.reduce((sum, item) => sum + (item.price || 0), 0) || 0

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-block">← Back to Home</Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-gradient-to-br ${deal.backgroundColor || 'from-primary/20 to-secondary/10'} border border-border rounded-3xl p-8 sm:p-10 mb-8`}>
          <div className="text-center mb-8">
            <span className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">⚡ LIMITED TIME DEAL</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display">{deal.title}</h1>
            {deal.description && <p className="text-text-muted mt-3">{deal.description}</p>}
          </div>
          <div className="flex items-center justify-center gap-4 mb-8">
            {deal.price > 0 && <span className="text-4xl font-black text-primary">Rs. {deal.price}</span>}
            {deal.originalPrice > 0 && <span className="text-xl text-text-muted line-through">Rs. {deal.originalPrice}</span>}
            {deal.discount && <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">{deal.discount}</span>}
          </div>
          <div className="text-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddAllToCart} disabled={added} className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/30 disabled:opacity-50">
              {added ? 'Added! ✓' : 'Add Deal to Cart'}
            </motion.button>
          </div>
        </motion.div>

        {deal.items?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold font-display mb-4">What is Included</h2>
            <div className="space-y-3">
              {deal.items.map((item) => (
                <div key={item._id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-xl" /> : <span>{item.category === 'Burgers' ? '🍔' : item.category === 'Pizzas' ? '🍕' : item.category === 'Fries & Sides' ? '🍟' : '🥤'}</span>}
                  </div>
                  <div className="flex-1"><h3 className="font-semibold text-text">{item.name}</h3><p className="text-sm text-text-muted">{item.description?.slice(0, 60)}...</p></div>
                  <div className="text-right"><p className="font-bold text-primary">Rs. {item.price}</p></div>
                </div>
              ))}
            </div>
            {deal.price > 0 && totalOriginal > deal.price && (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                <p className="text-emerald-400 font-bold">🎉 You save Rs. {totalOriginal - deal.price}!</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/checkout" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl">Go to Checkout <span>→</span></Link>
        </div>
      </div>
    </div>
  )
}