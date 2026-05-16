'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Menu Items', href: '/admin/menu', icon: '🍕' },
  { name: 'Categories', href: '/admin/categories', icon: '📂' },
  { name: 'Orders', href: '/admin/orders', icon: '🛒' },
  { name: 'Deals', href: '/admin/deals', icon: '⚡' },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><span className="text-5xl">🔒</span><p className="text-text-muted mt-4">Access denied</p><Link href="/" className="text-primary mt-2 inline-block hover:underline">Go Home</Link></div></div>
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    router.push(`/admin/orders?search=${encodeURIComponent(searchTerm.trim())}`)
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      <motion.aside animate={{ width: collapsed ? 72 : 240 }} className={`bg-card border-r border-border flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-hidden md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && <Link href="/admin" className="font-bold text-primary font-display text-lg">Oveniaa</Link>}
          <button onClick={() => { if (window.innerWidth < 768) setMobileOpen(!mobileOpen); else setCollapsed(!collapsed) }} className="text-text-muted hover:text-text">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? "M8.25 4.5l7.5 7.5-7.5 7.5" : "M15.75 19.5 8.25 12l7.5-7.5"} />
            </svg>
          </button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {sidebarLinks.map(link => (
            <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-bg hover:text-text'}`}>
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </motion.aside>

      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'md:ml-[72px]' : 'md:ml-[240px]'} ml-0`}>
        <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 gap-3">
          <button onClick={() => { if (window.innerWidth < 768) setMobileOpen(!mobileOpen); else setCollapsed(!collapsed) }} className="md:hidden text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders by name, phone, or ID..."
              className="w-full bg-bg border border-border rounded-full px-4 py-1.5 text-xs text-text focus:outline-none focus:border-primary"
            />
          </form>

          <Link href="/" className="text-xs font-semibold text-text-muted hover:text-primary border border-border rounded-full px-4 py-1.5 transition-colors whitespace-nowrap">🏬 View Store</Link>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  )
}