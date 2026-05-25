import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
  margin: '0 0 24px 0',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '14px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const fieldFullStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  gridColumn: '1 / -1',
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#323130',
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

const inputReadOnlyStyle = {
  ...inputStyle,
  color: '#605e5c',
  backgroundColor: '#f3f3f3',
  cursor: 'default',
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '72px',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
}

const acoesStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '8px',
}

const btnSalvarStyle = {
  backgroundColor: '#0078d4',
  color: '#ffffff',
  border: 'none',
  borderRadius: '2px',
  padding: '9px 24px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
}

const btnCancelarStyle = {
  backgroundColor: '#f3f3f3',
  color: '#323130',
  border: '1px solid #d1d1d1',
  borderRadius: '2px',
  padding: '9px 20px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
}

const sucessoStyle = {
  backgroundColor: '#dff6dd',
  border: '1px solid #107c10',
  borderRadius: '2px',
  padding: '10px 14px',
  color: '#0e6b0e',
  fontSize: '13px',
  marginBottom: '16px',
}

const erroStyle = {
  backgroundColor: '#fde7e9',
  border: '1px solid #d13438',
  borderRadius: '2px',
  padding: '10px 14px',
  color: '#a4262c',
  fontSize: '13px',
  marginBottom: '16px',
}

const VEICULO_INICIAL = {
  placa: '', modelo: '', cor: '', descricao: '',
  status: 'iniciado', valor: '', atendente_id: null, mecanico_id: '',
}

const PROPRIETARIO_INICIAL = { cpf: '', nome: '', telefone: '', email: '' }

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
    if (!veiculo.placa.trim()) lista.push('Placa e obrigatoria.')
    if (!veiculo.modelo.trim()) lista.push('Modelo e obrigatorio.')
    if (!proprietario.cpf.trim()) lista.push('CPF e obrigatorio.')
    if (!proprietario.nome.trim()) lista.push('Nome do proprietario e obrigatorio.')
    return lista
  }

  const handleSalvar = async () => {
    const lista = validar()
    if (lista.length > 0) { setErros(lista); setSucesso(false); return }
    setErros([])
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/ordens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ veiculo, proprietario }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar ordem de servico.')
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ ...tituloPaginaStyle, margin: 0 }}>Nova Ordem de Servico</h1>
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>Voltar</button>
      </div>

      {sucesso && <div style={sucessoStyle}>Ordem de servico cadastrada com sucesso! Redirecionando...</div>}
      {erros.length > 0 && <div style={erroStyle}>{erros.map((e, i) => <div key={i}>{e}</div>)}</div>}

      <div style={secaoStyle('#0078d4')}>
        <p style={secaoTituloStyle('#0078d4')}>Dados do Veiculo</p>
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
            <label style={labelStyle}>Descricao do Servico</label>
            <textarea style={textareaStyle} placeholder="Descreva o servico..."
              value={veiculo.descricao} onChange={(e) => setV('descricao', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={secaoStyle('#107c10')}>
        <p style={secaoTituloStyle('#107c10')}>Dados do Proprietario</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CPF *</label>
            <input style={inputStyle} type="text" placeholder="000.000.000-00"
              value={proprietario.cpf} onChange={(e) => setP('cpf', e.target.value)} maxLength={14} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome Completo *</label>
            <input style={inputStyle} type="text" placeholder="Nome do proprietario"
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

      <div style={secaoStyle('#c8a600')}>
        <p style={secaoTituloStyle('#c8a600')}>Responsaveis</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Atendente</label>
            <input style={inputReadOnlyStyle} type="text" value={user.nome || '—'} readOnly />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Mecanico Responsavel</label>
            <select style={selectStyle} value={veiculo.mecanico_id}
              onChange={(e) => setV('mecanico_id', e.target.value || null)}>
              <option value="">— Selecionar mecanico —</option>
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
          {loading ? 'Salvando...' : 'Salvar Ordem de Servico'}
        </button>
      </div>
    </div>
  )
}
