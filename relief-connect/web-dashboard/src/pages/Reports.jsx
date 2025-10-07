import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import io from 'socket.io-client'

export default function Reports(){
  const [reports, setReports] = useState([])

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE
    axios.get(base + '/api/reports').then(r => setReports(r.data.data)).catch(()=>{})
    const sock = io(base, { transports: ['websocket', 'polling'] })
    sock.on('report:new', ({ report }) => setReports(prev => [report, ...prev].slice(0, 500)))
    sock.on('report:verify', ({ reportId, verified }) => setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: verified ? 'verified' : 'unverified' } : r)))
    return () => sock.close()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Reports</h2>
      <div style={{ height: 500 }}>
        <MapContainer center={[12.97,77.59]} zoom={12} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {reports.map(r => (
            <Marker key={r._id} position={[r.location.coordinates[1], r.location.coordinates[0]]}>
              <Popup>
                <div>
                  <div className="font-semibold">{r.category}</div>
                  <div className="text-sm">{r.description}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
