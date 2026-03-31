import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CadastroVeiculos from './pages/CadastroVeiculos'
import EditarVeiculo from './pages/EditarVeiculo'

const navbarStyle = {
  backgroundColor: '#1e40af',
  padding: '0 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '60px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
}

const navBrandStyle = {
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '18px',
  textDecoration: 'none',
  letterSpacing: '0.5px',
}

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const navLinkStyle = {
  color: '#bfdbfe',
  textDecoration: 'none',
  padding: '6px 14px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background 0.15s',
}

const navLinkActiveStyle = {
  ...navLinkStyle,
  backgroundColor: '#2563eb',
  color: '#ffffff',
}

const sairBtnStyle = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  padding: '6px 16px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  marginLeft: '8px',
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleSair = () => {
    navigate('/')
  }

  return (
    <nav style={navbarStyle}>
      <Link to="/dashboard" style={navBrandStyle}>
        Mecanica
      </Link>
      <div style={navLinksStyle}>
        <Link
          to="/dashboard"
          style={isActive('/dashboard') ? navLinkActiveStyle : navLinkStyle}
        >
          Dashboard
        </Link>
        <Link
          to="/cadastro-veiculo"
          style={isActive('/cadastro-veiculo') ? navLinkActiveStyle : navLinkStyle}
        >
          Cadastrar
        </Link>
        <button style={sairBtnStyle} onClick={handleSair}>
          Sair
        </button>
      </div>
    </nav>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const isLogin = location.pathname === '/'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {!isLogin && <Navbar />}
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastro-veiculo" element={<CadastroVeiculos />} />
          <Route path="/editar/:id" element={<EditarVeiculo />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}