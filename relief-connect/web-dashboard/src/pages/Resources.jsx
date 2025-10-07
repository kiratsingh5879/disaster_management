import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE

export default function Resources(){
  const [resources, setResources] = useState([])
  const [type, setType] = useState('shelter')
  const [capacity, setCapacity] = useState('100')
  const [lon, setLon] = useState('77.6')
  const [lat, setLat] = useState('12.97')
  const token = localStorage.getItem('token')

  async function load(){
    const r = await axios.get(API + '/api/resources', { headers: { Authorization: `Bearer ${token}` } })
    setResources(r.data.data)
  }

  useEffect(()=>{ load() },[])

  async function add(){
    await axios.post(API + '/api/resources', {
      type,
      capacity: Number(capacity),
      available: Number(capacity),
      location: { type: 'Point', coordinates: [Number(lon), Number(lat)] }
    }, { headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Resources</h2>
      <div className="flex gap-2 mb-3">
        <select className="border p-2" value={type} onChange={e=>setType(e.target.value)}>
          <option value="shelter">shelter</option>
          <option value="food">food</option>
          <option value="fuel">fuel</option>
          <option value="medical">medical</option>
        </select>
        <input className="border p-2" value={capacity} onChange={e=>setCapacity(e.target.value)} placeholder="Capacity" />
        <input className="border p-2" value={lon} onChange={e=>setLon(e.target.value)} placeholder="Lon" />
        <input className="border p-2" value={lat} onChange={e=>setLat(e.target.value)} placeholder="Lat" />
        <button className="bg-green-600 text-white px-3" onClick={add}>Add</button>
      </div>
      <ul className="list-disc pl-5">
        {resources.map(r => (
          <li key={r._id}>{r.type} – available {r.available}</li>
        ))}
      </ul>
    </div>
  )
}
