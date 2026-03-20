import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function App() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {isLoggedIn && (
        <nav style={{
          background: '#3b82f6',
          padding: '1rem',
          color: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
              Mecânica
            </Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/cadastro" style={{ color: 'white', textDecoration: 'none' }}>Cadastrar</Link>
            <Link to="/editar/1" style={{ color: 'white', textDecoration: 'none' }}>Editar</Link>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: 'auto',
                background: '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </nav>
      )}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default App
