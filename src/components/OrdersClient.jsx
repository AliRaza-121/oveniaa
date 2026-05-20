'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  preparing: 'bg-purple-500/10 text-purple-400',
  ready: 'bg-emerald-500/10 text-emerald-400',
  delivered: 'bg-green-500/10 text-green-400',
}

export default function OrdersClient({ orders }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { toast } = useToast()

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="text-2xl font-bold mt-4">Please login</h1>
        <Link href="/login" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-full font-semibold">Login</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-text-muted text-sm mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">📭</span>
            <p className="text-text-muted mt-4">No orders yet</p>
            <Link href="/menu" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-full font-semibold">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-text-muted">#{order._id.slice(-6).toUpperCase()} • {order.orderType}</p>
                    <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString('en-PK', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>{order.status}</span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                      <span className="text-text-light">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold">Total: <span className="text-primary">Rs. {order.total}</span></span>
                  <button
                    onClick={() => {
                      order.items.forEach((item, i) => {
                        setTimeout(() => {
                          addToCart(
                            { _id: item._id || Date.now(), name: item.name, price: item.price, category: 'Reorder', image: '', sizes: [], addOns: [] },
                            item.size || 'Regular',
                            item.addOns || [],
                            item.quantity
                          )
                        }, i * 100)
                      })
                      toast('Items added to cart!', 'success')
                    }}
                    className="text-xs bg-primary/10 text-primary px-4 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all"
                  >
                    🔄 Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}