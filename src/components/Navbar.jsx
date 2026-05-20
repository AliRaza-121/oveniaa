'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CartDrawer from '@/components/CartDrawer'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesList, setCategoriesList] = useState([])
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => {
      if (d.success) setCategoriesList(d.categories.filter(c => c.status === 'active'))
    })
  }, [])

  useEffect(() => { if (mobileOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = '' }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 rounded-2xl
          ${scrolled ? 'bg-bg/90 backdrop-blur-xl shadow-2xl shadow-black/30' : 'bg-bg/80 backdrop-blur-md'}`}
      >
        <div className="px-5 sm:px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="text-2xl">🍕</motion.span>
            <span className="text-xl sm:text-2xl font-bold text-primary font-display tracking-tight">Oveniaa</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              link.name === 'Menu' ? (
                <div key="Menu" className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                  <Link href="/menu" className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 ${pathname === '/menu' ? 'text-white' : 'text-text-light hover:text-white'}`}>
                    <span className="relative z-10">Menu ▾</span>
                    {pathname === '/menu' && <motion.span layoutId="navPill" className="absolute inset-0 bg-primary rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                  </Link>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute top-full mt-2 left-0 bg-card border border-border rounded-2xl shadow-2xl py-2 min-w-[180px] z-50">
                        <Link href="/menu" className="block px-5 py-2.5 text-sm font-medium text-text-light hover:text-primary hover:bg-bg transition-colors">View All</Link>
                        <div className="h-px bg-border mx-4 my-1" />
                        {categoriesList.map(cat => (
                          <Link key={cat._id} href={`/menu?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-2 px-5 py-2.5 text-sm text-text-light hover:text-primary hover:bg-bg transition-colors">
                            {cat.name === 'Burgers' ? '🍔' : cat.name === 'Pizzas' ? '🍕' : cat.name === 'Fries & Sides' ? '🍟' : '🥤'} {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.name} href={link.href} className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 ${pathname === link.href ? 'text-white' : 'text-text-light hover:text-white'}`}>
                  <span className="relative z-10">{link.name}</span>
                  {pathname === link.href && <motion.span layoutId="navPill" className="absolute inset-0 bg-primary rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative text-text-light hover:text-primary transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                {user.role === 'admin' && <Link href="/admin" className="text-sm font-semibold text-text-light hover:text-primary px-3 py-1.5">Admin</Link>}
                <Link href="/orders" className="text-sm font-semibold text-text-light hover:text-primary px-3 py-1.5">Orders</Link>
                <button onClick={logout} className="text-sm font-semibold text-text-light hover:text-primary px-3 py-1.5">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-all hover:scale-105 shadow-md shadow-primary/20">Login</Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle mobile menu" className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5">
              <motion.span animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-text block rounded-full" />
              <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="w-5 h-0.5 bg-text block rounded-full" />
              <motion.span animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-text block rounded-full" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.3 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-card rounded-2xl shadow-2xl lg:hidden overflow-hidden">
  <div className="flex items-center justify-between px-6 pt-4 pb-2">
    <span className="text-sm font-semibold text-text-muted">Menu</span>
    <button onClick={() => setMobileOpen(false)} aria-label="Close mobile menu" className="w-8 h-8 flex items-center justify-center rounded-full bg-bg text-text-muted hover:text-text text-lg">✕</button>
  </div>
  <div className="flex flex-col py-2">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-6 py-3.5 text-lg font-semibold transition-colors ${pathname === link.href ? 'text-primary bg-primary/5' : 'text-text-light hover:text-primary hover:bg-bg'}`}>
                    <span>{link.name === 'Home' ? '🏠' : link.name === 'Menu' ? '🍕' : link.name === 'About' ? 'ℹ️' : '📞'}</span> {link.name}
                  </Link>
                ))}
                <div className="border-t border-border mt-2 pt-2 px-6">
                  {user ? (
                    <div className="space-y-1">
                      {user.role === 'admin' && <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-primary font-semibold"><span>📊</span> Admin</Link>}
                      <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-text-light font-semibold"><span>📦</span> My Orders</Link>
                      <button onClick={() => { logout(); setMobileOpen(false) }} className="flex items-center gap-3 py-3 text-red-500 font-semibold w-full"><span>🚪</span> Logout</button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center bg-primary text-white py-3 rounded-full font-semibold mt-2">Login</Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} setIsOpen={setCartOpen} />
    </>
  )
}