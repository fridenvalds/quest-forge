'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <nav className="glass-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x2694;&#xFE0F;</span>
            <h1 className="font-heading text-xl font-bold text-magic">
              Quest Forge
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/dashboard"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/actions"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Actions
            </a>
            <a
              href="/dashboard/history"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              History
            </a>
            <button
              onClick={handleSignOut}
              className="text-sm text-text-muted hover:text-danger transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
