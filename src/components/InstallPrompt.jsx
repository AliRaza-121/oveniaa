'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    setIsStandalone(!!standalone)
    if (standalone) return

    // Check if dismissed recently (show again after 7 days)
    const dismissedAt = localStorage.getItem('oveniaa-install-dismissed-at')
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSince < 7) return
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // For iOS Safari — show custom instructions after delay
    if (isIOSDevice && isSafari) {
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }

    // For Android/Chrome — listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowPrompt(true), 2000)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Hide if installed
    const installedHandler = () => {
      localStorage.setItem('oveniaa-install-dismissed-at', Date.now().toString())
      setShowPrompt(false)
    }
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
    setShowPrompt(false)
    localStorage.setItem('oveniaa-install-dismissed-at', Date.now().toString())
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('oveniaa-install-dismissed-at', Date.now().toString())
  }

  if (isStandalone || !showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-3 right-3 z-[60] sm:left-auto sm:right-4 sm:w-96"
      >
        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl shadow-black/40">
          {isIOS ? (
            /* iOS Safari instructions */
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍕</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text">Install Oveniaa</p>
                  <p className="text-xs text-text-muted">Add to your Home Screen for the best experience</p>
                </div>
                <button onClick={handleDismiss} aria-label="Dismiss" className="w-7 h-7 flex items-center justify-center rounded-full bg-bg/80 text-text-muted hover:text-text text-xs shrink-0">✕</button>
              </div>
              <div className="bg-bg/60 rounded-xl px-3 py-2.5 space-y-1.5">
                <p className="text-xs text-text-light flex items-center gap-2">
                  <span>1.</span> Tap the <span className="inline-flex items-center justify-center bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">Share</span> button below
                </p>
                <p className="text-xs text-text-light flex items-center gap-2">
                  <span>2.</span> Scroll down & tap <span className="inline-flex items-center justify-center bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">Add to Home Screen</span>
                </p>
              </div>
            </div>
          ) : (
            /* Android / Chrome — native install */
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍕</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">Install Oveniaa</p>
                <p className="text-xs text-text-muted">Add to Home Screen for quick access</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleDismiss} className="text-xs text-text-muted hover:text-text px-2 py-1.5 rounded-lg transition-colors">Later</button>
                <button onClick={handleInstall} className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary-dark transition-colors">Install</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}