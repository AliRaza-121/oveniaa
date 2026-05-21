'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CartDrawer from '@/components/CartDrawer'
import { getCategoryEmoji } from '@/lib/utils'

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
      <nav
        className={`animate-nav-enter fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-500 rounded-2xl overflow-visible
          ${scrolled ? 'bg-bg/90 backdrop-blur-xl shadow-2xl shadow-black/30' : 'bg-bg/80 backdrop-blur-md'}`}
      >
        <div className="px-5 sm:px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <span className="logo-emoji text-2xl inline-block">🍕</span>
            <span className="text-xl sm:text-2xl font-bold text-primary font-display tracking-tight">Oveniaa</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {navLinks.map(link => (
              link.name === 'Menu' ? (
                <div key="Menu" className="relative group" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                  <Link href="/menu" className={`relative flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-500 overflow-hidden group/link ${pathname === '/menu' ? 'text-white shadow-lg' : 'text-text-light hover:text-white'}`}>
                    <span className="relative z-10 flex items-center gap-1">
                      Menu 
                      <span className="text-[10px] opacity-60 group-hover/link:opacity-100 group-hover/link:rotate-180 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">▼</span>
                    </span>
                    {pathname === '/menu' ? (
                      <span className="absolute inset-0 bg-primary rounded-full z-0" />
                    ) : (
                      <span className="absolute inset-0 bg-white/10 rounded-full scale-50 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                    )}
                  </Link>
                  <div className={`absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 py-5 px-5 w-[600px] max-w-[90vw] z-[100] transition-all duration-300 origin-top ${menuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                    <div className="flex justify-between items-center mb-4 px-2 border-b border-border/50 pb-3">
                      <span className="font-bold text-text-muted text-xs uppercase tracking-widest">Explore Categories</span>
                      <Link href="/menu" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 group/btn">
                        View All Menu <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categoriesList.map(cat => (
                        <Link key={cat._id} href={`/menu?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-text-light hover:text-white hover:bg-white/5 transition-all duration-300 group/cat">
                          <span className="text-xl bg-bg w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover/cat:scale-110 group-hover/cat:rotate-6 transition-all duration-300">{getCategoryEmoji(cat.name)}</span> 
                          <span className="truncate group-hover/cat:translate-x-1 transition-transform duration-300">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.name} href={link.href} className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-500 overflow-hidden group/link ${pathname === link.href ? 'text-white shadow-lg' : 'text-text-light hover:text-white'}`}>
                  <span className="relative z-10">{link.name}</span>
                  {pathname === link.href ? (
                    <span className="absolute inset-0 bg-primary rounded-full z-0" />
                  ) : (
                    <span className="absolute inset-0 bg-white/10 rounded-full scale-50 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                  )}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-light hover:text-white hover:bg-white/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">{cartCount}</span>}
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                {user.role === 'admin' && <Link href="/admin" className="text-sm font-semibold text-text-light hover:text-primary px-3 py-1.5">Admin</Link>}
                <Link href="/orders" className="text-sm font-semibold text-text-light hover:text-primary px-3 py-1.5">Orders</Link>
                <button onClick={logout} className="text-sm font-semibold text-text-light hover:text-primary px-3 py-1.5">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">Login</Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle mobile menu" className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-text"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-text"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-overlay ${mobileOpen ? 'mobile-overlay-open' : ''} fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-panel ${mobileOpen ? 'mobile-panel-open' : ''} fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-card rounded-2xl shadow-2xl lg:hidden overflow-hidden`}>
        <div className="flex flex-col py-3">
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
      </div>

      <CartDrawer isOpen={cartOpen} setIsOpen={setCartOpen} />
    </>
  )
}