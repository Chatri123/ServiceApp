import React from 'react'

export default function Header({ profile, onSignOut }) {
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-sky-600">ServiceOps</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">{profile.email}</div>
          <button onClick={onSignOut} className="px-3 py-1 border rounded">Sign out</button>
        </div>
      </div>
    </header>
  )
}
