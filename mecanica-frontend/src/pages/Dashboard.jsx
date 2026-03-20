import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate()

    const servicos = [
        { id: 1, cliente: 'João Silva', placa: 'ABC-1234', status: 'Em espera' },
        { id: 2, cliente: 'Maria Santos', placa: 'XYZ-5678', status: 'Em espera' }
    ]

    const handleCadastrar = () => navigate('/cadastro')
    const handleEditar = (id) => navigate(`/editar/${id}`)

    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        Serviços ({servicos.length})
                    </h1>
                    <button
                        onClick={handleCadastrar}
                        style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        + Cadastrar Serviço
                    </button>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Cliente
                                </th>
                                <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Placa
                                </th>
                                <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '600' }}>
                                    Status
                                </th>
                                <th style={{ padding: '1.5rem 1rem 1.5rem 0', textAlign: 'right', fontWeight: '600' }}>
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicos.map(servico => (
                                <tr key={servico.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1.5rem 1rem' }}>{servico.cliente}</td>
                                    <td style={{ padding: '1.5rem 1rem' }}>{servico.placa}</td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <span style={{
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500'
                                        }}>
                                            {servico.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem 1.5rem 0', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEditar(servico.id)}
                                            style={{
                                                color: '#3b82f6',
                                                background: '#eff6ff',
                                                border: '1px solid #bfdbfe',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                marginRight: '0.5rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button style={{
                                            color: '#ef4444',
                                            background: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
