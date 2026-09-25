import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'codelens.auth'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = Object.values(payload).flat().find((item) => typeof item === 'string')
    const error = new Error(message || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }
  return payload
}

function App() {
  const [tokens, setTokens] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(TOKEN_KEY)) } catch { return null }
  })
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(Boolean(tokens))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!tokens?.access) { setLoading(false); return }
    let active = true
    let refreshing = false
    async function loadProfile() {
      try {
        const profile = await request('/api/auth/profile/', { headers: { Authorization: `Bearer ${tokens.access}` } })
        if (active) setUser(profile)
      } catch (error) {
        if (error.status === 401 && tokens.refresh) {
          try {
            const refreshed = await request('/api/auth/token/refresh/', {
              method: 'POST',
              body: JSON.stringify({ refresh: tokens.refresh }),
            })
            const nextTokens = { ...tokens, ...refreshed }
            sessionStorage.setItem(TOKEN_KEY, JSON.stringify(nextTokens))
            if (active) { refreshing = true; setLoading(true); setTokens(nextTokens) }
            return
          } catch { /* The refresh token has expired; sign in again. */ }
        }
        if (active) {
          sessionStorage.removeItem(TOKEN_KEY)
          setTokens(null)
          setUser(null)
        }
      } finally {
        if (active && !refreshing) setLoading(false)
      }
    }
    loadProfile()
    return () => { active = false }
  }, [tokens])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      if (mode === 'register') {
        await request('/api/auth/register/', {
          method: 'POST',
          body: JSON.stringify({ username: values.username, email: values.email, password: values.password, first_name: values.first_name, last_name: values.last_name }),
        })
      }
      const result = await request('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username: values.username, password: values.password }),
      })
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify(result))
      setTokens(result)
      setLoading(true)
    } catch (err) { setError(err.message) }
  }

  function signOut() {
    sessionStorage.removeItem(TOKEN_KEY)
    setTokens(null)
    setUser(null)
  }

  if (loading) return <main className="auth-shell"><p className="loading">Loading your account…</p></main>

  if (user) return (
    <main className="auth-shell">
      <section className="welcome-card">
        <div className="brand-mark">C</div>
        <p className="eyebrow">CODELENS ACCOUNT</p>
        <h1>Welcome, {user.first_name || user.username}</h1>
        <p className="welcome-copy">You’re signed in as <strong>{user.email}</strong>.</p>
        <span className="role-badge">{user.role}</span>
        <button className="secondary-button" onClick={signOut}>Sign out</button>
      </section>
    </main>
  )

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark">C</div>
        <p className="eyebrow">CODELENS · LEARN BY SEEING</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="intro">{mode === 'login' ? 'Sign in to continue your learning journey.' : 'Start exploring algorithms, one step at a time.'}</p>

        <div className="mode-switch" role="tablist" aria-label="Account action">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError('') }}>Create account</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && <>
            <label>First name<input name="first_name" autoComplete="given-name" /></label>
            <label>Last name<input name="last_name" autoComplete="family-name" /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          </>}
          <label>Username<input name="username" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength="8" required /></label>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="primary-button" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}<span aria-hidden="true">→</span></button>
        </form>
        <p className="account-note">{mode === 'login' ? 'New to CodeLens?' : 'Already have an account?'}{' '}
          <button type="button" className="text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </section>
      <p className="shell-caption">A clearer way to understand what happens inside your code.</p>
    </main>
  )
}

export default App
