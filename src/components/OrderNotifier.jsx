'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function OrderNotifier() {
  const { user } = useAuth()
  const prevCount = useRef(0)
  const audioCtxRef = useRef(null)
  const hasInteracted = useRef(false)

  // We need user interaction to unlock AudioContext on mobile/modern browsers
  useEffect(() => {
    const unlock = () => {
      hasInteracted.current = true
      // Pre-create AudioContext on first interaction so it's ready
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      // Resume if suspended (browsers suspend until user gesture)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }
    }
    window.addEventListener('click', unlock, { once: false })
    window.addEventListener('touchstart', unlock, { once: false })
    window.addEventListener('keydown', unlock, { once: false })
    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const playSound = useCallback(() => {
    try {
      // Create or reuse AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current

      // Resume if suspended
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime

      // === ALARM PATTERN: 3 loud repeating bursts ===
      // Each burst is a dual-tone "ding-dong" for urgency
      const playBurst = (startTime) => {
        // --- High tone (ding) ---
        const osc1 = ctx.createOscillator()
        const gain1 = ctx.createGain()
        osc1.type = 'square' // Square wave is louder/harsher than sine
        osc1.frequency.value = 880 // A5 note
        gain1.gain.setValueAtTime(0.8, startTime)
        gain1.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
        osc1.connect(gain1)
        gain1.connect(ctx.destination)
        osc1.start(startTime)
        osc1.stop(startTime + 0.3)

        // --- Low tone (dong) ---
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'square'
        osc2.frequency.value = 1175 // D6 note — creates urgency interval
        gain2.gain.setValueAtTime(0.8, startTime + 0.15)
        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start(startTime + 0.15)
        osc2.stop(startTime + 0.5)

        // --- Extra harmonic for fullness ---
        const osc3 = ctx.createOscillator()
        const gain3 = ctx.createGain()
        osc3.type = 'sine'
        osc3.frequency.value = 1760 // A6 — octave above for brightness
        gain3.gain.setValueAtTime(0.4, startTime)
        gain3.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)
        osc3.connect(gain3)
        gain3.connect(ctx.destination)
        osc3.start(startTime)
        osc3.stop(startTime + 0.25)
      }

      // Play 3 bursts with gaps for a clear "NEW ORDER!" alarm
      playBurst(now)
      playBurst(now + 0.6)
      playBurst(now + 1.2)

      // Also try to show a browser notification for extra visibility
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍕 New Order!', {
          body: 'A new order has been placed on Oveniaa!',
          icon: '/icon-192x192.png',
          requireInteraction: true,
          tag: 'new-order',
        })
      }
    } catch (e) {
      console.error('Order notification sound failed:', e)
    }
  }, [])

  // Request notification permission on mount for admin
  useEffect(() => {
    if (user?.role === 'admin' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [user])

  useEffect(() => {
    if (!user || user.role !== 'admin') return

    const checkOrders = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        if (data.success) {
          if (prevCount.current > 0 && data.stats.orders > prevCount.current) {
            playSound()
          }
          prevCount.current = data.stats.orders
        }
      } catch {}
    }

    checkOrders()
    // Poll every 15 seconds for faster detection
    const interval = setInterval(checkOrders, 15000)
    return () => clearInterval(interval)
  }, [user, playSound])

  return null
}