import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const pageStyle = {
  padding: '28px 32px',
  maxWidth: '720px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  paddingBottom: '80px',
}

const tituloPaginaStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#323130',
  margin: 0,
}

const idBadgeStyle = {
  backgroundColor: '#cce4f7',
  color: '#004e8c',
  borderRadius: '2px',
  padding: '4px 12px',
  fontSize: '13px',
  fontWeight: '600',
  border: '1px solid #0078d4',
}

const secaoStyle = (cor) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e5e5e5',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  padding: '24px',
  marginBottom: '20px',
  borderTop: `3px solid ${cor}`,
})

const secaoTituloStyle = (cor) => ({
  fontSize: '13px',
  fontWeight: '600',
  color: cor,
  margin: '0 0 16px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
})

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' }
const fieldFullStyle = { display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }
const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#323130' }

const inputStyle = {
  padding: '8px 12px', border: '1px solid #d1d1d1', borderRadius: '2px',
  fontSize: '13px', color: '#323130', backgroundColor: '#ffffff',
  outline: 'none', width: '100%', boxSizing: 'border-box',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
}

const inputDisabledStyle = { ...inputStyle, color: '#605e5c', backgroundColor: '#f3f3f3', cursor: 'not-allowed' }
const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '72px' }
const selectStyle = { ...inputStyle, cursor: 'pointer' }
const acoesStyle = { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }

const btnSalvarStyle = {
  backgroundColor: '#0078d4', color: '#ffffff', border: 'none',
  borderRadius: '2px', padding: '9px 24px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
}

const btnExcluirStyle = {
  backgroundColor: '#d13438', color: '#ffffff', border: 'none',
  borderRadius: '2px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
}

const btnCancelarStyle = {
  backgroundColor: '#f3f3f3', color: '#323130', border: '1px solid #d1d1d1',
  borderRadius: '2px', padding: '9px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
}

const alertaStyle = {
  backgroundColor: '#fde7e9', border: '1px solid #d13438', borderRadius: '2px',
  padding: '10px 14px', color: '#a4262c', fontSize: '13px', marginBottom: '16px',
}

const sucessoStyle = {
  backgroundColor: '#dff6dd', border: '1px solid #107c10', borderRadius: '2px',
  padding: '10px 14px', color: '#0e6b0e', fontSize: '13px', marginBottom: '16px',
}

const adminBadgeStyle = {
  backgroundColor: '#fff4ce', border: '1px solid #f9c642', borderRadius: '2px',
  padding: '3px 10px', color: '#7d5800', fontSize: '12px', fontWeight: '600', marginLeft: '10px',
}

export default function EditarVeiculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('usuario_logado') || '{}')
  const isAdmin = user.role === 'admin'

  const [form, setForm] = useState(null)
  const [sucesso, setSucesso] = useState(false)
  const [erros, setErros] = useState([])
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mecanicos, setMecanicos] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/funcionarios`)
      .then((res) => res.json())
      .then((data) => setMecanicos(data.filter((f) => f.funcao === 'mecanico')))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/ordens/${id}`)
      .then((res) => { if (!res.ok) throw new Error('Nao encontrada.'); return res.json() })
      .then((data) => {
        setForm({
          id: data.codigo, placa: data.placa, modelo: data.modelo, cor: data.cor,
          descricao: data.descricao || '', status: data.status, valor: data.valor,
          cpf: data.cpf, nome: data.cliente, telefone: data.telefone || '',
          email: data.email || '', data: data.data,
          atendente_id: data.atendente_id || null, mecanico_id: data.mecanico_id || '',
          atendente: data.atendente || '—',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const setF = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  const validar = () => {
    const lista = []
    if (!form.placa.trim()) lista.push('Placa e obrigatoria.')
    if (!form.modelo.trim()) lista.push('Modelo e obrigatorio.')
    if (!form.cpf.trim()) lista.push('CPF e obrigatorio.')
    if (!form.nome.trim()) lista.push('Nome do proprietario e obrigatorio.')
    return lista
  }

  const handleSalvar = async () => {
    const lista = validar()
    if (lista.length > 0) { setErros(lista); setSucesso(false); return }
    setErros([])
    setSalvando(true)
    try {
      const res = await fetch(`${API_URL}/ordens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          veiculo: { placa: form.placa, modelo: form.modelo, cor: form.cor, descricao: form.descricao, status: form.status, valor: form.valor, atendente_id: form.atendente_id || null, mecanico_id: form.mecanico_id || null },
          proprietario: { cpf: form.cpf, nome: form.nome, telefone: form.telefone, email: form.email },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao atualizar.')
      setSucesso(true)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err) {
      setErros([err.message])
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async () => {
    if (!confirmarExclusao) { setConfirmarExclusao(true); return }
    try {
      const res = await fetch(`${API_URL}/ordens/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao excluir.')
      navigate('/dashboard')
    } catch (err) {
      setErros([err.message])
      setConfirmarExclusao(false)
    }
  }

  if (loading) return <div style={pageStyle}><div style={{ textAlign: 'center', padding: '64px', color: '#a19f9d' }}>Carregando...</div></div>
  if (!form) return <div style={pageStyle}><div style={{ textAlign: 'center', padding: '64px', color: '#a19f9d' }}>Ordem "{id}" nao encontrada.</div></div>

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={tituloPaginaStyle}>Editar Ordem de Servico</h1>
          {!isAdmin && <span style={adminBadgeStyle}>Valor bloqueado</span>}
        </div>
        <span style={idBadgeStyle}>{form.id}</span>
      </div>

      {sucesso && <div style={sucessoStyle}>Ordem atualizada com sucesso! Redirecionando...</div>}
      {erros.length > 0 && <div style={alertaStyle}>{erros.map((e, i) => <div key={i}>{e}</div>)}</div>}
      {confirmarExclusao && (
        <div style={alertaStyle}>
          <strong>Atencao:</strong> Esta acao nao pode ser desfeita. Clique em "Excluir" novamente para confirmar.
        </div>
      )}

      <div style={secaoStyle('#0078d4')}>
        <p style={secaoTituloStyle('#0078d4')}>Dados do Veiculo</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Placa *</label>
            <input style={inputStyle} type="text" value={form.placa} onChange={(e) => setF('placa', e.target.value.toUpperCase())} maxLength={8} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Modelo</label>
            <input style={inputStyle} type="text" value={form.modelo} onChange={(e) => setF('modelo', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cor</label>
            <input style={inputStyle} type="text" value={form.cor} onChange={(e) => setF('cor', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select style={selectStyle} value={form.status} onChange={(e) => setF('status', e.target.value)}>
              <option value="iniciado">Iniciado</option>
              <option value="em andamento">Em Andamento</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Valor (R$)</label>
            <input style={isAdmin ? inputStyle : inputDisabledStyle} type="number" min="0" step="0.01"
              value={form.valor} onChange={(e) => isAdmin && setF('valor', e.target.value)} disabled={!isAdmin} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Data de Abertura</label>
            <input style={inputDisabledStyle} type="text" value={form.data} disabled />
          </div>
          <div style={fieldFullStyle}>
            <label style={labelStyle}>Descricao do Servico</label>
            <textarea style={textareaStyle} value={form.descricao} onChange={(e) => setF('descricao', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={secaoStyle('#107c10')}>
        <p style={secaoTituloStyle('#107c10')}>Dados do Proprietario</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CPF *</label>
            <input style={inputStyle} type="text" value={form.cpf} onChange={(e) => setF('cpf', e.target.value)} maxLength={14} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome Completo *</label>
            <input style={inputStyle} type="text" value={form.nome} onChange={(e) => setF('nome', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Telefone</label>
            <input style={inputStyle} type="text" value={form.telefone} onChange={(e) => setF('telefone', e.target.value)} maxLength={15} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>E-mail</label>
            <input style={inputStyle} type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={secaoStyle('#c8a600')}>
        <p style={secaoTituloStyle('#c8a600')}>Responsaveis</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Atendente</label>
            <input style={inputDisabledStyle} type="text" value={form.atendente} disabled />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Mecanico Responsavel</label>
            <select style={selectStyle} value={form.mecanico_id || ''} onChange={(e) => setF('mecanico_id', e.target.value || null)}>
              <option value="">— Selecionar mecanico —</option>
              {mecanicos.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={acoesStyle}>
        {isAdmin && (
          <button style={btnExcluirStyle} onClick={handleExcluir}>
            {confirmarExclusao ? 'Confirmar Exclusao' : 'Excluir OS'}
          </button>
        )}
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>Cancelar</button>
        <button style={{ ...btnSalvarStyle, opacity: salvando ? 0.7 : 1 }} onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Alteracoes'}
        </button>
      </div>
    </div>
  )
}
