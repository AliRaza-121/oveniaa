'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast('Message sent!', 'success'); setForm({ name: '', email: '', message: '' })
    } catch {} finally { setLoading(false) }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold font-display">Contact <span className="text-primary">Us</span></h1>
          <p className="text-text-muted mt-4">Have a question or feedback? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[
              { icon: '📧', title: 'Email', value: 'aliraaza701@gmail.com' },
              { icon: '📞', title: 'Phone', value: '+92 324 1302639' },
              { icon: '📍', title: 'Address', value: 'Faisalabad, Pakistan' },
              { icon: '🕐', title: 'Hours', value: '12 PM – 12 AM, Every Day' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3"><span className="text-2xl">{item.icon}</span><div><p className="text-sm font-semibold">{item.title}</p><p className="text-text-muted text-sm">{item.value}</p></div></div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Name" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text" />
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="Email" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text" />
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={4} placeholder="Message" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text resize-none" />
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">{loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}