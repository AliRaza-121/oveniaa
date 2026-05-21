'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, menu: 0, categories: 0, revenue: 0, todayOrders: 0, todayRevenue: 0, pending: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [popularItems, setPopularItems] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [unavailableItems, setUnavailableItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStats(d.stats)
          setMonthlyData(d.monthlyData)
          setPopularItems(d.popularItems || [])
          setRecentOrders(d.recentOrders || [])
          setUnavailableItems(d.unavailableItems)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const filteredMonthly = monthlyData.filter(d => d.year === selectedYear && d.month === selectedMonth)
  const currentMonthData = filteredMonthly[0] || { orders: 0, revenue: 0 }
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1)

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/menu" className="bg-card border border-border hover:border-primary text-text px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-primary/10 flex items-center gap-2">
            🍕 Add Item
          </Link>
          <Link href="/admin/deals" className="bg-card border border-border hover:border-secondary text-text px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-secondary/10 flex items-center gap-2">
            ⚡ Deals
          </Link>
          <Link href="/admin/settings" className="bg-card border border-border hover:border-purple-500 text-text px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
            ⚙️ Settings
          </Link>
        </div>
      </div>

      {unavailableItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">⚠️ Low Stock / Unavailable Items</h3>
          <div className="flex flex-wrap gap-2">
            {unavailableItems.map(i => (
              <Link key={i._id} href="/admin/menu" className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors">{i.name}</Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Today's Metrics - Visually Popping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-bg border border-primary/30 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-primary/5">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 blur-sm">💰</div>
          <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Revenue Today</p>
          <p className="text-3xl font-black text-text">Rs. {stats.todayRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-secondary/20 to-bg border border-secondary/30 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-secondary/5">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 blur-sm">🛒</div>
          <p className="text-sm font-bold text-secondary mb-1 uppercase tracking-wider">Orders Today</p>
          <p className="text-3xl font-black text-text">{stats.todayOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-bg border border-yellow-500/30 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-yellow-500/5">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 blur-sm">⏳</div>
          <p className="text-sm font-bold text-yellow-400 mb-1 uppercase tracking-wider">Pending Orders</p>
          <p className="text-3xl font-black text-text">{stats.pending}</p>
          {stats.pending > 0 && <Link href="/admin/orders" className="absolute top-6 right-6 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold hover:bg-yellow-500/30 transition-colors">View</Link>}
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-bg border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-purple-500/5">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 blur-sm">🍕</div>
          <p className="text-sm font-bold text-purple-400 mb-1 uppercase tracking-wider">Active Menu</p>
          <p className="text-3xl font-black text-text">{stats.menu} Items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Chart + Recent Orders) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-lg font-bold">Revenue Overview</h2>
                <p className="text-sm text-text-muted mt-1">Monthly performance tracking</p>
              </div>
              <div className="flex gap-2">
                <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="bg-bg text-text border border-border rounded-xl px-3 py-2 text-sm focus:border-primary outline-none transition-colors">
                  {monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="bg-bg text-text border border-border rounded-xl px-3 py-2 text-sm focus:border-primary outline-none transition-colors">
                  {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Current Month Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-bg rounded-2xl border border-border/50">
              <div className="text-center sm:text-left">
                <p className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Month Rev.</p>
                <p className="text-sm sm:text-lg font-bold text-emerald-400">Rs. {currentMonthData.revenue.toLocaleString()}</p>
              </div>
              <div className="text-center sm:border-l sm:border-border sm:pl-4">
                <p className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Month Orders</p>
                <p className="text-sm sm:text-lg font-bold text-primary">{currentMonthData.orders}</p>
              </div>
              <div className="text-center sm:border-l sm:border-border sm:pl-4">
                <p className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Avg Order</p>
                <p className="text-sm sm:text-lg font-bold text-secondary">{currentMonthData.orders > 0 ? `Rs. ${Math.round(currentMonthData.revenue / currentMonthData.orders).toLocaleString()}` : '0'}</p>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="flex items-end gap-1 sm:gap-4 h-48 mt-4 relative">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-text w-full"></div>
                <div className="border-t border-text w-full"></div>
                <div className="border-t border-text w-full"></div>
                <div className="border-t border-text w-full"></div>
              </div>

              {monthNames.map((m, i) => {
                const monthData = monthlyData.find(d => d.month === i && d.year === selectedYear)
                const height = monthData ? (monthData.revenue / maxRevenue) * 100 : 0
                const isSelected = i === selectedMonth
                
                return (
                  <div key={m} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10">
                    {/* Tooltip */}
                    {monthData && (
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border shadow-xl rounded-lg px-2 py-1 text-xs whitespace-nowrap z-20 pointer-events-none">
                        Rs. {monthData.revenue.toLocaleString()}
                      </div>
                    )}
                    
                    <div className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 relative overflow-hidden cursor-pointer ${isSelected ? 'bg-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)]' : 'bg-primary/20 hover:bg-primary/40'}`} style={{ height: `${Math.max(height, 2)}%` }} onClick={() => setSelectedMonth(i)}>
                      {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-3 ${isSelected ? 'text-primary font-bold' : 'text-text-muted'}`}>{m}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline font-semibold">View KDS ➔</Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-text-muted">No recent orders found.</div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order._id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 bg-bg border border-border/50 rounded-2xl hover:border-border transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-text-muted">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'preparing' ? 'bg-purple-500/20 text-purple-400' :
                          order.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>{order.status.toUpperCase()}</span>
                      </div>
                      <p className="font-bold text-sm">{order.customerName}</p>
                      <p className="text-xs text-text-muted mt-0.5">{order.items.length} items • {order.orderType}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-primary">Rs. {order.total}</p>
                      <p className="text-[10px] text-text-muted mt-1">{Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area (Leaderboards, Totals) */}
        <div className="space-y-6">
          
          {/* Top Performers */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">🏆 Top Performers <span className="text-xs font-normal text-text-muted ml-auto">(Last 7 Days)</span></h2>
            
            {popularItems.length === 0 ? (
              <div className="text-center py-8 text-text-muted">Not enough data yet.</div>
            ) : (
              <div className="space-y-4">
                {popularItems.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                      index === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
                      'bg-bg text-text-muted'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted">{item.count} sold</span>
                        {item.revenue > 0 && <span className="text-xs text-emerald-400">Rs. {item.revenue.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All-Time Totals */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">All-Time Totals</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-bg rounded-2xl border border-border/30">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-lg">📊</span>
                  <span className="font-medium text-sm">Total Orders</span>
                </div>
                <span className="font-bold">{stats.orders.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-bg rounded-2xl border border-border/30">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-lg">💵</span>
                  <span className="font-medium text-sm">Total Revenue</span>
                </div>
                <span className="font-bold">Rs. {stats.revenue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-bg rounded-2xl border border-border/30">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-lg">📂</span>
                  <span className="font-medium text-sm">Categories</span>
                </div>
                <span className="font-bold">{stats.categories}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}