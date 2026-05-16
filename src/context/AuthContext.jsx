'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem('oveniaa-user')
        if (cached) {
          setUser(JSON.parse(cached))
          setLoading(false)
        }

        // Then fetch fresh data
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
          localStorage.setItem('oveniaa-user', JSON.stringify(data.user))
        } else {
          setUser(null)
          localStorage.removeItem('oveniaa-user')
        }
      } catch {
        setUser(null)
        localStorage.removeItem('oveniaa-user')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) {
      setUser(data.user)
      localStorage.setItem('oveniaa-user', JSON.stringify(data.user))
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    return { success: data.success, error: data.error }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    localStorage.removeItem('oveniaa-user')
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}