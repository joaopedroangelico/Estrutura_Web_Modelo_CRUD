const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
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
        console.log('Conectado ao PostgreSQL com sucesso.')
    }
})

module.exports = pool