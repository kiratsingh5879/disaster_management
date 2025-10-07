import React, { useState } from 'react'
import axios from 'axios'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_BASE + '/api/auth/login', { email, password })
      localStorage.setItem('token', data.data.token)
      setMsg('Logged in')
    } catch (e) {
      setMsg('Login failed')
    }
  }

  return (
    <div className="p-4 max-w-md">
      <h2 className="text-xl font-semibold mb-2">Login</h2>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <input className="border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2">Login</button>
      </form>
      <div className="mt-2 text-sm">{msg}</div>
    </div>
  )
}
