'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/context/ToastContext'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', status: 'active' })
  const { toast } = useToast()

  const fetchCategories = async () => { const r = await fetch('/api/categories'); const d = await r.json(); if (d.success) setCategories(d.categories) }
  useEffect(() => { fetchCategories() }, [])

  const openAdd = () => { setForm({ name: '', status: 'active' }); setEditingId(null); setShowModal(true) }
  const openEdit = c => { setForm({ name: c.name, status: c.status }); setEditingId(c._id); setShowModal(true) }

  const handleSubmit = async e => {
    e.preventDefault()
    const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    toast(editingId ? 'Updated' : 'Created', 'success'); setShowModal(false); fetchCategories()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' }); toast('Deleted', 'success'); fetchCategories()
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories ({categories.length})</h1>
        <button onClick={openAdd} className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold">+ Add</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(c => (
          <div key={c._id} className="bg-card border border-border rounded-2xl p-4">
            <p className="font-semibold">{c.name}</p>
            <p className={`text-xs mt-1 ${c.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>{c.status}</p>
            <div className="flex gap-2 mt-3"><button onClick={() => openEdit(c)} className="text-xs text-primary hover:underline">Edit</button><button onClick={() => handleDelete(c._id, c.name)} className="text-xs text-red-500 hover:underline">Del</button></div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold mb-4">{editingId ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary" placeholder="Category name" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text"><option value="active">Active</option><option value="inactive">Inactive</option></select>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-full font-semibold">{editingId ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}