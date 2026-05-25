import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const FUNCOES = ['atendente', 'mecanico', 'gerente', 'outro']

const pageStyle = {
  padding: '28px 32px',
  maxWidth: '960px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  paddingBottom: '100px',
}

const ROLE_CORES = {
  admin:       { bg: '#fff4ce', color: '#7d5800', border: '#f9c642' },
  funcionario: { bg: '#cce4f7', color: '#004e8c', border: '#0078d4' },
}

const FUNCAO_CORES = {
  atendente: { bg: '#dff6dd', color: '#0e6b0e', border: '#107c10' },
  mecanico:  { bg: '#cce4f7', color: '#004e8c', border: '#0078d4' },
  gerente:   { bg: '#fde7e9', color: '#a4262c', border: '#d13438' },
  outro:     { bg: '#f3f3f3', color: '#605e5c', border: '#d1d1d1' },
}

function Badge({ texto, cores }) {
  const c = cores[texto] || cores['outro'] || {}
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: '2px',
      padding: '2px 10px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    }}>{texto}</span>
  )
}

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d1d1',
  borderRadius: '2px',
  fontSize: '13px',
  color: '#323130',
  backgroundColor: '#ffffff',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#323130',
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
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nome: '', usuario: '', senha: '', funcao: 'atendente', role: 'funcionario', cpf: '', telefone: '', endereco: '' })
  const [salvando, setSalvando] = useState(false)
  const [msgModal, setMsgModal] = useState('')

  const carregar = () => {
    setLoading(true)
    fetch(`${API_URL}/funcionarios`)
      .then((r) => r.json())
      .then((data) => { setFuncionarios(data); setLoading(false) })
      .catch(() => { setErro('Erro ao carregar funcionarios.'); setLoading(false) })
  }

  useEffect(() => { carregar() }, [])

  const abrirNovo = () => {
    setForm({ nome: '', usuario: '', senha: '', funcao: 'atendente', role: 'funcionario', cpf: '', telefone: '', endereco: '' })
    setMsgModal('')
    setModal('novo')
  }

  const abrirEditar = (f) => {
    setForm({ nome: f.nome, usuario: f.usuario, senha: '', funcao: f.funcao, role: f.role, id: f.id, cpf: f.cpf || '', telefone: f.telefone || '', endereco: f.endereco || '' })
    setMsgModal('')
    setModal('editar')
  }

  const handleSalvar = async () => {
    if (!form.nome || !form.usuario || (!form.id && !form.senha) || !form.funcao) {
      setMsgModal('Preencha todos os campos obrigatorios.')
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
    if (!window.confirm('Tem certeza que deseja excluir este funcionario?')) return
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#323130', margin: 0 }}>Funcionarios</h1>
        {isAdmin && (
          <button onClick={abrirNovo} style={{
            backgroundColor: '#107c10', color: '#ffffff', border: 'none',
            borderRadius: '2px', padding: '8px 20px', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer',
          }}>
            + Novo Funcionario
          </button>
        )}
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fde7e9', border: '1px solid #d13438', borderRadius: '2px',
          padding: '10px 14px', color: '#a4262c', fontSize: '13px', marginBottom: '16px' }}>{erro}</div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a19f9d' }}>Carregando...</div>
      ) : funcionarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a19f9d' }}>Nenhum funcionario cadastrado.</div>
      ) : (
        funcionarios.map((f) => (
          <div key={f.id} style={{
            backgroundColor: '#ffffff', border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            padding: '16px 20px', marginBottom: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#323130', fontSize: '14px' }}>{f.nome}</span>
                <Badge texto={f.funcao} cores={FUNCAO_CORES} />
                <Badge texto={f.role} cores={ROLE_CORES} />
              </div>
              <div style={{ fontSize: '12px', color: '#605e5c', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <span><strong style={{ color: '#323130' }}>Usuario:</strong> {f.usuario}</span>
                {f.cpf && <span><strong style={{ color: '#323130' }}>CPF:</strong> {f.cpf}</span>}
                {f.telefone && <span><strong style={{ color: '#323130' }}>Tel:</strong> {f.telefone}</span>}
                {f.endereco && <span><strong style={{ color: '#323130' }}>End:</strong> {f.endereco}</span>}
                <span><strong style={{ color: '#323130' }}>Desde:</strong> {f.criado_em}</span>
              </div>
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => abrirEditar(f)} style={{
                  backgroundColor: '#0078d4', color: '#ffffff', border: 'none',
                  borderRadius: '2px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                }}>Editar</button>
                <button onClick={() => handleExcluir(f.id)} style={{
                  backgroundColor: '#d13438', color: '#ffffff', border: 'none',
                  borderRadius: '2px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                }}>Excluir</button>
              </div>
            )}
          </div>
        ))
      )}

      {modal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setModal(null)}>
          <div style={{
            backgroundColor: '#ffffff', border: '1px solid #d1d1d1',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            padding: '32px', width: '100%', maxWidth: '460px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#323130' }}>
                {modal === 'novo' ? 'Novo Funcionario' : 'Editar Funcionario'}
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#605e5c', lineHeight: 1,
              }}>x</button>
            </div>

            {msgModal && (
              <div style={{
                backgroundColor: '#fde7e9', border: '1px solid #d13438', borderRadius: '2px',
                padding: '10px 14px', color: '#a4262c', fontSize: '13px', marginBottom: '16px',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}>
                <span style={{ fontWeight: '700' }}>Nao foi possivel salvar</span>
                <span>{msgModal}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome Completo *</label>
                <input style={inputStyle} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Usuario *</label>
                <input style={inputStyle} value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  disabled={modal === 'editar'}
                  style={modal === 'editar' ? { ...inputStyle, color: '#605e5c', backgroundColor: '#f3f3f3', cursor: 'not-allowed' } : inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{modal === 'editar' ? 'Nova Senha (opcional)' : 'Senha *'}</label>
                <input style={inputStyle} type="password" value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  placeholder={modal === 'editar' ? 'Deixe em branco para manter' : ''} />
              </div>
              <div>
                <label style={labelStyle}>CPF</label>
                <input style={inputStyle} value={form.cpf} placeholder="000.000.000-00"
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input style={inputStyle} value={form.telefone} placeholder="(00) 00000-0000"
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Endereco</label>
                <input style={inputStyle} value={form.endereco} placeholder="Rua, numero, bairro, cidade"
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Funcao *</label>
                <select style={selectStyle} value={form.funcao}
                  onChange={(e) => setForm({ ...form, funcao: e.target.value })}>
                  {FUNCOES.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nivel de Acesso *</label>
                <select style={selectStyle} value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="funcionario">Funcionario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setModal(null)} style={{
                backgroundColor: '#f3f3f3', color: '#323130', border: '1px solid #d1d1d1',
                borderRadius: '2px', padding: '9px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleSalvar} disabled={salvando} style={{
                backgroundColor: '#0078d4', color: '#ffffff', border: 'none',
                borderRadius: '2px', padding: '9px 24px', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', opacity: salvando ? 0.7 : 1,
              }}>{salvando ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
