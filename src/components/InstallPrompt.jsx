'use client'

import { useState, useEffect, useCallback } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [visible, setVisible] = useState(false) // for CSS animation

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    setIsStandalone(!!standalone)
    if (standalone) return

    // Check if dismissed recently (show again after 3 days)
    const dismissedAt = localStorage.getItem('oveniaa-install-dismissed-at')
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSince < 3) return
    }

    // Detect iOS (all iOS browsers use WebKit)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    // For iOS — show custom instructions after a short scroll-based delay
    if (isIOSDevice) {
      // Show after user scrolls a bit or after 4 seconds, whichever comes first
      let shown = false
      const show = () => {
        if (shown) return
        
        const dismissed = localStorage.getItem('oveniaa-install-dismissed-at')
        if (dismissed && (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24) < 3) return

        shown = true
        setShowPrompt(true)
        window.removeEventListener('scroll', onScroll)
        clearTimeout(timer)
      }
      const onScroll = () => {
        if (window.scrollY > 200) show()
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      const timer = setTimeout(show, 4000)
      return () => {
        window.removeEventListener('scroll', onScroll)
        clearTimeout(timer)
      }
    }

    // For Android/Chrome — capture beforeinstallprompt
    // KEY FIX: Check if the event already fired before this component mounted
    // We store it on window in case it fires before React hydrates
    if (window.__pwaPromptEvent) {
      setDeferredPrompt(window.__pwaPromptEvent)
      
      const dismissed = localStorage.getItem('oveniaa-install-dismissed-at')
      if (!dismissed || (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24) >= 3) {
        setTimeout(() => setShowPrompt(true), 1500)
      }
    }

    const handler = (e) => {
      e.preventDefault()
      window.__pwaPromptEvent = e
      setDeferredPrompt(e)
      
      const dismissed = localStorage.getItem('oveniaa-install-dismissed-at')
      if (!dismissed || (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24) >= 3) {
        // Show after a short delay to not interrupt initial page experience
        setTimeout(() => setShowPrompt(true), 1500)
      }
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

  // Trigger CSS enter animation when showPrompt changes
  useEffect(() => {
    if (showPrompt) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [showPrompt])

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      window.__pwaPromptEvent = null
      if (result.outcome === 'accepted') {
        localStorage.setItem('oveniaa-install-dismissed-at', Date.now().toString())
      }
    }
    setShowPrompt(false)
    localStorage.setItem('oveniaa-install-dismissed-at', Date.now().toString())
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    // Wait for exit animation before unmounting
    setTimeout(() => {
      setShowPrompt(false)
      localStorage.setItem('oveniaa-install-dismissed-at', Date.now().toString())
    }, 300)
  }, [])

  if (isStandalone || !showPrompt) return null

  return (
    <div
      className={`fixed bottom-4 left-3 right-3 z-[60] sm:left-auto sm:right-4 sm:w-96 install-prompt-slide ${visible ? 'install-prompt-visible' : ''}`}
    >
      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl shadow-black/40">
        {isIOS ? (
          /* iOS — show manual instructions */
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
                <span>1.</span> Tap the <span className="inline-flex items-center justify-center bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  Share
                </span> button below
              </p>
              <p className="text-xs text-text-light flex items-center gap-2">
                <span>2.</span> Scroll down & tap <span className="inline-flex items-center justify-center bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">+ Add to Home Screen</span>
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
    </div>
  )
}