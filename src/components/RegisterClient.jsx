'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function RegisterClient() {
  const [step, setStep] = useState('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      const data = await res.json()
      if (data.success) window.location.href = '/'
      else setError(data.error || 'Google sign-in failed')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">🍕 Oveniaa</Link>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            {step === 'form' ? 'Create Account' : 'Check Your Email'}
          </h1>
          <p className="text-text-muted text-sm text-center mb-6">
            {step === 'form' ? 'Join Oveniaa today' : `We sent a code to ${email}`}
          </p>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3 mb-4">{message}</div>}

          {step === 'form' ? (
            <>
              {/* Google Sign-Up */}
              <button onClick={handleGoogleSignIn} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-bg border border-border rounded-xl px-4 py-3 text-sm font-semibold text-text hover:border-primary/40 hover:bg-bg/80 transition-all disabled:opacity-50 mb-5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {googleLoading ? 'Signing up...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-text-muted font-medium">or register with email</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

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
            </>
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