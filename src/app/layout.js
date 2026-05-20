import { Inter, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import OrderNotifier from '@/components/OrderNotifier'
import InstallPrompt from '@/components/InstallPrompt'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-display', display: 'swap' })

export const metadata = {
  title: 'Oveniaa - Fresh Fast Food',
  description: 'Order fresh burgers, pizzas, fries and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Oveniaa',
  },
}

export const viewport = {
  themeColor: '#FF6B35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
              <OrderNotifier />
              <InstallPrompt />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}