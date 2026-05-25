import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CadastroVeiculos from './pages/CadastroVeiculos'
import EditarVeiculo from './pages/EditarVeiculo'
import Funcionarios from './pages/Funcionarios'
import Itens from './pages/Itens'
import Servicos from './pages/Servicos'

const navbarStyle = {
  backgroundColor: '#1f1f1f',
  padding: '0 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '48px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
}

const navBrandStyle = {
  color: '#ffffff',
  fontWeight: '600',
  fontSize: '15px',
  textDecoration: 'none',
}

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
}

const navLinkStyle = {
  color: '#a0a0a0',
  textDecoration: 'none',
  padding: '5px 12px',
  borderRadius: '2px',
  fontSize: '13px',
  fontWeight: '400',
}

const navLinkActiveStyle = {
  ...navLinkStyle,
  backgroundColor: '#0078d4',
  color: '#ffffff',
}

const sairBtnStyle = {
  backgroundColor: '#d13438',
  color: '#ffffff',
  border: 'none',
  padding: '5px 14px',
  borderRadius: '2px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  marginLeft: '8px',
}

const usuarioTagStyle = {
  color: '#a0a0a0',
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
        Oficina Mecanica
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
    padding: '8px 16px',
    borderRadius: '2px',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    whiteSpace: 'nowrap',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 200,
    }}>
      <button
        style={{ ...btnBase, backgroundColor: isActive('/funcionarios') ? '#005a9e' : '#0078d4', color: '#fff' }}
        onClick={() => navigate('/funcionarios')}
      >
        Funcionarios
      </button>
      <button
        style={{ ...btnBase, backgroundColor: isActive('/itens') ? '#0e6b0e' : '#107c10', color: '#fff' }}
        onClick={() => navigate('/itens')}
      >
        Itens
      </button>
      <button
        style={{ ...btnBase, backgroundColor: isActive('/servicos') ? '#005a9e' : '#0078d4', color: '#fff' }}
        onClick={() => navigate('/servicos')}
      >
        Servicos
      </button>
    </div>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const isLogin = location.pathname === '/'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f3f3', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
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
