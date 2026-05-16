'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    if (result.success) window.location.href = '/'
    else { setError(result.error); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold font-display text-primary">🍕 Oveniaa</Link>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8">
          <h1 className="text-2xl font-bold font-display text-center mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm text-center mb-6">Sign in to your account</p>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}