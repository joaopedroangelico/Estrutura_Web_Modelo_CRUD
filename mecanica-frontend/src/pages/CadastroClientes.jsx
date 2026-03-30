// Substitua seu CadastroClientes.jsx por este:
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CadastroVeiculos() {
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    cor: '',
    descricao: '',
    cpfProprietario: '',
    nomeProprietario: '',
    telefone: '',
    email: ''
  })
  //const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTimeout(() => {
      alert(`Veículo ${formData.placa} cadastrado!\nProprietário: ${formData.nomeProprietario}`)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1.5rem' 
          }}>
            🚗 Cadastrar Veículo
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 🚗 DADOS DO VEÍCULO (PRIORITÁRIO) */}
            <div style={{ 
              background: '#f0f9ff', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '2px solid #0ea5e9' 
            }}>
              <h3 style={{ 
                marginBottom: '1rem', 
                fontSize: '1.3rem', 
                fontWeight: '700',
                color: '#0369a1'
              }}>
                Dados do Veículo
              </h3>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Placa *
                  </label>
                  <input
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    placeholder="ABC-1234"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Modelo
                  </label>
                  <input
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Gol G5 1.0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Cor
                  </label>
                  <input
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    placeholder="Prata"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Descrição do Problema
                  </label>
                  <input
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Ruído no motor, falha ao acelerar..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 👤 DADOS DO PROPRIETÁRIO (Secundário) */}
            <div style={{ 
              background: '#f0fdf4', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '2px solid #10b981' 
            }}>
              <h3 style={{ 
                marginBottom: '1rem', 
                fontSize: '1.3rem', 
                fontWeight: '700',
                color: '#065f46'
              }}>
                Dados do Proprietário
              </h3>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  CPF Proprietário *
                </label>
                <input
                  name="cpfProprietario"
                  value={formData.cpfProprietario}
                  onChange={handleChange}
                  placeholder="123.456.789-00"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Nome Completo
                  </label>
                  <input
                    name="nomeProprietario"
                    value={formData.nomeProprietario}
                    onChange={handleChange}
                    placeholder="João Silva"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email (opcional)
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="joao@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            {/* BOTÕES */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                💾 Cadastrar Veículo
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  color: 'white',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CadastroVeiculos