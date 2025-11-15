import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase'
import { collection, query, where, onSnapshot, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export default function EmployeeDashboard({ profile }) {
  const [jobs, setJobs] = useState([])
  const [activeClock, setActiveClock] = useState(null)
  const watchRef = useRef(null)
  const activeClockRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'jobs'), where('assignedTo', '==', profile.id))
    const unsub = onSnapshot(q, (snap) => setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [profile.id])

  const startShift = async (job) => {
    if (activeClockRef.current) return alert('Already clocked in')
    const cRef = doc(collection(db, 'clocks'))
    await setDoc(cRef, { employeeId: profile.id, jobId: job.id, startTime: serverTimestamp(), endTime: null, distanceMeters: 0, path: [] })
    activeClockRef.current = { id: cRef.id, distanceMeters: 0, path: [] }
    setActiveClock(activeClockRef.current)

    if (navigator.geolocation) {
      let last = null
      watchRef.current = navigator.geolocation.watchPosition(async (pos) => {
        const { latitude, longitude } = pos.coords
        const now = Date.now()
        if (last) {
          const d = calcDistance(last.latitude, last.longitude, latitude, longitude)
          activeClockRef.current.distanceMeters += d
          activeClockRef.current.path.push({ latitude, longitude, ts: now })
          setActiveClock({ ...activeClockRef.current })
          await updateDoc(doc(db, 'clocks', cRef.id), { distanceMeters: activeClockRef.current.distanceMeters, path: activeClockRef.current.path })
        } else {
          activeClockRef.current.path.push({ latitude, longitude, ts: now })
          setActiveClock({ ...activeClockRef.current })
          await updateDoc(doc(db, 'clocks', cRef.id), { path: activeClockRef.current.path })
        }
        last = { latitude, longitude }
      }, (err) => console.error(err), { enableHighAccuracy: true, maximumAge: 10000 })
    } else alert('Geolocation not supported')
  }

  const endShift = async () => {
    if (!activeClockRef.current) return
    if (watchRef.current && navigator.geolocation) navigator.geolocation.clearWatch(watchRef.current)
    await updateDoc(doc(db, 'clocks', activeClockRef.current.id), { endTime: serverTimestamp() })
    activeClockRef.current = null
    setActiveClock(null)
  }

  const completeJob = async (job) => {
    await updateDoc(doc(db, 'jobs', job.id), { status: 'completed', completedAt: serverTimestamp() })
    alert('Job marked completed')
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Welcome, {profile.email}</h2>
      <div className="mb-4">
        <div className="bg-white p-4 rounded shadow">Status: {activeClock ? 'Clocked in' : 'Clocked out'}</div>
        {activeClock && <div className="mt-2">Distance: {(activeClock.distanceMeters || 0).toFixed(1)} m <button onClick={endShift} className="ml-3 px-3 py-1 border rounded">Clock out</button></div>}
      </div>

      <div className="grid gap-3">
        {jobs.map(j => (
          <div key={j.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-bold">{j.title || 'Untitled'}</div>
              <div className="text-sm text-slate-500">Type: {j.type || 'standard'}</div>
              <div className="text-sm text-slate-500">Status: {j.status || 'open'}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => startShift(j)} className="px-4 py-2 bg-emerald-600 text-white rounded">Clock in</button>
              <button onClick={() => completeJob(j)} className="px-4 py-2 border rounded">Complete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = v => v * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
