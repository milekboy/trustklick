'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import NetworkInstance from './NetworkInstance'

const AuthContext = createContext({
  user: null,
  token: null,
  login: async p0 => {},
  logout: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
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
        console.log('fetching')
        const res = await networkInstance.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log(res)
        setUser(res.data)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      }
    }

    fetchUser()
  }, [token])

  const login = ({ user: u, token: t }) => {
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
