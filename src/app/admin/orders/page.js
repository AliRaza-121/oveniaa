'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
const colors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  preparing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [prevOrderCount, setPrevOrderCount] = useState(0)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

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

  const fetchOrders = async () => {
    const res = await fetch('/api/orders'); const data = await res.json()
    if (data.success) {
      if (prevOrderCount > 0 && data.orders.length > prevOrderCount) playSound()
      setPrevOrderCount(data.orders.length)
      setOrders(data.orders)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  }

  const baseOrders = searchQuery
    ? orders.filter(o => o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.phone?.includes(searchQuery) || o._id.slice(-6).toUpperCase().includes(searchQuery.toUpperCase()))
    : orders

  const filtered = activeTab === 'All' ? baseOrders : baseOrders.filter(o => o.status === activeTab)

  const tabs = [
    { key: 'pending', label: 'Pending', count: baseOrders.filter(o => o.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: baseOrders.filter(o => o.status === 'confirmed').length },
    { key: 'preparing', label: 'Preparing', count: baseOrders.filter(o => o.status === 'preparing').length },
    { key: 'ready', label: 'Ready', count: baseOrders.filter(o => o.status === 'ready').length },
    { key: 'delivered', label: 'Delivered', count: baseOrders.filter(o => o.status === 'delivered').length },
  ]

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold font-display mb-4 sm:mb-6">Orders ({baseOrders.length})</h1>

      {searchQuery && (
        <p className="text-xs sm:text-sm text-text-muted mb-4">Search: <span className="text-primary font-semibold">"{searchQuery}"</span> — {baseOrders.length} found</p>
      )}

      <div className="flex gap-1 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2
              ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-card text-text-light border border-border hover:border-primary'}`}>
            {tab.label}
            <span className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full text-[9px] sm:text-[10px] flex items-center justify-center ${activeTab === tab.key ? 'bg-white/20' : 'bg-border/50'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filtered.map(order => (
          <div key={order._id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0 flex-1 mr-3">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-[10px] sm:text-xs text-text-muted font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                  <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full capitalize ${colors[order.status]}`}>{order.status}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold truncate">{order.customerName}</p>
                <p className="text-[10px] sm:text-xs text-text-muted truncate">{order.phone}{order.address ? ` • ${order.address}` : ''}</p>
                {order.email && <p className="text-[10px] sm:text-xs text-text-muted truncate">{order.email}</p>}
                <p className="text-[10px] sm:text-xs text-text-muted mt-1">🕐 {new Date(order.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })} • {Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base sm:text-lg font-bold text-primary">Rs. {order.total}</p>
                <p className="text-[10px] sm:text-xs text-text-muted capitalize">{order.orderType}</p>
              </div>
            </div>

            <div className="text-[10px] sm:text-sm text-text-muted mb-3 bg-bg rounded-xl p-2 sm:p-3 break-words">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-0.5">
                  <span className="truncate mr-2">{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                  <span className="flex-shrink-0">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {order.notes && <p className="text-[10px] sm:text-xs text-text-muted mb-3">📝 {order.notes}</p>}

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} className="bg-bg text-text border border-border rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => updateStatus(order._id, activeTab === 'pending' ? 'confirmed' : activeTab === 'confirmed' ? 'preparing' : activeTab === 'preparing' ? 'ready' : 'delivered')} className="text-[10px] sm:text-xs bg-primary text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium hover:bg-primary-dark transition-colors">Next →</button>
              <button onClick={() => { const w = window.open('', '', 'width=400,height=600'); w.document.write(`<html><head><title>Order #${order._id.slice(-6).toUpperCase()}</title><style>body{font-family:sans-serif;padding:20px;font-size:14px}h2{font-size:18px}.item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ddd}.total{font-weight:bold;font-size:16px;margin-top:12px}</style></head><body><h2>🍕 Oveniaa - Order #${order._id.slice(-6).toUpperCase()}</h2><p><strong>${order.customerName}</strong> | ${order.phone}</p><p>Type: ${order.orderType} | Status: ${order.status}</p>${order.address ? `<p>📍 ${order.address}</p>` : ''}<hr/>${order.items.map(i => `<div class="item"><span>${i.quantity}x ${i.name} ${i.size ? '('+i.size+')' : ''}</span><span>Rs. ${i.price * i.quantity}</span></div>`).join('')}<div class="total">Total: Rs. ${order.total}</div>${order.notes ? `<p>📝 ${order.notes}</p>` : ''}</body></html>`); w.document.close(); w.print() }} className="text-[10px] sm:text-xs bg-card border border-border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-text-muted hover:text-text transition-colors">🖨️</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-text-muted py-10 text-sm">No {activeTab} orders</p>}
      </div>
    </div>
  )
}