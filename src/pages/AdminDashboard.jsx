import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot, setDoc, doc, query, where, getDocs, updateDoc } from 'firebase/firestore'

function RateEditor() {
  const [rates, setRates] = useState({})
  useEffect(() => {
    const rRef = doc(db, 'meta', 'rates')
    const unsub = onSnapshot(rRef, d => { if (d.exists()) setRates(d.data()) })
    return () => unsub()
  }, [])

  const setRate = async (type, val) => {
    await setDoc(doc(db, 'meta', 'rates'), { [type]: Number(val) }, { merge: true })
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Rates</h3>
      <div className="grid gap-2">
        {Object.entries(rates).map(([t, v]) => (
          <div key={t} className="flex gap-2 items-center">
            <div className="w-28">{t}</div>
            <input className="p-2 border rounded flex-1" value={v} onChange={e => setRate(t, e.target.value)} />
          </div>
        ))}
        <AddRate />
      </div>
    </div>
  )
}

function AddRate() {
  const [t, setT] = useState('')
  const [v, setV] = useState(0)
  const add = async () => {
    if (!t) return
    await setDoc(doc(db, 'meta', 'rates'), { [t]: Number(v) }, { merge: true })
    setT(''); setV(0)
  }
  return (
    <div className="flex gap-2">
      <input value={t} onChange={e => setT(e.target.value)} placeholder="type" className="p-2 border rounded" />
      <input value={v} onChange={e => setV(e.target.value)} type="number" className="p-2 border rounded w-28" />
      <button onClick={add} className="px-3 py-2 border rounded">Add</button>
    </div>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const unsubU = onSnapshot(collection(db, 'users'), s => setUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    const unsubJ = onSnapshot(collection(db, 'jobs'), s => setJobs(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => { unsubU(); unsubJ(); }
  }, [])

  const oneClickPayout = async () => {
    const q = query(collection(db, 'jobs'), where('status', '==', 'completed'))
    const snap = await getDocs(q)
    if (snap.empty) return alert('No completed jobs')
    const byUser = {}
    snap.forEach(d => {
      const data = d.data(); byUser[data.assignedTo] = byUser[data.assignedTo] || []; byUser[data.assignedTo].push({ id: d.id, ...data })
    })
    for (const uid of Object.keys(byUser)) {
      const payoutRef = doc(collection(db, 'payouts'))
      const jobsForUser = byUser[uid]
      const total = jobsForUser.length * 60
      await setDoc(payoutRef, { employeeId: uid, jobCount: jobsForUser.length, total, createdAt: serverTimestamp() })
      for (const j of jobsForUser) {
        await updateDoc(doc(db, 'jobs', j.id), { status: 'paid' })
      }
    }
    alert('Payout records created and jobs marked paid (demo). Connect Stripe for real payouts.')
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin</h2>
      <RateEditor />
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Jobs</h3>
        <div className="space-y-2">
          {jobs.map(j => (
            <div key={j.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{j.title || 'Untitled'}</div>
                <div className="text-sm text-slate-500">Assigned: {j.assignedTo} • Type: {j.type}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateDoc(doc(db, 'jobs', j.id), { status: 'open' })} className="px-3 py-1 border rounded">Re-open</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={oneClickPayout} className="px-4 py-2 bg-sky-600 text-white rounded">One-click payouts</button>
        <button className="px-4 py-2 border rounded">Export CSV</button>
      </div>
    </div>
  )
}
