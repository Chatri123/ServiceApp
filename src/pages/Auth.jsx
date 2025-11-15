import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const uc = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', uc.user.uid), { email, role, createdAt: serverTimestamp() })
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{isLogin ? 'Sign in' : 'Create account'}</h2>
        <input className="w-full p-3 mb-3 border rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full p-3 mb-3 border rounded" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
        {!isLogin && (
          <select className="w-full p-3 mb-3 border rounded" value={role} onChange={e => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <div className="flex gap-2">
          <button className="flex-1 bg-sky-600 text-white p-3 rounded">{isLogin ? 'Sign in' : 'Create'}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="flex-1 border p-3 rounded">{isLogin ? 'Need account?' : 'Have account?'}</button>
        </div>
      </form>
    </div>
  )
}
