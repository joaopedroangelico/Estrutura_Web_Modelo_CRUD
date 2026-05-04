import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const FUNCOES = ['atendente', 'mecanico', 'gerente', 'outro']

const pageStyle = {
  padding: '32px',
  maxWidth: '960px',
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
  paddingBottom: '100px',
}

const ROLE_CORES = {
  admin:       { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  funcionario: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
}

const FUNCAO_CORES = {
  atendente: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  mecanico:  { bg: '#ede9fe', color: '#5b21b6', border: '#c4b5fd' },
  gerente:   { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  outro:     { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
}

function Badge({ texto, cores }) {
  const c = cores[texto] || cores['outro'] || {}
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: '20px',
      padding: '3px 12px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    }}>{texto}</span>
  )
}

const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111827',
  backgroundColor: '#f9fafb',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '4px',
  display: 'block',
}

const selectStyle = { ...inputStyle, cursor: 'pointer' }

export default function Funcionarios() {
  const user = JSON.parse(localStorage.getItem('usuario_logado') || '{}')
  const isAdmin = user.role === 'admin'

  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null) // null | 'novo' | { ...funcionario }
  const [form, setForm] = useState({ nome: '', usuario: '', senha: '', funcao: 'atendente', role: 'funcionario' })
  const [salvando, setSalvando] = useState(false)
  const [msgModal, setMsgModal] = useState('')

  const carregar = () => {
    setLoading(true)
    fetch(`${API_URL}/funcionarios`)
      .then((r) => r.json())
      .then((data) => { setFuncionarios(data); setLoading(false) })
      .catch(() => { setErro('Erro ao carregar funcionários.'); setLoading(false) })
  }

  useEffect(() => { carregar() }, [])

  const abrirNovo = () => {
    setForm({ nome: '', usuario: '', senha: '', funcao: 'atendente', role: 'funcionario' })
    setMsgModal('')
    setModal('novo')
  }

  const abrirEditar = (f) => {
    setForm({ nome: f.nome, usuario: f.usuario, senha: '', funcao: f.funcao, role: f.role, id: f.id })
    setMsgModal('')
    setModal('editar')
  }

  const handleSalvar = async () => {
    if (!form.nome || !form.usuario || (!form.id && !form.senha) || !form.funcao) {
      setMsgModal('Preencha todos os campos obrigatórios.')
      return
    }
    setSalvando(true)
    setMsgModal('')
    try {
      const url = modal === 'novo' ? `${API_URL}/funcionarios` : `${API_URL}/funcionarios/${form.id}`
      const method = modal === 'novo' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar.')
      carregar()
      setModal(null)
    } catch (err) {
      setMsgModal(err.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return
    try {
      const res = await fetch(`${API_URL}/funcionarios/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro)
      carregar()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a5f', margin: 0 }}>Funcionários</h1>
        {isAdmin && (
          <button onClick={abrirNovo} style={{
            backgroundColor: '#3b82f6', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '10px 22px', fontSize: '14px',
            fontWeight: '700', cursor: 'pointer',
          }}>
            + Novo Funcionário
          </button>
        )}
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px',
          padding: '12px 16px', color: '#b91c1c', marginBottom: '20px' }}>{erro}</div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Carregando...</div>
      ) : funcionarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Nenhum funcionário cadastrado.</div>
      ) : (
        funcionarios.map((f) => (
          <div key={f.id} style={{
            backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            padding: '18px 24px', marginBottom: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '15px' }}>{f.nome}</span>
                <Badge texto={f.funcao} cores={FUNCAO_CORES} />
                <Badge texto={f.role} cores={ROLE_CORES} />
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '20px' }}>
                <span><strong style={{ color: '#374151' }}>Usuário:</strong> {f.usuario}</span>
                <span><strong style={{ color: '#374151' }}>Desde:</strong> {f.criado_em}</span>
              </div>
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => abrirEditar(f)} style={{
                  backgroundColor: '#3b82f6', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>Editar</button>
                <button onClick={() => handleExcluir(f.id)} style={{
                  backgroundColor: '#ef4444', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>Excluir</button>
              </div>
            )}
          </div>
        ))
      )}

      {/* MODAL */}
      {modal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setModal(null)}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', padding: '36px',
            width: '100%', maxWidth: '460px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e3a5f' }}>
                {modal === 'novo' ? 'Novo Funcionário' : 'Editar Funcionário'}
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8',
              }}>×</button>
            </div>

            {msgModal && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px',
                padding: '10px 14px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>{msgModal}</div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome Completo *</label>
                <input style={inputStyle} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Usuário *</label>
                <input style={inputStyle} value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  disabled={modal === 'editar'} />
              </div>
              <div>
                <label style={labelStyle}>{modal === 'editar' ? 'Nova Senha (opcional)' : 'Senha *'}</label>
                <input style={inputStyle} type="password" value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  placeholder={modal === 'editar' ? 'Deixe em branco para manter' : ''} />
              </div>
              <div>
                <label style={labelStyle}>Função *</label>
                <select style={selectStyle} value={form.funcao}
                  onChange={(e) => setForm({ ...form, funcao: e.target.value })}>
                  {FUNCOES.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nível de Acesso *</label>
                <select style={selectStyle} value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="funcionario">Funcionário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setModal(null)} style={{
                backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #d1d5db',
                borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleSalvar} disabled={salvando} style={{
                backgroundColor: '#3b82f6', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', opacity: salvando ? 0.7 : 1,
              }}>{salvando ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
