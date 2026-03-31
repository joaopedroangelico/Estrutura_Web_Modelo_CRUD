const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db')
const app = express()

app.use(cors())
app.use(express.json())

// =============================================
// UTILITARIO: gera proximo codigo OS-XXX
// =============================================
async function gerarCodigoOS() {
    const result = await pool.query(
        "SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1"
    )
    if (result.rows.length === 0) return 'OS-001'
    const ultimo = result.rows[0].codigo  // ex: OS-003
    const num = parseInt(ultimo.split('-')[1]) + 1
    return `OS-${String(num).padStart(3, '0')}`
}

// =============================================
// ORDENS DE SERVICO
// =============================================

// GET /ordens - lista todas as OS com dados do veiculo e proprietario
app.get('/ordens', async (req, res) => {
    try {
        const { status, busca } = req.query

        let query = `
      SELECT
        os.id,
        os.codigo,
        os.descricao,
        os.status,
        os.valor,
        TO_CHAR(os.criado_em, 'DD/MM/YYYY') AS data,
        v.placa,
        v.modelo,
        v.cor,
        p.cpf,
        p.nome    AS cliente,
        p.telefone,
        p.email
      FROM ordens_servico os
      JOIN veiculos    v ON v.id = os.veiculo_id
      JOIN proprietarios p ON p.id = v.proprietario_id
      WHERE 1=1
    `
        const params = []

        if (status) {
            params.push(status)
            query += ` AND os.status = $${params.length}`
        }

        if (busca) {
            params.push(`%${busca}%`)
            query += ` AND (v.placa ILIKE $${params.length} OR p.cpf ILIKE $${params.length})`
        }

        query += ' ORDER BY os.id DESC'

        const result = await pool.query(query, params)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar ordens de servico.' })
    }
})

// GET /ordens/:codigo - busca uma OS pelo codigo (ex: OS-001)
app.get('/ordens/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params
        const result = await pool.query(`
      SELECT
        os.id,
        os.codigo,
        os.descricao,
        os.status,
        os.valor,
        TO_CHAR(os.criado_em, 'DD/MM/YYYY') AS data,
        v.placa,
        v.modelo,
        v.cor,
        p.cpf,
        p.nome    AS cliente,
        p.telefone,
        p.email
      FROM ordens_servico os
      JOIN veiculos      v ON v.id = os.veiculo_id
      JOIN proprietarios p ON p.id = v.proprietario_id
      WHERE os.codigo = $1
    `, [codigo])

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Ordem de servico nao encontrada.' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar ordem de servico.' })
    }
})

// POST /ordens - cria nova OS (com veiculo e proprietario)
app.post('/ordens', async (req, res) => {
    const client = await pool.connect()
    try {
        const { veiculo, proprietario } = req.body

        // Validacoes basicas
        if (!veiculo?.placa || !veiculo?.modelo) {
            return res.status(400).json({ erro: 'Placa e modelo sao obrigatorios.' })
        }
        if (!proprietario?.cpf || !proprietario?.nome) {
            return res.status(400).json({ erro: 'CPF e nome do proprietario sao obrigatorios.' })
        }

        await client.query('BEGIN')

        // 1. Upsert proprietario (se CPF ja existe, atualiza dados)
        const propResult = await client.query(`
      INSERT INTO proprietarios (cpf, nome, telefone, email)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (cpf) DO UPDATE
        SET nome     = EXCLUDED.nome,
            telefone = EXCLUDED.telefone,
            email    = EXCLUDED.email
      RETURNING id
    `, [proprietario.cpf, proprietario.nome, proprietario.telefone, proprietario.email])

        const proprietarioId = propResult.rows[0].id

        // 2. Upsert veiculo (se placa ja existe, atualiza dados)
        const veicResult = await client.query(`
      INSERT INTO veiculos (placa, modelo, cor, proprietario_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (placa) DO UPDATE
        SET modelo          = EXCLUDED.modelo,
            cor             = EXCLUDED.cor,
            proprietario_id = EXCLUDED.proprietario_id
      RETURNING id
    `, [veiculo.placa, veiculo.modelo, veiculo.cor, proprietarioId])

        const veiculoId = veicResult.rows[0].id

        // 3. Criar OS
        const codigo = await gerarCodigoOS()
        const osResult = await client.query(`
      INSERT INTO ordens_servico (codigo, veiculo_id, descricao, status, valor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [codigo, veiculoId, veiculo.descricao, veiculo.status || 'iniciado', veiculo.valor || 0])

        await client.query('COMMIT')

        res.status(201).json({
            mensagem: 'Ordem de servico criada com sucesso.',
            codigo,
            os: osResult.rows[0],
        })
    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err)
        res.status(500).json({ erro: 'Erro ao criar ordem de servico.' })
    } finally {
        client.release()
    }
})

// PUT /ordens/:codigo - atualiza uma OS existente
app.put('/ordens/:codigo', async (req, res) => {
    const client = await pool.connect()
    try {
        const { codigo } = req.params
        const { veiculo, proprietario } = req.body

        // Busca a OS atual
        const osAtual = await client.query(
            'SELECT * FROM ordens_servico WHERE codigo = $1', [codigo]
        )
        if (osAtual.rows.length === 0) {
            return res.status(404).json({ erro: 'Ordem de servico nao encontrada.' })
        }

        await client.query('BEGIN')

        // 1. Atualiza proprietario
        await client.query(`
      UPDATE proprietarios SET
        nome     = $1,
        telefone = $2,
        email    = $3
      WHERE cpf = $4
    `, [proprietario.nome, proprietario.telefone, proprietario.email, proprietario.cpf])

        // 2. Atualiza veiculo
        await client.query(`
      UPDATE veiculos SET
        modelo = $1,
        cor    = $2
      WHERE placa = $3
    `, [veiculo.modelo, veiculo.cor, veiculo.placa])

        // 3. Atualiza OS
        await client.query(`
      UPDATE ordens_servico SET
        descricao     = $1,
        status        = $2,
        valor         = $3,
        atualizado_em = NOW()
      WHERE codigo = $4
    `, [veiculo.descricao, veiculo.status, veiculo.valor, codigo])

        await client.query('COMMIT')

        res.json({ mensagem: 'Ordem de servico atualizada com sucesso.' })
    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar ordem de servico.' })
    } finally {
        client.release()
    }
})

// DELETE /ordens/:codigo - exclui uma OS
app.delete('/ordens/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params
        const result = await pool.query(
            'DELETE FROM ordens_servico WHERE codigo = $1 RETURNING id', [codigo]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Ordem de servico nao encontrada.' })
        }
        res.json({ mensagem: 'Ordem de servico excluida com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao excluir ordem de servico.' })
    }
})

// =============================================
// INICIAR SERVIDOR
// =============================================
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})