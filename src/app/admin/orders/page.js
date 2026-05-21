'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const KDS_COLUMNS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

const nextStatus = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
  delivered: null
}

const colors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500',
  preparing: 'bg-purple-500/10 text-purple-400 border-purple-500',
  ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500',
  delivered: 'bg-green-500/10 text-green-400 border-green-500',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const fetchOrders = async () => {
    const res = await fetch('/api/orders'); 
    const data = await res.json()
    if (data.success) {
      setOrders(data.orders)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (id, status) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  }

  const baseOrders = searchQuery
    ? orders.filter(o => o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.phone?.includes(searchQuery) || o._id.slice(-6).toUpperCase().includes(searchQuery.toUpperCase()))
    : orders

  const printOrder = (order) => {
    const w = window.open('', '', 'width=400,height=600'); 
    w.document.write(`<html><head><title>Order #${order._id.slice(-6).toUpperCase()}</title><style>body{font-family:sans-serif;padding:20px;font-size:14px}h2{font-size:18px}.item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ddd}.total{font-weight:bold;font-size:16px;margin-top:12px}</style></head><body><h2>🍕 Oveniaa - Order #${order._id.slice(-6).toUpperCase()}</h2><p><strong>${order.customerName}</strong> | ${order.phone}</p><p>Type: ${order.orderType} | Status: ${order.status}</p>${order.address ? `<p>📍 ${order.address}</p>` : ''}<hr/>${order.items.map(i => `<div class="item"><span>${i.quantity}x ${i.name} ${i.size ? '('+i.size+')' : ''}</span><span>Rs. ${i.price * i.quantity}</span></div>`).join('')}<div class="total">Total: Rs. ${order.total}</div>${order.notes ? `<p>📝 ${order.notes}</p>` : ''}</body></html>`); 
    w.document.close(); 
    w.print()
  }

  return (
    <div className="h-[calc(100dvh-110px)] md:h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">Kitchen Display System <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">KDS</span></h1>
          <p className="text-sm text-text-muted mt-1">{baseOrders.length} active orders • Auto-updating every 15s</p>
        </div>
        {searchQuery && <p className="text-xs sm:text-sm text-text-muted">Search: <span className="text-primary font-semibold">"{searchQuery}"</span></p>}
      </div>

      <div className="flex-1 overflow-x-auto flex gap-3 pb-4 items-start snap-x snap-mandatory hide-scrollbar">
        {KDS_COLUMNS.map(col => {
          const colOrders = baseOrders.filter(o => o.status === col)
          return (
            <div key={col} className="min-w-[85vw] max-w-[85vw] sm:min-w-[280px] sm:max-w-[280px] w-full bg-bg border border-border rounded-2xl flex flex-col h-full max-h-full snap-center shadow-lg">
              <div className={`p-4 border-b border-border bg-card rounded-t-2xl flex items-center justify-between sticky top-0 z-10 border-t-4 ${colors[col].split(' ')[2]}`}>
                <h3 className="font-bold capitalize flex items-center gap-2">
                  {col === 'pending' && '🔴'}
                  {col === 'confirmed' && '🔵'}
                  {col === 'preparing' && '🟣'}
                  {col === 'ready' && '🟢'}
                  {col === 'delivered' && '✅'}
                  {col}
                </h3>
                <span className="bg-bg border border-border text-text text-xs font-bold px-2.5 py-1 rounded-full">{colOrders.length}</span>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar relative">
                {colOrders.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted opacity-50">
                    <span className="text-3xl mb-2">🍽️</span>
                    <p className="text-xs">No {col} orders</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {colOrders.map(order => (
                    <motion.div 
                      key={order._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-card border border-border rounded-xl p-3 shadow-sm hover:border-primary/50 transition-colors ${order.status === 'pending' ? 'animate-pulse-subtle ring-1 ring-yellow-500/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="text-[10px] text-text-muted font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                          <h4 className="font-bold text-sm truncate max-w-[150px]">{order.customerName}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-primary">Rs. {order.total}</p>
                          <p className="text-[9px] text-text-muted uppercase font-bold tracking-wider">{order.orderType}</p>
                        </div>
                      </div>

                      <div className="text-[11px] text-text-light mb-2 bg-bg rounded-lg p-1.5 space-y-0.5 border border-border/50">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-medium">{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && <p className="text-[10px] text-yellow-400 mb-2 bg-yellow-400/10 p-1.5 rounded-lg border border-yellow-400/20">📝 {order.notes}</p>}

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                        <div className="text-[10px] text-text-muted">
                          {Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min ago
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => printOrder(order)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center text-text-muted hover:text-primary transition-colors">🖨️</button>
                          
                          {nextStatus[order.status] && (
                            <button 
                              onClick={() => updateStatus(order._id, nextStatus[order.status])} 
                              className="text-[10px] bg-primary text-white px-3 py-1.5 rounded-full font-bold hover:bg-primary-dark transition-all hover:scale-105 shadow-md shadow-primary/20 flex items-center gap-1"
                            >
                              Move to {nextStatus[order.status]} ➔
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .animate-pulse-subtle { animation: pulse-subtle 2s infinite; }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
      `}</style>
    </div>
  )
}