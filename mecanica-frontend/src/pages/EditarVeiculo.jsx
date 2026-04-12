import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = 'http://localhost:3001'

const pageStyle = {
  padding: '32px',
  maxWidth: '720px',
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
  paddingBottom: '80px',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '28px',
}

const tituloPaginaStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e3a5f',
  margin: 0,
}

const idBadgeStyle = {
  backgroundColor: '#dbeafe',
  color: '#1d4ed8',
  borderRadius: '8px',
  padding: '6px 14px',
  fontSize: '14px',
  fontWeight: '700',
}

const secaoStyle = (cor) => ({
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  padding: '28px',
  marginBottom: '24px',
  borderTop: `4px solid ${cor}`,
})

const secaoTituloStyle = (cor) => ({
  fontSize: '15px',
  fontWeight: '700',
  color: cor,
  margin: '0 0 20px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
})

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const fieldFullStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  gridColumn: '1 / -1',
}

const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
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

const inputDisabledStyle = {
  ...inputStyle,
  color: '#64748b',
  backgroundColor: '#f1f5f9',
  cursor: 'not-allowed',
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px',
  fontFamily: 'system-ui, sans-serif',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
}

const acoesStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  marginTop: '8px',
}

const btnSalvarStyle = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '11px 28px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
}

const btnExcluirStyle = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '11px 20px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
}

const btnCancelarStyle = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  padding: '11px 24px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
}

const alertaStyle = {
  backgroundColor: '#fee2e2',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#b91c1c',
  fontSize: '14px',
  marginBottom: '20px',
}

const sucessoStyle = {
  backgroundColor: '#d1fae5',
  border: '1px solid #6ee7b7',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#065f46',
  fontSize: '14px',
  marginBottom: '20px',
  fontWeight: '500',
}

const adminBadgeStyle = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: '6px',
  padding: '4px 10px',
  color: '#92400e',
  fontSize: '12px',
  fontWeight: '600',
  marginLeft: '8px',
}

const naoEncontradoStyle = {
  textAlign: 'center',
  padding: '64px 0',
  color: '#94a3b8',
  fontSize: '16px',
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
      .then((res) => {
        if (!res.ok) throw new Error('Não encontrada.')
        return res.json()
      })
      .then((data) => {
        setForm({
          id: data.codigo,
          placa: data.placa,
          modelo: data.modelo,
          cor: data.cor,
          descricao: data.descricao || '',
          status: data.status,
          valor: data.valor,
          cpf: data.cpf,
          nome: data.cliente,
          telefone: data.telefone || '',
          email: data.email || '',
          data: data.data,
          atendente_id: data.atendente_id || null,
          mecanico_id: data.mecanico_id || '',
          atendente: data.atendente || '—',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const setF = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  const validar = () => {
    const lista = []
    if (!form.placa.trim()) lista.push('Placa é obrigatória.')
    if (!form.modelo.trim()) lista.push('Modelo é obrigatório.')
    if (!form.cpf.trim()) lista.push('CPF é obrigatório.')
    if (!form.nome.trim()) lista.push('Nome do proprietário é obrigatório.')
    return lista
  }

  const handleSalvar = async () => {
    const lista = validar()
    if (lista.length > 0) {
      setErros(lista)
      setSucesso(false)
      return
    }
    setErros([])
    setSalvando(true)
    try {
      const res = await fetch(`${API_URL}/ordens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          veiculo: {
            placa: form.placa,
            modelo: form.modelo,
            cor: form.cor,
            descricao: form.descricao,
            status: form.status,
            valor: form.valor,
            atendente_id: form.atendente_id || null,
            mecanico_id: form.mecanico_id || null,
          },
          proprietario: {
            cpf: form.cpf,
            nome: form.nome,
            telefone: form.telefone,
            email: form.email,
          },
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
    if (!confirmarExclusao) {
      setConfirmarExclusao(true)
      return
    }
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

  if (loading) {
    return <div style={pageStyle}><div style={naoEncontradoStyle}>Carregando...</div></div>
  }

  if (!form) {
    return (
      <div style={pageStyle}>
        <div style={naoEncontradoStyle}>Ordem de serviço "{id}" não encontrada.</div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={tituloPaginaStyle}>Editar Ordem de Serviço</h1>
          {!isAdmin && <span style={adminBadgeStyle}>Valor bloqueado — apenas admin</span>}
        </div>
        <span style={idBadgeStyle}>{form.id}</span>
      </div>

      {sucesso && <div style={sucessoStyle}>Ordem de serviço atualizada com sucesso! Redirecionando...</div>}
      {erros.length > 0 && <div style={alertaStyle}>{erros.map((e, i) => <div key={i}>{e}</div>)}</div>}
      {confirmarExclusao && (
        <div style={alertaStyle}>
          <strong>Atenção:</strong> Esta ação não pode ser desfeita. Clique em "Excluir" novamente para confirmar.
        </div>
      )}

      {/* VEÍCULO */}
      <div style={secaoStyle('#3b82f6')}>
        <p style={secaoTituloStyle('#3b82f6')}>Dados do Veículo</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Placa *</label>
            <input style={inputStyle} type="text"
              value={form.placa} onChange={(e) => setF('placa', e.target.value.toUpperCase())} maxLength={8} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Modelo</label>
            <input style={inputStyle} type="text"
              value={form.modelo} onChange={(e) => setF('modelo', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cor</label>
            <input style={inputStyle} type="text"
              value={form.cor} onChange={(e) => setF('cor', e.target.value)} />
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
            <input
              style={isAdmin ? inputStyle : inputDisabledStyle}
              type="number" min="0" step="0.01"
              value={form.valor}
              onChange={(e) => isAdmin && setF('valor', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Data de Abertura</label>
            <input style={inputDisabledStyle} type="text" value={form.data} disabled />
          </div>
          <div style={fieldFullStyle}>
            <label style={labelStyle}>Descrição do Serviço</label>
            <textarea style={textareaStyle}
              value={form.descricao} onChange={(e) => setF('descricao', e.target.value)} />
          </div>
        </div>
      </div>

      {/* PROPRIETÁRIO */}
      <div style={secaoStyle('#10b981')}>
        <p style={secaoTituloStyle('#10b981')}>Dados do Proprietário</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CPF *</label>
            <input style={inputStyle} type="text"
              value={form.cpf} onChange={(e) => setF('cpf', e.target.value)} maxLength={14} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome Completo *</label>
            <input style={inputStyle} type="text"
              value={form.nome} onChange={(e) => setF('nome', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Telefone</label>
            <input style={inputStyle} type="text"
              value={form.telefone} onChange={(e) => setF('telefone', e.target.value)} maxLength={15} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>E-mail</label>
            <input style={inputStyle} type="email"
              value={form.email} onChange={(e) => setF('email', e.target.value)} />
          </div>
        </div>
      </div>

      {/* RESPONSÁVEIS */}
      <div style={secaoStyle('#f59e0b')}>
        <p style={secaoTituloStyle('#f59e0b')}>Responsáveis</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Atendente</label>
            <input style={inputDisabledStyle} type="text" value={form.atendente} disabled />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Mecânico Responsável</label>
            <select style={selectStyle} value={form.mecanico_id || ''}
              onChange={(e) => setF('mecanico_id', e.target.value || null)}>
              <option value="">— Selecionar mecânico —</option>
              {mecanicos.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={acoesStyle}>
        {isAdmin && (
          <button style={btnExcluirStyle} onClick={handleExcluir}>
            {confirmarExclusao ? 'Confirmar Exclusão' : 'Excluir OS'}
          </button>
        )}
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>Cancelar</button>
        <button style={{ ...btnSalvarStyle, opacity: salvando ? 0.7 : 1 }} onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}
