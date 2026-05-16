'use client'

import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-card border border-border rounded-2xl p-4 shadow-2xl sm:left-auto sm:right-4 sm:w-80">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🍕</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-text">Install Oveniaa</p>
          <p className="text-xs text-text-muted">Add to Home Screen for quick access</p>
        </div>
        <button onClick={handleInstall} className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary-dark transition-colors">
          Install
        </button>
      </div>
      <button onClick={() => setShowPrompt(false)} className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-xs text-text-muted hover:text-text">✕</button>
    </div>
  )
}