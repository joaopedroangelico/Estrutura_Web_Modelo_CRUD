const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'oficina_mecanica',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    })

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no PostgreSQL:', err.message)
    } else {
        const modo = connectionString ? 'Neon (nuvem)' : 'local'
        console.log(`Conectado ao PostgreSQL com sucesso. [${modo}]`)
    }
})

module.exports = pool