'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('oveniaa-cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('oveniaa-cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0)
  const cartTotal = cart.reduce((t, i) => t + (i.price * i.quantity), 0)

  const addToCart = (product, size, addOns = [], quantity = 1) => {
    const key = `${product._id}-${size}-${JSON.stringify(addOns)}`
    setCart(prev => {
      const exists = prev.find(i => i.key === key)
      if (exists) return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { ...product, key, size, addOns, quantity }]
    })
  }

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key))
  const updateQuantity = (key, qty) => {
    if (qty <= 0) { removeFromCart(key); return }
    setCart(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i))
  }
  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be inside CartProvider')
  return context
}