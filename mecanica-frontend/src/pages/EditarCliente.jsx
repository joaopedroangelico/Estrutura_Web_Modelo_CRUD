import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarCliente() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    modelo: '',
    placa: '',
    cor: '',
    descricao: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setFormData({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        email: 'joao@email.com',
        modelo: 'Gol G5',
        placa: 'ABC-1234',
        cor: 'Prata',
        descricao: 'Veículo em bom estado geral'
      })
      setLoading(false)
    }, 500)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTimeout(() => {
      alert('Cliente e veículo atualizados!')
      navigate('/dashboard')
    }, 500)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>Carregando...</div>
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            Editar Cliente
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* DADOS DO CLIENTE */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome Completo</label>
              <input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CPF</label>
              <input
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Telefone</label>
                <input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
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

            {/* DADOS DO VEÍCULO */}
            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Dados do Veículo
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Modelo</label>
                  <input
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Gol G5"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ flex: '0 0 120px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Placa</label>
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
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ flex: '1 1 150px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cor</label>
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

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descrição</label>
                  <input
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Alguma observação especial..."
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

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Atualizar Cliente + Veículo
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarCliente
