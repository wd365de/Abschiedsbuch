import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLogin from '../components/Admin/AdminLogin'
import AdminDashboard from '../components/Admin/AdminDashboard'

export default function AdminPage() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Loading
  if (session === undefined) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <AdminLogin />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
