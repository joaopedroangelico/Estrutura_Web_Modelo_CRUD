import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3001'

const pageStyle = {
  padding: '32px',
  maxWidth: '720px',
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
  paddingBottom: '80px',
}

const tituloPaginaStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e3a5f',
  margin: '0 0 28px 0',
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

const inputReadOnlyStyle = {
  ...inputStyle,
  color: '#64748b',
  backgroundColor: '#f1f5f9',
  cursor: 'default',
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
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '11px 28px',
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

const erroStyle = {
  backgroundColor: '#fee2e2',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#b91c1c',
  fontSize: '14px',
  marginBottom: '20px',
}

const VEICULO_INICIAL = {
  placa: '',
  modelo: '',
  cor: '',
  descricao: '',
  status: 'iniciado',
  valor: '',
  atendente_id: null,
  mecanico_id: '',
}

const PROPRIETARIO_INICIAL = {
  cpf: '',
  nome: '',
  telefone: '',
  email: '',
}

export default function CadastroVeiculos() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('usuario_logado') || '{}')

  const [veiculo, setVeiculo] = useState({ ...VEICULO_INICIAL, atendente_id: user.id || null })
  const [proprietario, setProprietario] = useState(PROPRIETARIO_INICIAL)
  const [sucesso, setSucesso] = useState(false)
  const [erros, setErros] = useState([])
  const [loading, setLoading] = useState(false)
  const [mecanicos, setMecanicos] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/funcionarios`)
      .then((res) => res.json())
      .then((data) => setMecanicos(data.filter((f) => f.funcao === 'mecanico')))
      .catch(() => {})
  }, [])

  const setV = (campo, valor) => setVeiculo((prev) => ({ ...prev, [campo]: valor }))
  const setP = (campo, valor) => setProprietario((prev) => ({ ...prev, [campo]: valor }))

  const validar = () => {
    const lista = []
    if (!veiculo.placa.trim()) lista.push('Placa é obrigatória.')
    if (!veiculo.modelo.trim()) lista.push('Modelo é obrigatório.')
    if (!proprietario.cpf.trim()) lista.push('CPF é obrigatório.')
    if (!proprietario.nome.trim()) lista.push('Nome do proprietário é obrigatório.')
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
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/ordens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ veiculo, proprietario }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar ordem de serviço.')
      setSucesso(true)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err) {
      setErros([err.message])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ ...tituloPaginaStyle, margin: 0 }}>Nova Ordem de Serviço</h1>
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>
          Voltar ao Dashboard
        </button>
      </div>

      {sucesso && (
        <div style={sucessoStyle}>Ordem de serviço cadastrada com sucesso! Redirecionando...</div>
      )}
      {erros.length > 0 && (
        <div style={erroStyle}>{erros.map((e, i) => <div key={i}>{e}</div>)}</div>
      )}

      {/* VEÍCULO */}
      <div style={secaoStyle('#3b82f6')}>
        <p style={secaoTituloStyle('#3b82f6')}>Dados do Veículo</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Placa *</label>
            <input style={inputStyle} type="text" placeholder="Ex: ABC1234"
              value={veiculo.placa} onChange={(e) => setV('placa', e.target.value.toUpperCase())} maxLength={8} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Modelo *</label>
            <input style={inputStyle} type="text" placeholder="Ex: Honda Civic"
              value={veiculo.modelo} onChange={(e) => setV('modelo', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cor</label>
            <input style={inputStyle} type="text" placeholder="Ex: Prata"
              value={veiculo.cor} onChange={(e) => setV('cor', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Status Inicial</label>
            <select style={selectStyle} value={veiculo.status} onChange={(e) => setV('status', e.target.value)}>
              <option value="iniciado">Iniciado</option>
              <option value="em andamento">Em Andamento</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Valor Estimado (R$)</label>
            <input style={inputStyle} type="number" placeholder="0.00" min="0" step="0.01"
              value={veiculo.valor} onChange={(e) => setV('valor', e.target.value)} />
          </div>
          <div style={fieldFullStyle}>
            <label style={labelStyle}>Descrição do Serviço</label>
            <textarea style={textareaStyle} placeholder="Descreva o serviço a ser realizado..."
              value={veiculo.descricao} onChange={(e) => setV('descricao', e.target.value)} />
          </div>
        </div>
      </div>

      {/* PROPRIETÁRIO */}
      <div style={secaoStyle('#10b981')}>
        <p style={secaoTituloStyle('#10b981')}>Dados do Proprietário</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CPF *</label>
            <input style={inputStyle} type="text" placeholder="000.000.000-00"
              value={proprietario.cpf} onChange={(e) => setP('cpf', e.target.value)} maxLength={14} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome Completo *</label>
            <input style={inputStyle} type="text" placeholder="Nome do proprietário"
              value={proprietario.nome} onChange={(e) => setP('nome', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Telefone</label>
            <input style={inputStyle} type="text" placeholder="(00) 00000-0000"
              value={proprietario.telefone} onChange={(e) => setP('telefone', e.target.value)} maxLength={15} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>E-mail</label>
            <input style={inputStyle} type="email" placeholder="email@exemplo.com"
              value={proprietario.email} onChange={(e) => setP('email', e.target.value)} />
          </div>
        </div>
      </div>

      {/* RESPONSÁVEIS */}
      <div style={secaoStyle('#f59e0b')}>
        <p style={secaoTituloStyle('#f59e0b')}>Responsáveis</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Atendente</label>
            <input style={inputReadOnlyStyle} type="text" value={user.nome || '—'} readOnly />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Mecânico Responsável</label>
            <select style={selectStyle} value={veiculo.mecanico_id}
              onChange={(e) => setV('mecanico_id', e.target.value || null)}>
              <option value="">— Selecionar mecânico —</option>
              {mecanicos.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={acoesStyle}>
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>Cancelar</button>
        <button style={{ ...btnSalvarStyle, opacity: loading ? 0.7 : 1 }} onClick={handleSalvar} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Ordem de Serviço'}
        </button>
      </div>
    </div>
  )
}
