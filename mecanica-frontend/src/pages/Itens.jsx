import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3001'

const pageStyle = {
  padding: '32px',
  maxWidth: '960px',
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
  paddingBottom: '100px',
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

export default function Itens() {
  const user = JSON.parse(localStorage.getItem('usuario_logado') || '{}')
  const isAdmin = user.role === 'admin'

  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '' })
  const [salvando, setSalvando] = useState(false)
  const [msgModal, setMsgModal] = useState('')

  const carregar = () => {
    setLoading(true)
    fetch(`${API_URL}/itens`)
      .then((r) => r.json())
      .then((data) => { setItens(data); setLoading(false) })
      .catch(() => { setErro('Erro ao carregar itens.'); setLoading(false) })
  }

  useEffect(() => { carregar() }, [])

  const abrirNovo = () => {
    setForm({ nome: '', descricao: '', preco: '' })
    setMsgModal('')
    setModal('novo')
  }

  const abrirEditar = (item) => {
    setForm({ id: item.id, nome: item.nome, descricao: item.descricao || '', preco: item.preco })
    setMsgModal('')
    setModal('editar')
  }

  const handleSalvar = async () => {
    if (!form.nome) {
      setMsgModal('Nome é obrigatório.')
      return
    }
    setSalvando(true)
    setMsgModal('')
    try {
      const url = modal === 'novo' ? `${API_URL}/itens` : `${API_URL}/itens/${form.id}`
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
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return
    try {
      const res = await fetch(`${API_URL}/itens/${id}`, { method: 'DELETE' })
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
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 4px 0' }}>
            Itens de Serviço
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Peças e materiais utilizados nos serviços</p>
        </div>
        {isAdmin && (
          <button onClick={abrirNovo} style={{
            backgroundColor: '#0d9488', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '10px 22px', fontSize: '14px',
            fontWeight: '700', cursor: 'pointer',
          }}>+ Novo Item</button>
        )}
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px',
          padding: '12px 16px', color: '#b91c1c', marginBottom: '20px' }}>{erro}</div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Carregando...</div>
      ) : itens.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Nenhum item cadastrado.</div>
      ) : (
        itens.map((item) => (
          <div key={item.id} style={{
            backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            padding: '18px 24px', marginBottom: '12px', borderLeft: '4px solid #0d9488',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '15px', marginBottom: '4px' }}>
                {item.nome}
              </div>
              {item.descricao && (
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{item.descricao}</div>
              )}
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0d9488' }}>
                R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
              </div>
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => abrirEditar(item)} style={{
                  backgroundColor: '#3b82f6', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>Editar</button>
                <button onClick={() => handleExcluir(item.id)} style={{
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
            width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e3a5f' }}>
                {modal === 'novo' ? 'Novo Item' : 'Editar Item'}
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8',
              }}>×</button>
            </div>

            {msgModal && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px',
                padding: '10px 14px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>{msgModal}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome *</label>
                <input style={inputStyle} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Descrição</label>
                <input style={inputStyle} value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Preço (R$)</label>
                <input style={inputStyle} type="number" min="0" step="0.01" value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setModal(null)} style={{
                backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #d1d5db',
                borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleSalvar} disabled={salvando} style={{
                backgroundColor: '#0d9488', color: '#fff', border: 'none',
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
