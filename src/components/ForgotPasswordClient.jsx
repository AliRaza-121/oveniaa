'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ForgotPasswordClient() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) { setMessage('Reset code sent to your email'); setStep('otp') }
      else setError(data.error)
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await res.json()
      if (data.success) { setStep('success') }
      else setError(data.error)
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">🍕 Oveniaa</Link>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8">

          {step === 'success' ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">✅</div>
              <h1 className="text-2xl font-bold">Password Reset!</h1>
              <p className="text-text-muted text-sm">Your password has been updated successfully.</p>
              <Link href="/login" className="block w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors text-center mt-4">
                Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">
                {step === 'email' ? 'Forgot Password?' : 'Enter Reset Code'}
              </h1>
              <p className="text-text-muted text-sm text-center mb-6">
                {step === 'email'
                  ? "Enter your email and we'll send you a reset code"
                  : `We sent a 6-digit code to ${email}`}
              </p>

              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3 mb-4">{message}</div>}

              {step === 'email' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="you@example.com" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">Verification Code</label>
                    <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required maxLength={6}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-2xl text-center tracking-[0.5em] font-bold text-text focus:outline-none focus:border-primary" placeholder="000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="Min 6 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary" placeholder="Confirm your password" />
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                  <button type="button" onClick={handleSendOTP} className="w-full text-center text-sm text-primary hover:underline">Resend Code</button>
                  <button type="button" onClick={() => { setStep('email'); setError(''); setMessage('') }} className="w-full text-center text-sm text-text-muted hover:text-text">← Back</button>
                </form>
              )}
            </>
          )}

          {step !== 'success' && (
            <p className="text-center text-sm text-text-muted mt-6">
              Remember your password? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
