'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import NetworkInstance from './NetworkInstance'

type AuthUser = {
  first_name?: string
  last_name?: string
  email?: string
  image?: string
  [key: string]: any
}

type AuthContextType = {
  user: AuthUser | null
  token: string | null
  login: (data: { user: AuthUser; token: string }) => void
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  setUser: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const networkInstance = NetworkInstance()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem('user')
    const tok = localStorage.getItem('token')
    if (raw) setUser(JSON.parse(raw))
    if (tok) setToken(tok)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')

    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [user, token])

  useEffect(() => {
    if (!token) return

    const fetchUser = async () => {
      try {
        const res = await networkInstance.get('/user', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data.user ?? res.data) // handles both formats
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      }
    }

    fetchUser()
  }, [token])

  const login = ({ user: u, token: t }: { user: AuthUser; token: string }) => {
    setUser(u)
    setToken(t)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return <AuthContext.Provider value={{ user, token, login, logout, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
