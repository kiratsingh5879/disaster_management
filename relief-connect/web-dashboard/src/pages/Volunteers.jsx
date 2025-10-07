import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE

export default function Volunteers(){
  const [lon, setLon] = useState('77.6')
  const [lat, setLat] = useState('12.97')
  const [vols, setVols] = useState([])
  const token = localStorage.getItem('token')

  async function search(){
    const r = await axios.get(API + `/api/volunteers/nearby?lon=${lon}&lat=${lat}&withinKm=20`, { headers: { Authorization: `Bearer ${token}` } })
    setVols(r.data.data)
  }

  useEffect(()=>{ /* optionally auto search */ },[])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Volunteers Nearby</h2>
      <div className="flex gap-2 mb-3">
        <input className="border p-2" value={lon} onChange={e=>setLon(e.target.value)} placeholder="Lon" />
        <input className="border p-2" value={lat} onChange={e=>setLat(e.target.value)} placeholder="Lat" />
        <button className="bg-blue-600 text-white px-3" onClick={search}>Search</button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Skills</th>
            <th className="p-2 border">Available</th>
          </tr>
        </thead>
        <tbody>
          {vols.map(v => (
            <tr key={v._id} className="border-b">
              <td className="p-2 border">{v.userId}</td>
              <td className="p-2 border">{(v.skills||[]).join(', ')}</td>
              <td className="p-2 border">{String(v.available)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
