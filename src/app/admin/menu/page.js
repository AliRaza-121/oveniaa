'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'

const emptyForm = {
  name: '', price: '', category: '', description: '',
  isPopular: false, isAvailable: true,
  sizes: '', sizePrices: {}, addOns: '', image: '',
}

const categorySizes = {
  'Burgers': [],
  'Pizzas': ['Small', 'Medium', 'Large', 'Extra Large'],
  'Fries & Sides': ['Regular', 'Large'],
  'Drinks': ['Small', 'Medium', 'Large'],
  'Wings': ['6 pcs', '12 pcs', '18 pcs'],
}

const categoryEmojis = {
  'Burgers': '🍔',
  'Pizzas': '🍕',
  'Fries & Sides': '🍟',
  'Drinks': '🥤',
  'Wings': '🍗',
}

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCat, setSelectedCat] = useState('All')
  const { toast } = useToast()

  const fetchItems = async () => {
    const res = await fetch('/api/menu')
    const data = await res.json()
    if (data.success) setItems(data.items)
    setLoading(false)
  }

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    if (data.success) setCategories(data.categories.filter(c => c.status === 'active'))
  }

  useEffect(() => { fetchItems(); fetchCategories() }, [])

  const showBasePrice = !form.category || form.category === 'Burgers'

  const handleCategoryChange = (cat) => {
    const sizes = categorySizes[cat] || []
    const sizePrices = {}
    sizes.forEach(s => { sizePrices[s] = '' })
    setForm({ ...form, category: cat, sizePrices })
  }

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true) }

  const openEdit = (item) => {
    const sizes = item.sizes || []
    const existingPrices = item.sizePrices || {}
    const sizePrices = {}
    sizes.forEach(s => { sizePrices[s] = existingPrices[s] || '' })
    
    setForm({
      name: item.name, price: sizes.length === 0 ? item.price.toString() : '',
      category: item.category,
      description: item.description || '', isPopular: item.isPopular, isAvailable: item.isAvailable,
      sizePrices,
      addOns: item.addOns?.map(a => `${a.name}:${a.price}`).join(', ') || '',
      image: item.image || '',
    })
    setEditingId(item._id)
    setShowModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('image', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) setForm({ ...form, image: data.url })
    else toast('Upload failed', 'error')
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // if (!form.image && !editingId) { toast('Please upload an image', 'error'); return }

    const sizes = categorySizes[form.category] || []
    const hasSizePrices = sizes.length > 0
    const price = hasSizePrices ? 0 : Number(form.price)
    const cleanSizePrices = {}
    if (hasSizePrices) sizes.forEach(s => { cleanSizePrices[s] = Number(form.sizePrices[s]) || 0 })

    const body = {
      name: form.name, price,
      category: form.category,
      description: form.description,
      isPopular: form.isPopular,
      isAvailable: form.isAvailable,
      sizes: hasSizePrices ? sizes : [],
      sizePrices: hasSizePrices ? cleanSizePrices : {},
      addOns: form.addOns.split(',').map(s => { const [n, p] = s.split(':'); return { name: n?.trim(), price: Number(p) || 0 } }).filter(a => a.name),
      image: form.image,
    }

    const url = editingId ? `/api/menu/${editingId}` : '/api/menu'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) { toast(editingId ? 'Updated' : 'Created', 'success'); setShowModal(false); fetchItems() }
    else toast(data.error || 'Error', 'error')
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/menu/${id}`, { method: 'DELETE' })
    toast('Deleted', 'success'); fetchItems()
  }

  const toggleAvailable = async (item) => {
    await fetch(`/api/menu/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isAvailable: !item.isAvailable }) })
    fetchItems()
  }

  const filteredItems = selectedCat === 'All' ? items : items.filter(i => i.category === selectedCat)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Menu Items</h1>
          <p className="text-text-muted text-sm">{items.length} items</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-card border border-border rounded-full p-1">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted'}`}>Grid</button>
            <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-primary text-white' : 'text-text-muted'}`}>Table</button>
          </div>
          <button onClick={openAdd} className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors">+ Add Item</button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setSelectedCat('All')} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCat === 'All' ? 'bg-primary text-white' : 'bg-card text-text-light border border-border hover:border-primary'}`}>
          All ({items.length})
        </button>
        {categories.map(cat => (
          <button key={cat._id} onClick={() => setSelectedCat(cat.name)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${selectedCat === cat.name ? 'bg-primary text-white' : 'bg-card text-text-light border border-border hover:border-primary'}`}>
            <span>{categoryEmojis[cat.name] || '📦'}</span>
            {cat.name}
            <span className="text-[10px] opacity-70">({items.filter(i => i.category === cat.name).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-64 bg-card rounded-2xl border border-border" />)}
          </div>
        ) : (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="animate-pulse h-14 bg-card rounded-xl border border-border" />)}</div>
        )
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-40 bg-primary/5 flex items-center justify-center text-5xl overflow-hidden">
                {item.image ? (
                 <img 
  src={item.image ? item.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/') : ''} 
  alt={item.name} 
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
  loading="lazy"
/>
                ) : (
                  <span>{categoryEmojis[item.category] || '🍔'}</span>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {item.isPopular && (
                    <span className="bg-secondary text-bg-dark text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ Popular</span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => { e.preventDefault(); toggleAvailable(item) }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all ${
                      item.isAvailable
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">{item.category}</span>
                <h3 className="font-bold text-text mt-1 truncate">{item.name}</h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">{item.description}</p>

                {/* Price */}
                <div className="mt-3">
                  {item.sizes?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.map(size => (
                        <span key={size} className="text-[10px] bg-bg px-2 py-0.5 rounded-full text-text-muted">
                          {size}: <span className="text-primary font-semibold">Rs. {item.sizePrices?.[size] || item.price}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-primary font-bold">Rs. {item.price}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                  <button onClick={() => openEdit(item)} className="text-xs text-primary hover:underline font-medium">Edit</button>
                  <button onClick={() => handleDelete(item._id, item.name)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/menu/${item._id}`)
                    toast('Link copied!', 'success')
                  }} className="text-xs text-text-muted hover:text-text ml-auto" title="Copy link">🔗</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-card border border-border rounded-2xl">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border"><th className="py-3 px-4 text-xs font-medium">Item</th><th className="py-3 px-4 text-xs font-medium hidden sm:table-cell">Category</th><th className="py-3 px-4 text-xs font-medium">Price</th><th className="py-3 px-4 text-xs font-medium hidden lg:table-cell">Available</th><th className="py-3 px-4 text-xs font-medium">Actions</th></tr></thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id} className="border-b border-border/50 hover:bg-bg/50">
                  <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">{item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : <span>{categoryEmojis[item.category] || '🍔'}</span>}</div><span className="text-sm font-medium truncate max-w-[150px]">{item.name}</span></div></td>
                  <td className="py-3 px-4 hidden sm:table-cell text-sm text-text-muted">{item.category}</td>
                  <td className="py-3 px-4 text-sm font-bold text-primary">{item.sizes?.length > 0 ? `Rs. ${Math.min(...Object.values(item.sizePrices || {}))} - Rs. ${Math.max(...Object.values(item.sizePrices || {}))}` : `Rs. ${item.price}`}</td>
                  <td className="py-3 px-4 hidden lg:table-cell"><button onClick={() => toggleAvailable(item)} className={`text-xs font-semibold px-2 py-1 rounded-full ${item.isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{item.isAvailable ? 'Yes' : 'No'}</button></td>
                  <td className="py-3 px-4"><div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-xs text-primary hover:underline">Edit</button><button onClick={() => handleDelete(item._id, item.name)} className="text-xs text-red-500 hover:underline">Del</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal remains the same */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="border-b border-border px-6 py-4 flex justify-between"><h2 className="font-bold">{editingId ? 'Edit' : 'Add'} Item</h2><button onClick={() => setShowModal(false)} className="text-text-muted text-xl">✕</button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Name *" className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary" />
                <select value={form.category} onChange={e => handleCategoryChange(e.target.value)} required className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {showBasePrice && (
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="Price *" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary" />
              )}

              {!showBasePrice && form.category && (
                <div>
                  <p className="text-sm font-semibold mb-2">Size Prices</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(form.sizePrices).map(size => (
                      <div key={size}>
                        <label className="block text-xs text-text-muted mb-1">{size}</label>
                        <input type="number" value={form.sizePrices[size]} onChange={e => setForm({...form, sizePrices: {...form.sizePrices, [size]: e.target.value}})} required placeholder="Rs." className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text resize-none" />
              <input value={form.addOns} onChange={e => setForm({...form, addOns: e.target.value})} placeholder="Add-ons: Cheese:50, Bacon:80" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text" />
              <div>
                <label className="block text-xs text-text-muted mb-1">Image {!editingId && '*'}</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                {uploading && <p className="text-xs text-primary mt-1">Uploading...</p>}
                {form.image && <img src={form.image} alt="" className="h-16 mt-2 rounded-lg" />}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} /><span className="text-sm">Popular</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} /><span className="text-sm">Available</span></label>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-full font-semibold">{editingId ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}