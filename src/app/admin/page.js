'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, menu: 0, categories: 0, revenue: 0, todayOrders: 0, todayRevenue: 0, pending: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [popularItem, setPopularItem] = useState(null)
  const [unavailableItems, setUnavailableItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStats(d.stats)
          setMonthlyData(d.monthlyData)
          setPopularItem(d.popularItem)
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {unavailableItems.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Low Stock / Unavailable</h3>
          <div className="flex flex-wrap gap-2">
            {unavailableItems.map(i => (
              <Link key={i._id} href="/admin/menu" className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full hover:bg-red-500/30 transition-colors">{i.name}</Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">Today's Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Orders Today', value: stats.todayOrders, color: 'text-primary', icon: '🛒' },
            { label: 'Revenue Today', value: `Rs. ${stats.todayRevenue.toLocaleString()}`, color: 'text-emerald-400', icon: '💰' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400', icon: '⏳' },
            { label: 'Menu Items', value: stats.menu, color: 'text-purple-400', icon: '🍕' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <span className="text-2xl">{s.icon}</span>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: stats.orders, color: 'text-primary', icon: '📊' },
          { label: 'Categories', value: stats.categories, color: 'text-blue-400', icon: '📂' },
          { label: 'Total Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, color: 'text-emerald-400', icon: '💵' },
          { label: 'Avg Order', value: stats.orders > 0 ? `Rs. ${Math.round(stats.revenue / stats.orders).toLocaleString()}` : 'Rs. 0', color: 'text-secondary', icon: '📈' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
        {popularItem && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <span className="text-2xl">🏆</span>
            <p className="text-sm font-bold text-text mt-2">{popularItem.name}</p>
            <p className="text-xs text-text-muted mt-1">Most ordered this week • {popularItem.count}x</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Revenue by Month</h2>
          <div className="flex gap-2">
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="bg-bg text-text border border-border rounded-lg px-3 py-1.5 text-xs">
              {monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="bg-bg text-text border border-border rounded-lg px-3 py-1.5 text-xs">
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Orders', value: currentMonthData.orders, color: 'text-primary' },
            { label: 'Revenue', value: `Rs. ${currentMonthData.revenue.toLocaleString()}`, color: 'text-emerald-400' },
            { label: 'Avg Order', value: currentMonthData.orders > 0 ? `Rs. ${Math.round(currentMonthData.revenue / currentMonthData.orders).toLocaleString()}` : 'Rs. 0', color: 'text-secondary' },
            { label: 'Daily Avg', value: currentMonthData.orders > 0 ? `${(currentMonthData.orders / 30).toFixed(1)}` : '0', color: 'text-purple-400' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-text-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-2 h-40">
          {monthNames.map((m, i) => {
            const monthData = monthlyData.find(d => d.month === i && d.year === selectedYear)
            const height = monthData ? (monthData.revenue / maxRevenue) * 100 : 0
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-muted">{monthData ? `${Math.round(monthData.revenue / 1000)}k` : ''}</span>
                <div className="w-full bg-primary/30 rounded-t-lg hover:bg-primary/50 transition-colors cursor-pointer relative" style={{ height: `${Math.max(height, 4)}%` }}>
                  {i === selectedMonth && <div className="absolute inset-0 bg-primary rounded-t-lg" />}
                </div>
                <span className={`text-[10px] ${i === selectedMonth ? 'text-primary font-medium' : 'text-text-muted'}`}>{m}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}