'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/dashboard'
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || 'Adventurer' },
          },
        })
        if (error) throw error
        window.location.href = '/dashboard'
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-magic/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-action-glow/5 blur-3xl" />
      </div>

      <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-magic mb-2">
            Quest Forge
          </h1>
          <p className="text-text-secondary text-sm">
            {isLogin ? 'Welcome back, Adventurer' : 'Begin your journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your hero name"
                className="w-full px-4 py-3 rounded-xl bg-bg-primary/80 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-magic focus:ring-1 focus:ring-magic/30 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adventurer@questforge.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-bg-primary/80 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-magic focus:ring-1 focus:ring-magic/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-bg-primary/80 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-magic focus:ring-1 focus:ring-magic/30 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-action-glow text-white font-semibold hover:bg-action-glow-dim glow-action transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {isLogin ? 'Entering...' : 'Creating...'}
              </span>
            ) : (
              isLogin ? 'Enter the Realm' : 'Forge Your Character'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            className="text-sm text-magic hover:text-magic-dim transition-colors"
          >
            {isLogin ? "Don't have an account? Begin your quest" : 'Already an adventurer? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
