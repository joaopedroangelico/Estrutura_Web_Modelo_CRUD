import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CadastroVeiculos from './pages/CadastroVeiculos'
import EditarVeiculo from './pages/EditarVeiculo'
import Funcionarios from './pages/Funcionarios'
import Itens from './pages/Itens'
import Servicos from './pages/Servicos'

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

const usuarioTagStyle = {
  color: '#bfdbfe',
  fontSize: '13px',
  marginRight: '4px',
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('usuario_logado') || '{}')

  const isActive = (path) => location.pathname === path

  const handleSair = () => {
    localStorage.removeItem('usuario_logado')
    navigate('/')
  }

  return (
    <nav style={navbarStyle}>
      <Link to="/dashboard" style={navBrandStyle}>
        Mecânica
      </Link>
      <div style={navLinksStyle}>
        <Link to="/dashboard" style={isActive('/dashboard') ? navLinkActiveStyle : navLinkStyle}>
          Dashboard
        </Link>
        <Link to="/cadastro-veiculo" style={isActive('/cadastro-veiculo') ? navLinkActiveStyle : navLinkStyle}>
          Nova OS
        </Link>
        {user.nome && (
          <span style={usuarioTagStyle}>| {user.nome}</span>
        )}
        <button style={sairBtnStyle} onClick={handleSair}>
          Sair
        </button>
      </div>
    </nav>
  )
}

function BotoesFlutantes() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname === '/') return null

  const btnBase = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.15s',
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 200,
    }}>
      <button
        style={{ ...btnBase, backgroundColor: isActive('/funcionarios') ? '#1d4ed8' : '#3b82f6', color: '#fff' }}
        onClick={() => navigate('/funcionarios')}
      >
        👷 Funcionários
      </button>
      <button
        style={{ ...btnBase, backgroundColor: isActive('/itens') ? '#0f766e' : '#0d9488', color: '#fff' }}
        onClick={() => navigate('/itens')}
      >
        🔩 Itens
      </button>
      <button
        style={{ ...btnBase, backgroundColor: isActive('/servicos') ? '#7c3aed' : '#8b5cf6', color: '#fff' }}
        onClick={() => navigate('/servicos')}
      >
        📋 Serviços
      </button>
    </div>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const isLogin = location.pathname === '/'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {!isLogin && <Navbar />}
      <main>{children}</main>
      {!isLogin && <BotoesFlutantes />}
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
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/itens" element={<Itens />} />
          <Route path="/servicos" element={<Servicos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
