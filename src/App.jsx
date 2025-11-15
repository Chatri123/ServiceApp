import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import Auth from './pages/Auth'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Header from './components/Header'

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const docRef = doc(db, 'users', u.uid)
        const unsubProf = onSnapshot(docRef, (d) => {
          if (d.exists()) setProfile({ id: d.id, ...d.data() })
        })
        return () => unsubProf()
      } else setProfile(null)
    })
    return unsub
  }, [])

  if (!user) return <Auth />
  if (!profile) return <div className="p-6">Loading profile...</div>

  return (
    <div className="min-h-screen">
      <Header profile={profile} onSignOut={() => signOut(auth)} />
      <main className="p-4 max-w-6xl mx-auto">
        {profile.role === 'admin' ? <AdminDashboard profile={profile} /> : <EmployeeDashboard profile={profile} />}
      </main>
    </div>
  )
}
