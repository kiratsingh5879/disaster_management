import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard.jsx'
import Reports from './pages/Reports.jsx'
import Login from './pages/Login.jsx'

const qc = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <nav className="p-3 border-b flex gap-3">
          <Link to="/">Dashboard</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
