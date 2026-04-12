import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3001'

const pageStyle = {
  minHeight: '100vh',
  backgroundColor: '#f1f5f9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'system-ui, sans-serif',
}

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  padding: '48px 40px',
  width: '100%',
  maxWidth: '400px',
}

const headerStyle = {
  textAlign: 'center',
  marginBottom: '32px',
}

const titleStyle = {
  fontSize: '26px',
  fontWeight: '700',
  color: '#1e3a5f',
  margin: '0 0 6px 0',
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#64748b',
  margin: 0,
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111827',
  backgroundColor: '#f9fafb',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border 0.15s',
}

const fieldStyle = {
  marginBottom: '20px',
}

const btnStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '8px',
  letterSpacing: '0.3px',
}

const errorStyle = {
  backgroundColor: '#fee2e2',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#b91c1c',
  fontSize: '13px',
  marginBottom: '16px',
}

export default function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha usuário e senha.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.erro || 'Usuário ou senha inválidos.')
        return
      }
      localStorage.setItem('usuario_logado', JSON.stringify(data))
      navigate('/dashboard')
    } catch {
      setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Oficina Mecânica</h1>
          <p style={subtitleStyle}>Sistema de Gestão de Serviços</p>
        </div>

        {erro && <div style={errorStyle}>{erro}</div>}

        <div style={fieldStyle}>
          <label style={labelStyle}>Usuário</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Senha</label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '20px', marginBottom: 0 }}>
          Admin: admin / 1234 &nbsp;|&nbsp; Mecânico: carlos / 1234
        </p>
      </div>
    </div>
  )
}
