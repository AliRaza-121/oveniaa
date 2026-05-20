'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function PublicLayout({ children }) {
  const pathname = usePathname()
  const hideLayout = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password'

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
      <BackToTop />
    </>
  )
}