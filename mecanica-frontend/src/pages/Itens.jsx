import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const pageStyle = {
  padding: '28px 32px',
  maxWidth: '960px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  paddingBottom: '100px',
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
      setMsgModal('Nome e obrigatorio.')
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#323130', margin: '0 0 4px 0' }}>
            Itens de Servico
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#605e5c' }}>Pecas e materiais utilizados nos servicos</p>
        </div>
        {isAdmin && (
          <button onClick={abrirNovo} style={{
            backgroundColor: '#107c10', color: '#ffffff', border: 'none',
            borderRadius: '2px', padding: '8px 20px', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer',
          }}>+ Novo Item</button>
        )}
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fde7e9', border: '1px solid #d13438', borderRadius: '2px',
          padding: '10px 14px', color: '#a4262c', fontSize: '13px', marginBottom: '16px' }}>{erro}</div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a19f9d' }}>Carregando...</div>
      ) : itens.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a19f9d' }}>Nenhum item cadastrado.</div>
      ) : (
        itens.map((item) => (
          <div key={item.id} style={{
            backgroundColor: '#ffffff', border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            borderTop: '3px solid #107c10',
            padding: '16px 20px', marginBottom: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#323130', fontSize: '14px', marginBottom: '4px' }}>
                {item.nome}
              </div>
              {item.descricao && (
                <div style={{ fontSize: '12px', color: '#605e5c', marginBottom: '4px' }}>{item.descricao}</div>
              )}
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#107c10' }}>
                R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
              </div>
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => abrirEditar(item)} style={{
                  backgroundColor: '#0078d4', color: '#ffffff', border: 'none',
                  borderRadius: '2px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                }}>Editar</button>
                <button onClick={() => handleExcluir(item.id)} style={{
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
            padding: '32px', width: '100%', maxWidth: '440px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#323130' }}>
                {modal === 'novo' ? 'Novo Item' : 'Editar Item'}
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#605e5c', lineHeight: 1,
              }}>x</button>
            </div>

            {msgModal && (
              <div style={{ backgroundColor: '#fde7e9', border: '1px solid #d13438', borderRadius: '2px',
                padding: '10px 14px', color: '#a4262c', fontSize: '13px', marginBottom: '16px' }}>{msgModal}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Nome *</label>
                <input style={inputStyle} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Descricao</label>
                <input style={inputStyle} value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Preco (R$)</label>
                <input style={inputStyle} type="number" min="0" step="0.01" value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })} />
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
