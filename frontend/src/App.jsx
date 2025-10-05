import React, { useMemo } from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import UploadPage from './pages/UploadPage.jsx'

// 本番は VITE_API_BASE、開発は Vite proxy
const apiBase = import.meta.env.PROD ? (import.meta.env.VITE_API_BASE || '') : ''

export default function App() {
  const { pathname } = useLocation()

  const header = useMemo(() => (
    <header className="sticky top-0 z-50 border-b border-line glass">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand grid place-items-center font-extrabold text-black">DN</div>
          <div className="font-bold tracking-wide">Delivery Navigator</div>
        </div>
        <nav className="hidden sm:flex items-center gap-2">
          <NavLink
            to="/"
            className={({isActive}) =>
              `px-3 py-1.5 rounded-full border text-sm ${isActive ? 'border-brand text-brand' : 'border-line hover:border-brand hover:text-brand'}`
            }
            end
          >ホーム</NavLink>

          <NavLink
            to="/upload"
            className={({isActive}) =>
              `px-3 py-1.5 rounded-full border text-sm ${isActive ? 'border-brand text-brand' : 'border-line hover:border-brand hover:text-brand'}`
            }
          >読み込み</NavLink>

          <a className="px-3 py-1.5 rounded-full border border-line text-sm hover:border-brand hover:text-brand">記録</a>
        </nav>
      </div>
    </header>
  ), [])

  return (
    <div className="min-h-screen">
      {header}

      <Routes>
        <Route path="/" element={<HomePage apiBase={apiBase} />} />
        <Route path="/upload" element={<UploadPage apiBase={apiBase} />} />
      </Routes>

      <footer className="border-t border-line mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-mute text-sm">
          © {new Date().getFullYear()} Delivery Navigator
        </div>
      </footer>
    </div>
  )
}
