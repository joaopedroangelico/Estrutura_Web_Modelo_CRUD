import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#667eea'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px'
          }}
        >
          Dashboard
        </button>
      </div>
    </div>
  )
}

export default Login