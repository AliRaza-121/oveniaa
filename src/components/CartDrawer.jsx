'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-[100] bg-black/50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3 }} className="fixed right-0 top-0 bottom-0 z-[101] w-full sm:w-[420px] bg-card flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-bold">Cart ({cartCount})</h2>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-5xl">🛒</span>
                <p className="text-text-muted mt-4">Your cart is empty</p>
                <button onClick={() => setIsOpen(false)} className="text-primary font-medium mt-2 hover:underline">Continue Shopping</button>
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
  <span>{item.category === 'Burgers' ? '🍔' : item.category === 'Pizzas' ? '🍕' : item.category === 'Fries & Sides' ? '🍟' : '🥤'}</span>
)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                        <p className="text-xs text-text-muted">{item.size}</p>
                        {item.addOns?.length > 0 && <p className="text-xs text-text-muted">+ {item.addOns.map(a => a.name).join(', ')}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-full">
                            <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-xs hover:text-primary">−</button>
                            <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-xs hover:text-primary">+</button>
                          </div>
                          <p className="text-sm font-bold text-primary">Rs. {item.price * item.quantity}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.key)} className="text-text-muted hover:text-red-500 flex-shrink-0">✕</button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-5 py-4">
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
                  <Link href="/checkout" onClick={() => setIsOpen(false)} className="block w-full bg-primary text-white text-center py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">Checkout</Link>
                  <button onClick={() => setIsOpen(false)} className="w-full text-center text-sm text-text-muted mt-3 hover:text-primary transition-colors">Continue Shopping</button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}