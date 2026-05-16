'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/context/ToastContext'

const emptyForm = {
  title: '', description: '', discount: '', price: '', originalPrice: '',
  items: [], isActive: true, backgroundColor: 'from-primary/20 to-secondary/10', expiresAt: ''
}

export default function AdminDeals() {
  const [deals, setDeals] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [itemSearch, setItemSearch] = useState('')
  const { toast } = useToast()

  const fetchDeals = async () => {
    const res = await fetch('/api/deals')
    const data = await res.json()
    if (data.success) setDeals(data.deals)
    setLoading(false)
  }

  useEffect(() => {
    fetchDeals()
    fetch('/api/menu').then(r => r.json()).then(d => { if (d.success) setMenuItems(d.items) })
  }, [])

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setItemSearch(''); setShowModal(true) }

  const openEdit = (deal) => {
    setForm({
      title: deal.title, description: deal.description || '', discount: deal.discount || '',
      price: deal.price?.toString() || '', originalPrice: deal.originalPrice?.toString() || '',
      items: deal.items?.map(i => typeof i === 'object' ? i._id : i) || [],
      isActive: deal.isActive, backgroundColor: deal.backgroundColor || 'from-primary/20 to-secondary/10',
      expiresAt: deal.expiresAt ? new Date(deal.expiresAt).toISOString().slice(0, 10) : '',
    })
    setEditingId(deal._id); setItemSearch(''); setShowModal(true)
  }

  const toggleItem = (id) => {
    setForm(prev => ({ ...prev, items: prev.items.includes(id) ? prev.items.filter(i => i !== id) : [...prev.items, id] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.items.length === 0) { toast('Select at least one item', 'error'); return }
    const body = { ...form, price: Number(form.price) || 0, originalPrice: Number(form.originalPrice) || 0, expiresAt: form.expiresAt ? new Date(form.expiresAt) : null }
    const url = editingId ? `/api/deals/${editingId}` : '/api/deals'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    toast(editingId ? 'Updated' : 'Created', 'success'); setShowModal(false); fetchDeals()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this deal?')) return
    await fetch(`/api/deals/${id}`, { method: 'DELETE' }); toast('Deleted', 'success'); fetchDeals()
  }

  const filteredItems = menuItems.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()))

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div><h1 className="text-2xl font-bold font-display">Deals</h1><p className="text-text-muted text-sm">{deals.length} deals</p></div>
        <button onClick={openAdd} className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold">+ Add Deal</button>
      </div>

      {loading ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="animate-pulse h-32 bg-card rounded-2xl" />)}</div> : deals.length === 0 ? (
        <div className="text-center py-16"><span className="text-4xl">⚡</span><p className="text-text-muted mt-3">No deals yet</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map(deal => (
            <div key={deal._id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex justify-between mb-3"><h3 className="font-bold">{deal.title}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${deal.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{deal.isActive ? 'Active' : 'Inactive'}</span></div>
              {deal.description && <p className="text-text-muted text-sm mb-2">{deal.description}</p>}
              {deal.discount && <p className="text-primary font-bold text-base">{deal.discount}</p>}
              <div className="flex items-center gap-2 mt-1">
                {deal.price > 0 && <span className="font-bold">Rs. {deal.price}</span>}
                {deal.originalPrice > 0 && <span className="text-text-muted text-sm line-through">Rs. {deal.originalPrice}</span>}
              </div>
              <div className="flex gap-2 mt-3"><button onClick={() => openEdit(deal)} className="text-xs text-primary hover:underline">Edit</button><button onClick={() => handleDelete(deal._id)} className="text-xs text-red-500 hover:underline">Delete</button></div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="border-b border-border px-6 py-4 flex justify-between"><h2 className="font-bold">{editingId ? 'Edit' : 'Add'} Deal</h2><button onClick={() => setShowModal(false)} className="text-text-muted text-xl">✕</button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Deal Title *" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary" />
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text" />
              <input value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} required placeholder="Discount Text * (e.g. 30% OFF)" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Deal Price" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text" />
                <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} placeholder="Original Price" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text" />
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Select Items ({form.items.length})</p>
                <input value={itemSearch} onChange={e => setItemSearch(e.target.value)} placeholder="Search items..." className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text mb-2" />
                <div className="max-h-40 overflow-y-auto space-y-1 bg-bg rounded-xl p-2 border border-border">
                  {filteredItems.map(item => (
                    <label key={item._id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${form.items.includes(item._id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-bg-dark/5'}`}>
                      <input type="checkbox" checked={form.items.includes(item._id)} onChange={() => toggleItem(item._id)} className="accent-primary w-4 h-4" />
                      <span className="text-sm flex-1">{item.name}</span>
                      <span className="text-xs text-text-muted">Rs. {item.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="accent-primary" /><span className="text-sm">Active</span></label>
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-full font-semibold">{editingId ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}