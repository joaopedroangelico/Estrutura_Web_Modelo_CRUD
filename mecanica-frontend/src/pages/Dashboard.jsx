import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ORDENS = [
  {
    id: 'OS-001',
    placa: 'ABC1234',
    cliente: 'Joao Silva',
    cpf: '123.456.789-00',
    status: 'em andamento',
    data: '30/03/2025',
    valor: 380.0,
    modelo: 'Honda Civic',
    cor: 'Prata',
    descricao: 'Troca de oleo e filtros',
    telefone: '(41) 99999-0001',
    email: 'joao@email.com',
  },
  {
    id: 'OS-002',
    placa: 'XYZ5678',
    cliente: 'Maria Oliveira',
    cpf: '987.654.321-00',
    status: 'iniciado',
    data: '29/03/2025',
    valor: 1200.0,
    modelo: 'Toyota Corolla',
    cor: 'Branco',
    descricao: 'Revisao completa e alinhamento',
    telefone: '(41) 99999-0002',
    email: 'maria@email.com',
  },
  {
    id: 'OS-003',
    placa: 'DEF9012',
    cliente: 'Pedro Santos',
    cpf: '111.222.333-44',
    status: 'finalizado',
    data: '28/03/2025',
    valor: 250.0,
    modelo: 'VW Gol',
    cor: 'Vermelho',
    descricao: 'Troca de pastilhas de freio',
    telefone: '(41) 99999-0003',
    email: 'pedro@email.com',
  },
]

const ABAS = ['em andamento', 'iniciado', 'finalizado']

const ABA_LABELS = {
  'em andamento': 'Em Andamento',
  'iniciado': 'Iniciado',
  'finalizado': 'Finalizado',
}

const STATUS_CORES = {
  'em andamento': { bg: '#fef9c3', color: '#a16207', border: '#fde047' },
  'iniciado': { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  'finalizado': { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
}

const pageStyle = {
  padding: '32px',
  maxWidth: '960px',
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
}

const tituloPaginaStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e3a5f',
  margin: '0 0 24px 0',
}

const abasContainerStyle = {
  display: 'flex',
  borderBottom: '2px solid #e2e8f0',
  marginBottom: '20px',
  gap: '0',
}

const detalhesOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const detalhesCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
  padding: '36px',
  width: '100%',
  maxWidth: '480px',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState('em andamento')
  const [busca, setBusca] = useState('')
  const [detalheOS, setDetalheOS] = useState(null)

  const filtradas = ORDENS.filter((os) => {
    const matchAba = os.status === abaAtiva
    const termo = busca.trim().toLowerCase()
    if (!termo) return matchAba
    return matchAba && (
      os.placa.toLowerCase().includes(termo) ||
      os.cpf.toLowerCase().includes(termo)
    )
  })

  const abaStyle = (aba) => ({
    padding: '10px 22px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: abaAtiva === aba ? '3px solid #3b82f6' : '3px solid transparent',
    color: abaAtiva === aba ? '#3b82f6' : '#64748b',
    fontWeight: abaAtiva === aba ? '700' : '500',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '-2px',
    transition: 'color 0.15s',
    letterSpacing: '0.2px',
  })

  const searchStyle = {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    marginBottom: '20px',
    outline: 'none',
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    padding: '20px 24px',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  }

  const statusBadge = (status) => {
    const cor = STATUS_CORES[status] || {}
    return {
      backgroundColor: cor.bg,
      color: cor.color,
      border: `1px solid ${cor.border}`,
      borderRadius: '20px',
      padding: '3px 12px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    }
  }

  const btnEditarStyle = {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '8px',
  }

  const btnDetalhesStyle = {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  }

  const vazioStyle = {
    textAlign: 'center',
    padding: '48px 0',
    color: '#94a3b8',
    fontSize: '15px',
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ ...tituloPaginaStyle, margin: 0 }}>Ordens de Servico</h1>
        <button
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 22px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '0.2px',
          }}
          onClick={() => navigate('/cadastro-veiculo')}
        >
          + Nova OS
        </button>
      </div>

      {/* ABAS */}
      <div style={abasContainerStyle}>
        {ABAS.map((aba) => (
          <button key={aba} style={abaStyle(aba)} onClick={() => setAbaAtiva(aba)}>
            {ABA_LABELS[aba]}
            <span style={{
              marginLeft: '8px',
              backgroundColor: abaAtiva === aba ? '#3b82f6' : '#e2e8f0',
              color: abaAtiva === aba ? '#fff' : '#64748b',
              borderRadius: '12px',
              padding: '1px 8px',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              {ORDENS.filter(o => o.status === aba).length}
            </span>
          </button>
        ))}
      </div>

      {/* BUSCA */}
      <input
        style={searchStyle}
        type="text"
        placeholder="Buscar por placa ou CPF..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* LISTA DE CARDS */}
      {filtradas.length === 0 ? (
        <div style={vazioStyle}>Nenhuma ordem encontrada.</div>
      ) : (
        filtradas.map((os) => (
          <div key={os.id} style={cardStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '15px' }}>{os.id}</span>
                <span style={{ fontWeight: '700', color: '#374151', fontSize: '15px' }}>{os.placa}</span>
                <span style={statusBadge(os.status)}>{ABA_LABELS[os.status]}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span><strong style={{ color: '#374151' }}>Cliente:</strong> {os.cliente}</span>
                <span><strong style={{ color: '#374151' }}>CPF:</strong> {os.cpf}</span>
                <span><strong style={{ color: '#374151' }}>Data:</strong> {os.data}</span>
                <span><strong style={{ color: '#374151' }}>Valor:</strong>{' '}
                  <span style={{ color: '#10b981', fontWeight: '700' }}>
                    R$ {os.valor.toFixed(2).replace('.', ',')}
                  </span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <button style={btnEditarStyle} onClick={() => navigate(`/editar/${os.id}`)}>
                Editar
              </button>
              <button style={btnDetalhesStyle} onClick={() => setDetalheOS(os)}>
                Detalhes
              </button>
            </div>
          </div>
        ))
      )}

      {/* MODAL DETALHES */}
      {detalheOS && (
        <div style={detalhesOverlayStyle} onClick={() => setDetalheOS(null)}>
          <div style={detalhesCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1e3a5f', fontWeight: '700' }}>
                Detalhes — {detalheOS.id}
              </h2>
              <button
                onClick={() => setDetalheOS(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}
              >
                x
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', margin: '0 0 10px 0', letterSpacing: '1px' }}>
                Veiculo
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '14px', color: '#374151' }}>
                <span><strong>Placa:</strong> {detalheOS.placa}</span>
                <span><strong>Modelo:</strong> {detalheOS.modelo}</span>
                <span><strong>Cor:</strong> {detalheOS.cor}</span>
                <span><strong>Status:</strong> <span style={statusBadge(detalheOS.status)}>{ABA_LABELS[detalheOS.status]}</span></span>
              </div>
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}>
                <strong>Descricao:</strong> {detalheOS.descricao}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', margin: '0 0 10px 0', letterSpacing: '1px' }}>
                Proprietario
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '14px', color: '#374151' }}>
                <span><strong>Nome:</strong> {detalheOS.cliente}</span>
                <span><strong>CPF:</strong> {detalheOS.cpf}</span>
                <span><strong>Telefone:</strong> {detalheOS.telefone}</span>
                <span><strong>Email:</strong> {detalheOS.email}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Data: {detalheOS.data}</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                R$ {detalheOS.valor.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}