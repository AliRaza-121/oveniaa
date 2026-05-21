'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function CheckoutClient() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    orderType: 'delivery',
    notes: '',
  })
  
  const [storeOpen, setStoreOpen] = useState(true)
  const [checkingStore, setCheckingStore] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=storeOpen')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.value === false) setStoreOpen(false)
        setCheckingStore(false)
      })
      .catch(() => setCheckingStore(false))
  }, [])

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, customerName: user.name || f.customerName, email: user.email || f.email }))
    }
  }, [user])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast('Please login to place an order', 'error'); router.push('/login'); return }
    if (cart.length === 0) { toast('Cart is empty', 'error'); return }

    const newErrors = {}
    if (!form.customerName) newErrors.customerName = 'Name is required'
    if (!form.phone || form.phone.length < 10) newErrors.phone = 'Valid phone number required'
    if (form.orderType === 'delivery' && !form.address) newErrors.address = 'Address required for delivery'

    const hasOnlyDrinks = cart.every(i => i.category === 'Drinks')
    if (form.orderType === 'delivery' && hasOnlyDrinks) { 
      toast('Add a main item for delivery', 'error'); 
      return 
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Remove generic toasts if we have specific inline errors
      return
    }
    
    setErrors({})

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, size: i.size, addOns: i.addOns })),
          total: cartTotal,
          ...form,
        }),
      })
      const data = await res.json()
      if (data.success) { clearCart(); toast('Order placed! 🎉', 'success'); router.push('/orders') }
      else if (res.status === 401) { toast(data.error || 'Please login to order', 'error'); router.push('/login') }
      else toast(data.error || 'Error', 'error')
    } catch { toast('Network error', 'error') } finally { setSubmitting(false) }
  }

  // Show loading spinner while auth state or store state resolves
  if (loading || checkingStore) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="h-8 bg-card rounded-md w-48 mb-8 animate-pulse" />
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-card rounded w-24 mb-2" />
                <div className="h-12 bg-card border border-border rounded-xl w-full" />
              </div>
            ))}
            <div className="h-40 bg-card rounded-2xl w-full animate-pulse mt-8" />
            <div className="h-14 bg-card rounded-full w-full animate-pulse mt-4" />
          </div>
        </div>
      </div>
    )
  }

  // Gate: Store Closed
  if (!storeOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <span className="text-5xl">🛑</span>
          <h1 className="text-2xl font-bold mt-4">Store is currently closed</h1>
          <p className="text-text-muted mt-2">We are not accepting orders at this moment. Please check back later!</p>
          <Link href="/menu" className="inline-block mt-6 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">Back to Menu</Link>
        </div>
      </div>
    )
  }

  // Gate: redirect unauthenticated users to login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <span className="text-5xl">🔒</span>
          <h1 className="text-2xl font-bold mt-4">Login Required</h1>
          <p className="text-text-muted mt-2">You need to be logged in to place an order. Your cart items will be saved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">Login</Link>
            <Link href="/register" className="inline-block bg-card border border-border text-text px-8 py-3 rounded-full font-semibold hover:border-primary transition-colors">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="text-5xl">🛒</span>
          <h1 className="text-2xl font-bold mt-4">Cart is empty</h1>
          <Link href="/menu" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-full font-semibold">Browse Menu</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Order Type</label>
            <div className="flex gap-2">
              {['delivery', 'takeaway', 'dine-in'].map(t => (
                <button key={t} type="button" onClick={() => setForm({...form, orderType: t})}
                  className={`px-5 py-2 rounded-full text-sm font-semibold capitalize border transition-all ${form.orderType === t ? 'bg-primary text-white border-primary' : 'bg-card text-text-light border-border hover:border-primary'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div><label className="block text-sm font-semibold mb-2">Name *</label><input type="text" value={form.customerName} onChange={e => {setForm({...form, customerName: e.target.value}); setErrors({...errors, customerName: null})}} className={`w-full bg-card border rounded-xl px-4 py-3 text-sm text-text focus:outline-none transition-colors ${errors.customerName ? 'border-red-500 focus:border-red-500 bg-red-500/5' : 'border-border focus:border-primary'}`} />{errors.customerName && <p className="text-red-500 text-xs mt-1.5">{errors.customerName}</p>}</div>
          <div><label className="block text-sm font-semibold mb-2">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={!!user} className={`w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary ${user ? 'opacity-50' : ''}`} /></div>
          <div><label className="block text-sm font-semibold mb-2">Phone *</label><input type="tel" value={form.phone} onChange={e => {setForm({...form, phone: e.target.value}); setErrors({...errors, phone: null})}} className={`w-full bg-card border rounded-xl px-4 py-3 text-sm text-text focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500 bg-red-500/5' : 'border-border focus:border-primary'}`} />{errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}</div>
          {form.orderType === 'delivery' && <div><label className="block text-sm font-semibold mb-2">Address *</label><input type="text" value={form.address} onChange={e => {setForm({...form, address: e.target.value}); setErrors({...errors, address: null})}} className={`w-full bg-card border rounded-xl px-4 py-3 text-sm text-text focus:outline-none transition-colors ${errors.address ? 'border-red-500 focus:border-red-500 bg-red-500/5' : 'border-border focus:border-primary'}`} />{errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}</div>}
          <div><label className="block text-sm font-semibold mb-2">Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary resize-none" /></div>
          
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            {cart.map(i => (
              <div key={i.key} className="flex justify-between text-sm py-1"><span className="text-text-light">{i.quantity}x {i.name}</span><span>Rs. {i.price * i.quantity}</span></div>
            ))}
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold"><span>Total</span><span className="text-primary text-lg">Rs. {cartTotal}</span></div>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-3.5 rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
            {submitting ? 'Placing...' : `Place Order — Rs. ${cartTotal}`}
          </button>
        </form>
      </div>
    </div>
  )
}