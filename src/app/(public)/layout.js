'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('@/components/Footer'), { ssr: true })
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false })

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