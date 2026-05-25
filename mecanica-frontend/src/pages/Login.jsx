import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const pageStyle = {
  minHeight: '100vh',
  backgroundColor: '#f3f3f3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
}

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #d1d1d1',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  padding: '40px 36px',
  width: '100%',
  maxWidth: '360px',
}

const headerStyle = {
  textAlign: 'center',
  marginBottom: '28px',
}

const titleStyle = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#323130',
  margin: '0 0 4px 0',
}

const subtitleStyle = {
  fontSize: '13px',
  color: '#605e5c',
  margin: 0,
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#323130',
  marginBottom: '4px',
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d1d1',
  borderRadius: '2px',
  fontSize: '14px',
  color: '#323130',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
  outline: 'none',
}

const fieldStyle = {
  marginBottom: '16px',
}

const btnStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#0078d4',
  color: '#ffffff',
  border: 'none',
  borderRadius: '2px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '8px',
}

const errorStyle = {
  backgroundColor: '#fde7e9',
  border: '1px solid #d13438',
  borderRadius: '2px',
  padding: '8px 12px',
  color: '#a4262c',
  fontSize: '13px',
  marginBottom: '14px',
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
          <h1 style={titleStyle}>Oficina Mecanica</h1>
          <p style={subtitleStyle}>Sistema de Gestao de Servicos</p>
        </div>

        {erro && <div style={errorStyle}>{erro}</div>}

        <div style={fieldStyle}>
          <label style={labelStyle}>Usuario</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Digite seu usuario"
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

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#a19f9d', marginTop: '16px', marginBottom: 0 }}>
          Admin: admin / 1234 &nbsp;|&nbsp; Mecanico: carlos / 1234
        </p>
      </div>
    </div>
  )
}
