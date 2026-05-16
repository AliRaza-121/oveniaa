'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function OrderNotifier() {
  const { user } = useAuth()
  const prevCount = useRef(0)

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 800; gain.gain.value = 0.1
      osc.start(); osc.stop(ctx.currentTime + 0.1)
      setTimeout(() => {
        const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain()
        osc2.connect(gain2); gain2.connect(ctx.destination)
        osc2.frequency.value = 1000; gain2.gain.value = 0.1
        osc2.start(); osc2.stop(ctx.currentTime + 0.15)
      }, 120)
    } catch {}
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') return

    const checkOrders = async () => {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        if (data.success) {
          if (prevCount.current > 0 && data.orders.length > prevCount.current) {
            playSound()
          }
          prevCount.current = data.orders.length
        }
      } catch {}
    }

    checkOrders()
    const interval = setInterval(checkOrders, 30000)
    return () => clearInterval(interval)
  }, [user])

  return null
}