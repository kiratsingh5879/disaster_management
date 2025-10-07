import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE

export default function Moderation(){
  const [reports, setReports] = useState([])
  const token = localStorage.getItem('token')

  async function load(){
    const r = await axios.get(API + '/api/reports')
    setReports(r.data.data)
  }

  useEffect(() => { load() }, [])

  async function setVerified(id, verified){
    await axios.post(API + `/api/moderation/${id}/verify`, { verified }, { headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Moderation Queue</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id} className="border-b">
              <td className="p-2 border">{r.category}</td>
              <td className="p-2 border">{r.description}</td>
              <td className="p-2 border">{r.status}</td>
              <td className="p-2 border">
                <button className="px-2 py-1 bg-green-600 text-white mr-2" onClick={()=>setVerified(r._id, true)}>Verify</button>
                <button className="px-2 py-1 bg-yellow-600 text-white mr-2" onClick={()=>setVerified(r._id, false)}>Unverify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
