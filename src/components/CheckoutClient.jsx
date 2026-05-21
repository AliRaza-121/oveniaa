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
  
  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, customerName: user.name || f.customerName, email: user.email || f.email }))
    }
  }, [user])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast('Please login to place an order', 'error'); router.push('/login'); return }
    if (cart.length === 0) { toast('Cart is empty', 'error'); return }
    if (!form.customerName || !form.phone) { toast('Name and phone required', 'error'); return }
    if (form.orderType === 'delivery' && !form.address) { toast('Address required for delivery', 'error'); return }

    const hasOnlyDrinks = cart.every(i => i.category === 'Drinks')
    if (form.orderType === 'delivery' && hasOnlyDrinks) { toast('Add a main item for delivery', 'error'); return }

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

  // Show loading spinner while auth state resolves
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-text-muted mt-4">Loading...</p>
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
          <div><label className="block text-sm font-semibold mb-2">Name *</label><input type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} required className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-semibold mb-2">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={!!user} className={`w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary ${user ? 'opacity-50' : ''}`} /></div>
          <div><label className="block text-sm font-semibold mb-2">Phone *</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" /></div>
          {form.orderType === 'delivery' && <div><label className="block text-sm font-semibold mb-2">Address *</label><input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" /></div>}
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