import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001'

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
    const [ordens, setOrdens] = useState([])
    const [contagens, setContagens] = useState({ 'em andamento': 0, 'iniciado': 0, 'finalizado': 0 })
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [detalheOS, setDetalheOS] = useState(null)

    // Contagens de todas as abas
    useEffect(() => {
        fetch(`${API}/ordens`)
            .then((r) => r.json())
            .then((data) => {
                const c = { 'em andamento': 0, 'iniciado': 0, 'finalizado': 0 }
                data.forEach((os) => { if (c[os.status] !== undefined) c[os.status]++ })
                setContagens(c)
            })
            .catch(() => { })
    }, [ordens])

    // OS filtradas por aba + busca
    useEffect(() => {
        setCarregando(true)
        setErro('')
        const params = new URLSearchParams({ status: abaAtiva })
        if (busca.trim()) params.append('busca', busca.trim())

        fetch(`${API}/ordens?${params}`)
            .then((r) => r.json())
            .then((data) => { setOrdens(data); setCarregando(false) })
            .catch(() => {
                setErro('Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando na porta 3001.')
                setCarregando(false)
            })
    }, [abaAtiva, busca])

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

    return (
        <div style={pageStyle}>

            {/* CABECALHO */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a5f', margin: 0 }}>
                    Ordens de Servico
                </h1>
                <button
                    style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                    onClick={() => navigate('/cadastro-veiculo')}
                >
                    + Nova OS
                </button>
            </div>

            {/* ERRO DE CONEXAO */}
            {erro && (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', color: '#b91c1c', fontSize: '14px', marginBottom: '16px' }}>
                    {erro}
                </div>
            )}

            {/* ABAS */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
                {ABAS.map((aba) => (
                    <button key={aba} onClick={() => setAbaAtiva(aba)} style={{
                        padding: '10px 22px', border: 'none', backgroundColor: 'transparent',
                        borderBottom: abaAtiva === aba ? '3px solid #3b82f6' : '3px solid transparent',
                        color: abaAtiva === aba ? '#3b82f6' : '#64748b',
                        fontWeight: abaAtiva === aba ? '700' : '500',
                        fontSize: '14px', cursor: 'pointer', marginBottom: '-2px',
                    }}>
                        {ABA_LABELS[aba]}
                        <span style={{
                            marginLeft: '8px',
                            backgroundColor: abaAtiva === aba ? '#3b82f6' : '#e2e8f0',
                            color: abaAtiva === aba ? '#fff' : '#64748b',
                            borderRadius: '12px', padding: '1px 8px', fontSize: '12px', fontWeight: '700',
                        }}>
                            {contagens[aba]}
                        </span>
                    </button>
                ))}
            </div>

            {/* BUSCA */}
            <input
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box', marginBottom: '20px', outline: 'none' }}
                type="text"
                placeholder="Buscar por placa ou CPF..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            {/* LISTA */}
            {carregando ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>Carregando...</div>
            ) : ordens.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: '15px' }}>Nenhuma ordem encontrada.</div>
            ) : (
                ordens.map((os) => (
                    <div key={os.codigo} style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '20px 24px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                <span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '15px' }}>{os.codigo}</span>
                                <span style={{ fontWeight: '700', color: '#374151', fontSize: '15px' }}>{os.placa}</span>
                                <span style={statusBadge(os.status)}>{ABA_LABELS[os.status]}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <span><strong style={{ color: '#374151' }}>Cliente:</strong> {os.cliente}</span>
                                <span><strong style={{ color: '#374151' }}>CPF:</strong> {os.cpf}</span>
                                <span><strong style={{ color: '#374151' }}>Data:</strong> {os.data}</span>
                                <span><strong style={{ color: '#374151' }}>Valor:</strong>{' '}
                                    <span style={{ color: '#10b981', fontWeight: '700' }}>R$ {Number(os.valor).toFixed(2).replace('.', ',')}</span>
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <button style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginRight: '8px' }}
                                onClick={() => navigate(`/editar/${os.codigo}`)}>
                                Editar
                            </button>
                            <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                                onClick={() => setDetalheOS(os)}>
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
                            <h2 style={{ margin: 0, fontSize: '18px', color: '#1e3a5f', fontWeight: '700' }}>Detalhes — {detalheOS.codigo}</h2>
                            <button onClick={() => setDetalheOS(null)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>x</button>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', margin: '0 0 10px 0', letterSpacing: '1px' }}>Veiculo</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '14px', color: '#374151' }}>
                                <span><strong>Placa:</strong> {detalheOS.placa}</span>
                                <span><strong>Modelo:</strong> {detalheOS.modelo}</span>
                                <span><strong>Cor:</strong> {detalheOS.cor}</span>
                                <span><strong>Status:</strong> <span style={statusBadge(detalheOS.status)}>{ABA_LABELS[detalheOS.status]}</span></span>
                            </div>
                            <p style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}><strong>Descricao:</strong> {detalheOS.descricao}</p>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '16px' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', margin: '0 0 10px 0', letterSpacing: '1px' }}>Proprietario</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '14px', color: '#374151' }}>
                                <span><strong>Nome:</strong> {detalheOS.cliente}</span>
                                <span><strong>CPF:</strong> {detalheOS.cpf}</span>
                                <span><strong>Telefone:</strong> {detalheOS.telefone}</span>
                                <span><strong>Email:</strong> {detalheOS.email}</span>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>Data: {detalheOS.data}</span>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>R$ {Number(detalheOS.valor).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}