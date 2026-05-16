'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RegisterClient() {
  const [step, setStep] = useState('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 6) { setError('Password must be 6+ characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) { setMessage('OTP sent to your email'); setStep('otp') }
      else setError(data.error)
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, otp }),
      })
      const data = await res.json()
      if (data.success) window.location.href = '/'
      else setError(data.error)
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold font-display text-primary">🍕 Oveniaa</Link>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8">
          <h1 className="text-2xl font-bold font-display text-center mb-2">
            {step === 'form' ? 'Create Account' : 'Check Your Email'}
          </h1>
          <p className="text-text-muted text-sm text-center mb-6">
            {step === 'form' ? 'Join Oveniaa today' : `We sent a code to ${email}`}
          </p>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3 mb-4">{message}</div>}

          {step === 'form' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="Min 6 characters" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                {loading ? 'Sending OTP...' : 'Send Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Verification Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required maxLength={6} className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-2xl text-center tracking-[0.5em] font-bold text-text focus:outline-none focus:border-primary" placeholder="000000" />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                {loading ? 'Verifying...' : 'Create Account'}
              </button>
              <button type="button" onClick={handleSendOTP} className="w-full text-center text-sm text-primary hover:underline">Resend Code</button>
              <button type="button" onClick={() => { setStep('form'); setError(''); setMessage('') }} className="w-full text-center text-sm text-text-muted hover:text-text">← Back</button>
            </form>
          )}

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}