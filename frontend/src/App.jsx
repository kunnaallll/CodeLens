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
    const messages = []
    function collectMessages(value) {
      if (typeof value === 'string') messages.push(value)
      else if (Array.isArray(value)) value.forEach(collectMessages)
      else if (value && typeof value === 'object') Object.values(value).forEach(collectMessages)
    }
    collectMessages(payload)
    const error = new Error(messages.join(' ') || `Request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`)
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
  const [path, setPath] = useState(window.location.pathname)
  const [algorithmResult, setAlgorithmResult] = useState(null)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(nextPath, replace = false) {
    if (replace) window.history.replaceState({}, '', nextPath)
    else window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  useEffect(() => {
    if (!tokens?.access) return
    let active = true
    let refreshing = false
    async function loadProfile() {
      try {
        const profile = await request('/api/auth/profile/', { headers: { Authorization: `Bearer ${tokens.access}` } })
        if (active) setUser(profile)
      } catch (profileError) {
        if (profileError.status === 401 && tokens.refresh) {
          try {
            const refreshed = await request('/api/auth/token/refresh/', {
              method: 'POST', body: JSON.stringify({ refresh: tokens.refresh }),
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

  useEffect(() => {
    const nextPath = !loading && !user && path === '/dashboard'
      ? '/login'
      : !loading && user && (path === '/' || path === '/login') ? '/dashboard' : null
    if (nextPath) {
      window.history.replaceState({}, '', nextPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [loading, user, path])

  useEffect(() => {
    if (!user || path !== '/dashboard' || !tokens?.access) return
    let active = true
    request('/api/algorithms/', { headers: { Authorization: `Bearer ${tokens.access}` } })
      .then((payload) => {
        if (!Array.isArray(payload)) throw new Error('The algorithms endpoint returned an unexpected response format.')
        if (active) setAlgorithmResult({ algorithms: payload, error: '' })
      })
      .catch((fetchError) => {
        if (active) {
          const message = fetchError.status === 401 ? 'Your session has expired. Please sign in again.' : fetchError.message || 'Unable to load algorithms right now.'
          setAlgorithmResult({ algorithms: [], error: message })
          if (fetchError.status === 401) {
            sessionStorage.removeItem(TOKEN_KEY)
            setTokens(null)
            setUser(null)
            window.history.replaceState({}, '', '/login')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        }
      })
    return () => { active = false }
  }, [user, path, tokens])

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
        method: 'POST', body: JSON.stringify({ username: values.username, password: values.password }),
      })
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify(result))
    setTokens(result)
    setAlgorithmResult(null)
    setLoading(true)
    } catch (err) { setError(err.message) }
  }

  function signOut() {
    sessionStorage.removeItem(TOKEN_KEY)
    setTokens(null)
    setUser(null)
    setAlgorithmResult(null)
    setLoading(false)
    navigate('/login', true)
  }

  if (loading) return <main className="auth-shell"><p className="loading">Loading your account…</p></main>

  if (user && path === '/dashboard') return (
    <Dashboard user={user} algorithms={algorithmResult?.algorithms || []} loading={!algorithmResult} error={algorithmResult?.error || ''} onSignOut={signOut} />
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

function Dashboard({ user, algorithms, loading, error, onSignOut }) {
  const name = user.first_name || user.username
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <a className="dashboard-brand" href="/dashboard"><span className="brand-mark">C</span><span>CodeLens</span></a>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="selected" href="/dashboard"><span>▦</span> Overview</a>
          <a href="#algorithms"><span>⌘</span> Algorithms</a>
          <a href="#progress"><span>◷</span> My progress</a>
        </nav>
        <div className="sidebar-bottom"><div className="profile-mini"><span className="avatar">{name.slice(0, 1).toUpperCase()}</span><span><strong>{name}</strong><small>{user.role || 'student'}</small></span></div><button className="sidebar-logout" onClick={onSignOut}>Sign out</button></div>
      </aside>
      <main className="dashboard-main">
        <header className="topbar"><span>Workspace <b>/</b> Overview</span><div className="topbar-user"><span className="avatar">{name.slice(0, 1).toUpperCase()}</span><span>{name}</span><button onClick={onSignOut}>Log out</button></div></header>
        <div className="dashboard-content">
          <section className="welcome-banner">
            <div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Welcome back, {name} <span>✦</span></h1><p>Ready to make your next algorithm click?</p></div>
            <div className="banner-art" aria-hidden="true"><span>〈</span><i>•••<br />{`{ }`}<br />→</i><span>〉</span></div>
          </section>
          <section className="stats-grid" aria-label="Learning overview">
            <article className="stat-card"><span className="stat-icon purple">⌘</span><span className="stat-label">Available algorithms</span><strong>{loading ? '—' : algorithms.length}</strong><small>Ready to explore</small></article>
            <article className="stat-card"><span className="stat-icon mint">✓</span><span className="stat-label">Challenges completed</span><strong>—</strong><small>Challenge tracking coming soon</small></article>
            <article className="stat-card"><span className="stat-icon amber">◷</span><span className="stat-label">Learning progress</span><strong>—</strong><small>Your progress will appear here</small></article>
          </section>
          <section id="progress" className="progress-placeholder"><div><p className="section-kicker">KEEP YOUR MOMENTUM</p><h2>Your learning journey</h2><p>As you explore algorithms, your progress will take shape here.</p></div><div className="journey-mark" aria-hidden="true">↗</div></section>
          <section id="algorithms" className="algorithms-section">
            <div className="section-heading"><div><p className="section-kicker">LEARN BY DOING</p><h2>Explore algorithms</h2><p>Build intuition for the ideas behind the code.</p></div><span className="count-pill">{loading ? 'Loading' : `${algorithms.length} ${algorithms.length === 1 ? 'algorithm' : 'algorithms'}`}</span></div>
            {loading && <div className="state-panel" role="status"><span className="spinner" /> Loading algorithms…</div>}
            {!loading && error && <div className="state-panel api-error" role="alert"><strong>We couldn’t load the algorithms.</strong><span>{error}</span></div>}
            {!loading && !error && algorithms.length === 0 && <div className="state-panel">No algorithms are available yet. Check back soon.</div>}
            {!loading && !error && algorithms.length > 0 && <div className="algorithm-grid">{algorithms.map((algorithm) => <AlgorithmCard key={algorithm.id} algorithm={algorithm} />)}</div>}
          </section>
        </div>
      </main>
    </div>
  )
}

function AlgorithmCard({ algorithm }) {
  return <article className="algorithm-card"><div className="algorithm-card-top"><span className="algorithm-symbol">{algorithm.name.slice(0, 1).toUpperCase()}</span><span className="category-chip">{algorithm.category}</span></div><h3>{algorithm.name}</h3><p>{algorithm.description}</p><div className="complexities"><span><small>TIME</small><strong>{algorithm.time_complexity}</strong></span><span><small>SPACE</small><strong>{algorithm.space_complexity}</strong></span></div><button type="button" className="card-action" aria-label={`Explore ${algorithm.name}`}>Explore algorithm <span>→</span></button></article>
}

export default App
