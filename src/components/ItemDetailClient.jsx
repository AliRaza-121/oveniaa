'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function ItemDetailClient({ item, reviews: initialReviews }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [reviews, setReviews] = useState(initialReviews)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => { setSelectedSize(null); setSelectedAddOns([]) }, [item?._id])

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-text-muted text-lg">Item not found</p>
          <Link href="/menu" className="text-primary font-medium mt-4 inline-block hover:underline">← Back to Menu</Link>
        </div>
      </div>
    )
  }

  const toggleAddOn = (addon) => {
    setSelectedAddOns(prev =>
      prev.find(a => a.name === addon.name)
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    )
  }

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0)
  const sizePrice = selectedSize && item.sizePrices?.[selectedSize] ? item.sizePrices[selectedSize] : item.price
  const totalPrice = sizePrice + addOnsTotal

  const handleAddToCart = () => {
    if (item.sizes?.length > 0 && !selectedSize) {
      toast('Please select a size', 'error')
      return
    }
    const size = selectedSize || item.sizes?.[0] || 'Regular'
    addToCart({ ...item, price: sizePrice }, size, selectedAddOns)
    toast('Added to cart!', 'success')
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast('Please login to review', 'error'); return }
    if (!comment.trim()) { toast('Please write a review', 'error'); return }
    if (rating === 0) { toast('Please select a rating', 'error'); return }

    setSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItem: item._id, rating, comment }),
      })
      const data = await res.json()
      if (data.success) {
        setReviews(prev => {
          const filtered = prev.filter(r => r._id !== data.review._id)
          return [data.review, ...filtered]
        })
        setComment('')
        setRating(0)
        toast('Review submitted!', 'success')
      } else {
        toast(data.error, 'error')
      }
    } catch { toast('Network error', 'error') } finally { setSubmittingReview(false) }
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <Link href="/menu" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors mb-6 border border-border rounded-full px-4 py-1.5">← Back to Menu</Link>

        <div className="grid md:grid-cols-2 gap-10">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-primary/10 rounded-3xl aspect-square w-full flex items-center justify-center text-8xl overflow-hidden relative">
            {item.image ? (
  <Image 
    src={item.image.replace('/upload/', '/upload/w_800,h_800,c_fill,g_auto,f_auto,q_auto/')} 
    alt={item.name}
    fill
    className="object-cover" 
  />
) : (
  <span>{item.category === 'Burgers' ? '🍔' : item.category === 'Pizzas' ? '🍕' : item.category === 'Fries & Sides' ? '🍟' : '🥤'}</span>
)}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-primary text-sm font-bold uppercase tracking-widest">{item.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">{item.name}</h1>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
              <span className="text-sm text-text-muted">({reviews.length} reviews)</span>
            </div>

            <p className="text-text-muted mt-4 leading-relaxed">{item.description}</p>

            {item.sizes?.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-bold text-text mb-2">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {item.sizes.map(size => {
                    const price = item.sizePrices?.[size] || item.price
                    return (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-card text-text-light border-border hover:border-primary'}`}>
                        {size} - Rs. {price}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {item.addOns?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold text-text mb-2">Add-ons</p>
                <div className="flex gap-2 flex-wrap">
                  {item.addOns.map(addon => (
                    <button key={addon.name} onClick={() => toggleAddOn(addon)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedAddOns.find(a => a.name === addon.name) ? 'bg-primary text-white border-primary' : 'bg-card text-text-light border-border hover:border-primary'}`}>
                      {addon.name} (+Rs. {addon.price})
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-8 flex items-center gap-4 lg:relative">
  {/* Desktop button */}
  <div className="hidden lg:flex items-center gap-4">
    <span className="text-3xl font-bold text-primary">Rs. {totalPrice}</span>
    <button onClick={handleAddToCart} disabled={!item.isAvailable} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30">
      {item.isAvailable ? 'Add to Cart' : 'Sold Out'}
    </button>
  </div>
</div>

{/* Mobile sticky button */}
<div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-50 flex items-center gap-3">
  <span className="text-xl font-bold text-primary">Rs. {totalPrice}</span>
  <button onClick={handleAddToCart} disabled={!item.isAvailable} className="flex-1 bg-primary text-white py-3 rounded-full font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed">
    {item.isAvailable ? 'Add to Cart' : 'Sold Out'}
  </button>
</div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-text mb-3">Write a Review</h3>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl select-none transition-all hover:scale-125 ${star <= rating ? 'text-yellow-500' : 'text-text-muted hover:text-yellow-400'}`}>
                  {star <= rating ? '★' : '☆'}
                </span>
              ))}
              <span className="text-sm text-text-muted ml-2">{rating > 0 ? `${rating}/5` : 'Rate'}</span>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts..." rows={3}
                className="w-full bg-bg border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary resize-none text-text" />
              <button type="submit" disabled={submittingReview}
                className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-text text-sm">{review.user?.name || 'Anonymous'}</p>
                    <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className="text-text-muted text-sm mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  )
}