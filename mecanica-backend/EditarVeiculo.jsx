import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'http://localhost:3001'

const pageStyle = { padding: '32px', maxWidth: '720px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }

const secaoStyle = (cor) => ({
  backgroundColor: '#ffffff', borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '28px',
  marginBottom: '24px', borderTop: `4px solid ${cor}`,
})

const secaoTituloStyle = (cor) => ({
  fontSize: '15px', fontWeight: '700', color: cor,
  margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '0.8px',
})

const gridStyle     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
const fieldStyle    = { display: 'flex', flexDirection: 'column', gap: '6px' }
const fieldFullStyle = { display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }
const labelStyle    = { fontSize: '13px', fontWeight: '600', color: '#374151' }

const inputStyle = {
  padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
  fontSize: '14px', color: '#111827', backgroundColor: '#f9fafb',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'system-ui, sans-serif' }
const selectStyle   = { ...inputStyle, cursor: 'pointer' }
const acoesStyle    = { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }

const btnSalvarStyle = {
  backgroundColor: '#3b82f6', color: '#fff', border: 'none',
  borderRadius: '8px', padding: '11px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
}

const btnExcluirStyle = {
  backgroundColor: '#ef4444', color: '#fff', border: 'none',
  borderRadius: '8px', padding: '11px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
}

const btnCancelarStyle = {
  backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #d1d5db',
  borderRadius: '8px', padding: '11px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
}

export default function EditarVeiculo() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm]                   = useState(null)
  const [carregando, setCarregando]       = useState(true)
  const [salvando, setSalvando]           = useState(false)
  const [sucesso, setSucesso]             = useState(false)
  const [erros, setErros]                 = useState([])
  const [confirmarExclusao, setConfirmar] = useState(false)
  const [naoEncontrado, setNaoEncontrado] = useState(false)

  useEffect(() => {
    fetch(`${API}/ordens/${id}`)
      .then((r) => {
        if (r.status === 404) { setNaoEncontrado(true); setCarregando(false); return null }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        setForm({
          placa:     data.placa,
          modelo:    data.modelo,
          cor:       data.cor,
          descricao: data.descricao,
          status:    data.status,
          valor:     data.valor,
          data:      data.data,
          cpf:       data.cpf,
          nome:      data.cliente,
          telefone:  data.telefone,
          email:     data.email,
        })
        setCarregando(false)
      })
      .catch(() => {
        setErros(['Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.'])
        setCarregando(false)
      })
  }, [id])

  const setF = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  const validar = () => {
    const lista = []
    if (!form.placa.trim())  lista.push('Placa e obrigatoria.')
    if (!form.modelo.trim()) lista.push('Modelo e obrigatorio.')
    if (!form.cpf.trim())    lista.push('CPF e obrigatorio.')
    if (!form.nome.trim())   lista.push('Nome do proprietario e obrigatorio.')
    return lista
  }

  const handleSalvar = async () => {
    const lista = validar()
    if (lista.length > 0) { setErros(lista); setSucesso(false); return }

    setErros([])
    setSalvando(true)

    try {
      const resp = await fetch(`${API}/ordens/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          veiculo:     { placa: form.placa, modelo: form.modelo, cor: form.cor, descricao: form.descricao, status: form.status, valor: form.valor },
          proprietario: { cpf: form.cpf, nome: form.nome, telefone: form.telefone, email: form.email },
        }),
      })

      const data = await resp.json()

      if (!resp.ok) { setErros([data.erro || 'Erro ao salvar.']); setSalvando(false); return }

      setSucesso(true)
      setSalvando(false)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch {
      setErros(['Nao foi possivel conectar ao servidor.'])
      setSalvando(false)
    }
  }

  const handleExcluir = async () => {
    if (!confirmarExclusao) { setConfirmar(true); return }

    try {
      const resp = await fetch(`${API}/ordens/${id}`, { method: 'DELETE' })
      if (!resp.ok) { setErros(['Erro ao excluir ordem de servico.']); return }
      navigate('/dashboard')
    } catch {
      setErros(['Nao foi possivel conectar ao servidor.'])
    }
  }

  if (carregando) return <div style={{ ...pageStyle, paddingTop: '64px', textAlign: 'center', color: '#94a3b8' }}>Carregando...</div>

  if (naoEncontrado) return (
    <div style={{ ...pageStyle, paddingTop: '64px', textAlign: 'center', color: '#94a3b8', fontSize: '16px' }}>
      Ordem de servico "{id}" nao encontrada.
    </div>
  )

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a5f', margin: 0 }}>Editar Ordem de Servico</h1>
        <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '8px', padding: '6px 14px', fontSize: '14px', fontWeight: '700' }}>{id}</span>
      </div>

      {sucesso && (
        <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '12px 16px', color: '#065f46', fontSize: '14px', marginBottom: '20px', fontWeight: '500' }}>
          Ordem de servico atualizada com sucesso! Redirecionando...
        </div>
      )}

      {erros.length > 0 && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', color: '#b91c1c', fontSize: '14px', marginBottom: '20px' }}>
          {erros.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      {confirmarExclusao && (
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px 16px', color: '#92400e', fontSize: '14px', marginBottom: '20px' }}>
          Atencao: esta acao nao pode ser desfeita. Clique em "Confirmar Exclusao" para continuar.
        </div>
      )}

      {/* VEICULO */}
      <div style={secaoStyle('#3b82f6')}>
        <p style={secaoTituloStyle('#3b82f6')}>Dados do Veiculo</p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Placa *</label>
            <input style={inputStyle} type="text" value={form.placa}
              onChange={(e) => setF('placa', e.target.value.toUpperCase())} maxLength={8} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Modelo *</label>
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
            <input style={inputStyle} type="number" min="0" step="0.01" value={form.valor} onChange={(e) => setF('valor', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Data de Abertura</label>
            <input style={{ ...inputStyle, color: '#64748b' }} type="text" value={form.data} disabled />
          </div>
          <div style={fieldFullStyle}>
            <label style={labelStyle}>Descricao do Servico</label>
            <textarea style={textareaStyle} value={form.descricao} onChange={(e) => setF('descricao', e.target.value)} />
          </div>
        </div>
      </div>

      {/* PROPRIETARIO */}
      <div style={secaoStyle('#10b981')}>
        <p style={secaoTituloStyle('#10b981')}>Dados do Proprietario</p>
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
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={acoesStyle}>
        <button style={btnExcluirStyle} onClick={handleExcluir}>
          {confirmarExclusao ? 'Confirmar Exclusao' : 'Excluir OS'}
        </button>
        <button style={btnCancelarStyle} onClick={() => navigate('/dashboard')}>Cancelar</button>
        <button style={{ ...btnSalvarStyle, opacity: salvando ? 0.7 : 1 }} onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Alteracoes'}
        </button>
      </div>
    </div>
  )
}
