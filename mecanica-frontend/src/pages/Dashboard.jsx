import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const ABAS = ['em andamento', 'iniciado', 'finalizado']

const ABA_LABELS = {
  'em andamento': 'Em Andamento',
  'iniciado': 'Iniciado',
  'finalizado': 'Finalizado',
}

const STATUS_CORES = {
  'em andamento': { bg: '#fff4ce', color: '#7d5800', border: '#f9c642' },
  'iniciado':     { bg: '#cce4f7', color: '#004e8c', border: '#0078d4' },
  'finalizado':   { bg: '#dff6dd', color: '#0e6b0e', border: '#107c10' },
}

const pageStyle = {
  padding: '28px 32px',
  maxWidth: '960px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
}

const detalhesOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const detalhesCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #d1d1d1',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  padding: '32px',
  width: '100%',
  maxWidth: '480px',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState('em andamento')
  const [busca, setBusca] = useState('')
  const [detalheOS, setDetalheOS] = useState(null)
  const [ordens, setOrdens] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setLoading(true)
    setErro('')
    fetch(`${API_URL}/ordens`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar ordens.')
        return res.json()
      })
      .then((data) => { setOrdens(data); setLoading(false) })
      .catch((err) => { setErro(err.message); setLoading(false) })
  }, [])

  const filtradas = ordens.filter((os) => {
    const matchAba = os.status === abaAtiva
    const termo = busca.trim().toLowerCase()
    if (!termo) return matchAba
    return matchAba && (
      os.placa.toLowerCase().includes(termo) ||
      os.cpf.toLowerCase().includes(termo)
    )
  })

  const abaStyle = (aba) => ({
    padding: '8px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: abaAtiva === aba ? '2px solid #0078d4' : '2px solid transparent',
    color: abaAtiva === aba ? '#0078d4' : '#605e5c',
    fontWeight: abaAtiva === aba ? '600' : '400',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '-1px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  })

  const statusBadge = (status) => {
    const cor = STATUS_CORES[status] || {}
    return {
      backgroundColor: cor.bg,
      color: cor.color,
      border: `1px solid ${cor.border}`,
      borderRadius: '2px',
      padding: '2px 10px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    }
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#323130', margin: 0 }}>Ordens de Servico</h1>
        <button
          style={{
            backgroundColor: '#107c10', color: '#ffffff', border: 'none',
            borderRadius: '2px', padding: '8px 20px', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer',
          }}
          onClick={() => navigate('/cadastro-veiculo')}
        >
          + Nova OS
        </button>
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fde7e9', border: '1px solid #d13438', borderRadius: '2px', padding: '10px 14px', color: '#a4262c', fontSize: '13px', marginBottom: '16px' }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', borderBottom: '1px solid #d1d1d1', marginBottom: '16px' }}>
        {ABAS.map((aba) => (
          <button key={aba} style={abaStyle(aba)} onClick={() => setAbaAtiva(aba)}>
            {ABA_LABELS[aba]}
            <span style={{
              marginLeft: '6px',
              backgroundColor: abaAtiva === aba ? '#0078d4' : '#e5e5e5',
              color: abaAtiva === aba ? '#fff' : '#605e5c',
              borderRadius: '10px',
              padding: '0 7px',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              {ordens.filter(o => o.status === aba).length}
            </span>
          </button>
        ))}
      </div>

      <input
        style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d1d1',
          borderRadius: '2px', fontSize: '13px', color: '#323130',
          backgroundColor: '#ffffff', boxSizing: 'border-box', marginBottom: '16px', outline: 'none',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
        type="text"
        placeholder="Buscar por placa ou CPF..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a19f9d' }}>Carregando...</div>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a19f9d' }}>Nenhuma ordem encontrada.</div>
      ) : (
        filtradas.map((os) => (
          <div key={os.codigo} style={{
            backgroundColor: '#ffffff', border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            padding: '16px 20px', marginBottom: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#323130', fontSize: '14px' }}>{os.codigo}</span>
                <span style={{ fontWeight: '600', color: '#323130', fontSize: '14px' }}>{os.placa}</span>
                <span style={statusBadge(os.status)}>{ABA_LABELS[os.status]}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#605e5c', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span><strong style={{ color: '#323130' }}>Cliente:</strong> {os.cliente}</span>
                <span><strong style={{ color: '#323130' }}>CPF:</strong> {os.cpf}</span>
                <span><strong style={{ color: '#323130' }}>Data:</strong> {os.data}</span>
                <span><strong style={{ color: '#323130' }}>Valor:</strong>{' '}
                  <span style={{ color: '#107c10', fontWeight: '600' }}>
                    R$ {parseFloat(os.valor).toFixed(2).replace('.', ',')}
                  </span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button style={{
                backgroundColor: '#0078d4', color: '#fff', border: 'none',
                borderRadius: '2px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              }} onClick={() => navigate(`/editar/${os.codigo}`)}>
                Editar
              </button>
              <button style={{
                backgroundColor: '#107c10', color: '#fff', border: 'none',
                borderRadius: '2px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              }} onClick={() => setDetalheOS(os)}>
                Detalhes
              </button>
            </div>
          </div>
        ))
      )}

      {detalheOS && (
        <div style={detalhesOverlayStyle} onClick={() => setDetalheOS(null)}>
          <div style={detalhesCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', color: '#323130', fontWeight: '600' }}>
                Detalhes — {detalheOS.codigo}
              </h2>
              <button onClick={() => setDetalheOS(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#605e5c', lineHeight: 1 }}>
                x
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#0078d4', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '1px' }}>
                Veiculo
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '13px', color: '#323130' }}>
                <span><strong>Placa:</strong> {detalheOS.placa}</span>
                <span><strong>Modelo:</strong> {detalheOS.modelo}</span>
                <span><strong>Cor:</strong> {detalheOS.cor}</span>
                <span><strong>Status:</strong> <span style={statusBadge(detalheOS.status)}>{ABA_LABELS[detalheOS.status]}</span></span>
              </div>
              <p style={{ marginTop: '6px', fontSize: '13px', color: '#323130' }}>
                <strong>Descricao:</strong> {detalheOS.descricao}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '14px', marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#107c10', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '1px' }}>
                Proprietario
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '13px', color: '#323130' }}>
                <span><strong>Nome:</strong> {detalheOS.cliente}</span>
                <span><strong>CPF:</strong> {detalheOS.cpf}</span>
                <span><strong>Telefone:</strong> {detalheOS.telefone}</span>
                <span><strong>Email:</strong> {detalheOS.email}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#605e5c' }}>Data: {detalheOS.data}</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#107c10' }}>
                R$ {parseFloat(detalheOS.valor).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
