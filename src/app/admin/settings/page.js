'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/context/ToastContext'

export default function AdminSettings() {
  const [storeOpen, setStoreOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStoreOpen(data.config.storeOpen !== false)
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeOpen })
      })
      const data = await res.json()
      if (data.success) {
        toast('Settings updated successfully!', 'success')
      } else {
        toast('Failed to update settings', 'error')
      }
    } catch (err) {
      toast('Network error', 'error')
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
  }

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
      
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Store Status</h2>
            <p className="text-sm text-text-muted mt-1">
              Toggle this off to stop receiving new orders. Users will see that the store is currently closed.
            </p>
          </div>
          
          <button 
            onClick={() => setStoreOpen(!storeOpen)}
            className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${storeOpen ? 'bg-emerald-500' : 'bg-gray-600'}`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${storeOpen ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
