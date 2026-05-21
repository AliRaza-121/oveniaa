'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useRouter } from 'next/navigation'
import { getCategoryEmoji } from '@/lib/utils'

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = () => {
    if (!user) {
      toast('Please login to place an order', 'error')
      setIsOpen(false)
      router.push('/login')
      return
    }
    setIsOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? 'cart-backdrop-open' : ''} fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm`} onClick={() => setIsOpen(false)} />
      <div className={`cart-panel ${isOpen ? 'cart-panel-open' : ''} fixed right-0 top-0 bottom-0 z-[101] w-full sm:w-[420px] bg-card/90 backdrop-blur-2xl flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] border-l border-white/5`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold">Cart ({cartCount})</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close Cart" className="text-text-muted hover:text-text">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
              <span className="text-6xl animate-scroll-bounce">🛒</span>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-card rounded-full flex items-center justify-center text-xl shadow-lg border border-border">✨</div>
            </div>
            <h3 className="text-xl font-bold mb-2">Your cart is feeling light</h3>
            <p className="text-text-muted mb-8 max-w-[250px]">Explore our menu and add some hot & fresh food to your order!</p>
            <button onClick={() => setIsOpen(false)} className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-primary/30">
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.map(item => (
                <div key={item.key} className="flex gap-3 pb-4 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 relative overflow-hidden">
                    {item.image ? (
                      <Image 
                        src={item.image.replace('/upload/', '/upload/w_150,h_150,c_fill,g_auto,f_auto,q_auto/')} 
                        alt={item.name}
                        fill
                        className="object-cover" 
                      />
                    ) : (
                      <span>{getCategoryEmoji(item.category)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                    <p className="text-xs text-text-muted">{item.size}</p>
                    {item.addOns?.length > 0 && <p className="text-xs text-text-muted">+ {item.addOns.map(a => a.name).join(', ')}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-full">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity" className="w-7 h-7 flex items-center justify-center text-xs hover:text-primary">−</button>
                        <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity" className="w-7 h-7 flex items-center justify-center text-xs hover:text-primary">+</button>
                      </div>
                      <p className="text-sm font-bold text-primary">Rs. {item.price * item.quantity}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.key)} aria-label="Remove item" className="text-text-muted hover:text-red-500 flex-shrink-0">✕</button>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-5 py-4 bg-bg/30">
              {/* Cross-selling Suggestion */}
              {cart.length > 0 && !cart.some(i => i.category === 'Drinks') && (
                <div className="mb-4 bg-card border border-border rounded-2xl p-3 flex items-center gap-3 shadow-lg">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🥤</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text">Thirsty?</p>
                    <p className="text-[10px] text-text-muted">Add a cold drink</p>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart({ _id: 'drink-add', name: 'Cold Drink 500ml', price: 150, category: 'Drinks', image: '', sizes: [], addOns: [] }, 'Regular', [], 1);
                      toast('Drink added!', 'success');
                    }}
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                  >
                    + Rs. 150
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-primary">Rs. {cartTotal}</span>
              </div>
              {/* Delivery Warning */}
              {cart.length > 0 && cart.every(i => i.category === 'Drinks') && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-3 text-xs text-yellow-400">
                  ⚠️ Drinks alone cannot be delivered. Please add a main item (Burger, Pizza, Wings, or Fries).
                </div>
              )}
              {!user && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-3 text-xs text-primary">
                  🔒 You need to login before placing an order.
                </div>
              )}
              <button onClick={handleCheckout} className="block w-full bg-primary text-white text-center py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
                {user ? 'Checkout' : 'Login to Checkout'}
              </button>
              <button onClick={() => setIsOpen(false)} className="w-full text-center text-sm text-text-muted mt-3 hover:text-primary transition-colors">Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}