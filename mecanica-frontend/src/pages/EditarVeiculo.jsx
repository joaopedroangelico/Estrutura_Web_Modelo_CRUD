import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ORDENS_MOCK = {
  'OS-001': {
    id: 'OS-001',
    placa: 'ABC1234',
    modelo: 'Honda Civic',
    cor: 'Prata',
    descricao: 'Troca de oleo e filtros',
    status: 'em andamento',
    valor: '380.00',
    cpf: '123.456.789-00',
    nome: 'Joao Silva',
    telefone: '(41) 99999-0001',
    email: 'joao@email.com',
    data: '30/03/2025',
  },
  'OS-002': {
    id: 'OS-002',
    placa: 'XYZ5678',
    modelo: 'Toyota Corolla',
    cor: 'Branco',
    descricao: 'Revisao completa e alinhamento',
    status: 'iniciado',
    valor: '1200.00',
    cpf: '987.654.321-00',
    nome: 'Maria Oliveira',
    telefone: '(41) 99999-0002',
    email: 'maria@email.com',
    data: '29/03/2025',
  },
  'OS-003': {
    id: 'OS-003',
    placa: 'DEF9012',
    modelo: 'VW Gol',
    cor: 'Vermelho',
    descricao: 'Troca de pastilhas de freio',
    status: 'finalizado',
    valor: '250.00',
    cpf: '111.222.333-44',
    nome: 'Pedro Santos',
    telefone: '(41) 99999-0003',
    email: 'pedro@email.com',
    data: '28/03/2025',
  },
}

const pageStyle = {
  padding: '32px',
  maxWidth: '720px',
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
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

const naoEncontradoStyle = {
  textAlign: 'center',
  padding: '64px 0',
  color: '#94a3b8',
  fontSize: '16px',
}

export default function EditarVeiculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [sucesso, setSucesso] = useState(false)
  const [erros, setErros] = useState([])
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  useEffect(() => {
    const dados = ORDENS_MOCK[id]
    if (dados) setForm({ ...dados })
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

  const handleSalvar = () => {
    const lista = validar()
    if (lista.length > 0) {
      setErros(lista)
      setSucesso(false)
      return
    }
    setErros([])
    setSucesso(true)
    // Aqui sera integrado com o backend
    console.log('OS atualizada:', form)
    setTimeout(() => navigate('/dashboard'), 1800)
  }

  const handleExcluir = () => {
    if (!confirmarExclusao) {
      setConfirmarExclusao(true)
      return
    }
    // Aqui sera integrado com o backend
    console.log('OS excluida:', id)
    navigate('/dashboard')
  }

  if (!form) {
    return (
      <div style={pageStyle}>
        <div style={naoEncontradoStyle}>
          Ordem de servico "{id}" nao encontrada.
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={tituloPaginaStyle}>Editar Ordem de Servico</h1>
        <span style={idBadgeStyle}>{form.id}</span>
      </div>

      {sucesso && (
        <div style={sucessoStyle}>
          Ordem de servico atualizada com sucesso! Redirecionando...
        </div>
      )}

      {erros.length > 0 && (
        <div style={alertaStyle}>
          {erros.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      {confirmarExclusao && (
        <div style={alertaStyle}>
          <strong>Atencao:</strong> Esta acao nao pode ser desfeita. Clique em "Excluir" novamente para confirmar.
        </div>
      )}

      {/* SECAO VEICULO */}
      <div style={secaoStyle('#3b82f6')}>
        <p style={secaoTituloStyle('#3b82f6')}>Dados do Veiculo</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Placa *</label>
            <input
              style={inputStyle}
              type="text"
              value={form.placa}
              onChange={(e) => setF('placa', e.target.value.toUpperCase())}
              maxLength={8}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Modelo</label>
            <input
              style={inputStyle}
              type="text"
              value={form.modelo}
              onChange={(e) => setF('modelo', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Cor</label>
            <input
              style={inputStyle}
              type="text"
              value={form.cor}
              onChange={(e) => setF('cor', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select
              style={selectStyle}
              value={form.status}
              onChange={(e) => setF('status', e.target.value)}
            >
              <option value="iniciado">Iniciado</option>
              <option value="em andamento">Em Andamento</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Valor (R$)</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={(e) => setF('valor', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Data</label>
            <input
              style={{ ...inputStyle, color: '#64748b' }}
              type="text"
              value={form.data}
              disabled
            />
          </div>

          <div style={fieldFullStyle}>
            <label style={labelStyle}>Descricao do Servico</label>
            <textarea
              style={textareaStyle}
              value={form.descricao}
              onChange={(e) => setF('descricao', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECAO PROPRIETARIO */}
      <div style={secaoStyle('#10b981')}>
        <p style={secaoTituloStyle('#10b981')}>Dados do Proprietario</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CPF *</label>
            <input
              style={inputStyle}
              type="text"
              value={form.cpf}
              onChange={(e) => setF('cpf', e.target.value)}
              maxLength={14}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Nome Completo *</label>
            <input
              style={inputStyle}
              type="text"
              value={form.nome}
              onChange={(e) => setF('nome', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Telefone</label>
            <input
              style={inputStyle}
              type="text"
              value={form.telefone}
              onChange={(e) => setF('telefone', e.target.value)}
              maxLength={15}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={form.email}
              onChange={(e) => setF('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={acoesStyle}>
        <button style={btnExcluirStyle} onClick={handleExcluir}>
          {confirmarExclusao ? 'Confirmar Exclusao' : 'Excluir OS'}
        </button>
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>
          Cancelar
        </button>
        <button style={btnSalvarStyle} onClick={handleSalvar}>
          Salvar Alteracoes
        </button>
      </div>
    </div>
  )
}