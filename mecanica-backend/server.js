const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const pool = require('./db')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', banco: 'conectado', timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(503).json({ status: 'erro', banco: 'desconectado', timestamp: new Date().toISOString() })
  }
})

// =============================================
// UTILITÁRIO: gera próximo código OS-XXX
// =============================================
async function gerarCodigoOS() {
    const result = await pool.query(
        "SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1"
    )
    if (result.rows.length === 0) return 'OS-001'
    const ultimo = result.rows[0].codigo
    const num = parseInt(ultimo.split('-')[1]) + 1
    return `OS-${String(num).padStart(3, '0')}`
}

// =============================================
// AUTH
// =============================================

app.post('/auth/login', async (req, res) => {
    try {
        const { usuario, senha } = req.body
        if (!usuario || !senha) {
            return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' })
        }
        const result = await pool.query(
            'SELECT id, nome, usuario, funcao, role FROM funcionarios WHERE usuario = $1 AND senha = $2',
            [usuario, senha]
        )
        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao autenticar.' })
    }
})

// =============================================
// FUNCIONÁRIOS
// =============================================

app.get('/funcionarios', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, nome, usuario, funcao, role,
                   TO_CHAR(criado_em, 'DD/MM/YYYY') AS criado_em
            FROM funcionarios
            ORDER BY nome
        `)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar funcionários.' })
    }
})

app.post('/funcionarios', async (req, res) => {
    try {
        const { nome, usuario, senha, funcao, role } = req.body
        if (!nome || !usuario || !senha || !funcao) {
            return res.status(400).json({ erro: 'Nome, usuário, senha e função são obrigatórios.' })
        }
        const result = await pool.query(
            'INSERT INTO funcionarios (nome, usuario, senha, funcao, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [nome, usuario, senha, funcao, role || 'funcionario']
        )
        res.status(201).json({ mensagem: 'Funcionário cadastrado com sucesso.', id: result.rows[0].id })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ erro: 'Usuário já existe.' })
        }
        console.error(err)
        res.status(500).json({ erro: 'Erro ao cadastrar funcionário.' })
    }
})

app.put('/funcionarios/:id', async (req, res) => {
    try {
        const { nome, funcao, role, senha } = req.body
        if (senha) {
            await pool.query(
                'UPDATE funcionarios SET nome=$1, funcao=$2, role=$3, senha=$4 WHERE id=$5',
                [nome, funcao, role, senha, req.params.id]
            )
        } else {
            await pool.query(
                'UPDATE funcionarios SET nome=$1, funcao=$2, role=$3 WHERE id=$4',
                [nome, funcao, role, req.params.id]
            )
        }
        res.json({ mensagem: 'Funcionário atualizado com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar funcionário.' })
    }
})

app.delete('/funcionarios/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM funcionarios WHERE id=$1 RETURNING id', [req.params.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Funcionário não encontrado.' })
        }
        res.json({ mensagem: 'Funcionário excluído com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao excluir funcionário.' })
    }
})

// =============================================
// ITENS DE SERVIÇO
// =============================================

app.get('/itens', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM itens ORDER BY nome')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar itens.' })
    }
})

app.post('/itens', async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body
        if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' })
        const result = await pool.query(
            'INSERT INTO itens (nome, descricao, preco) VALUES ($1, $2, $3) RETURNING id',
            [nome, descricao || '', preco || 0]
        )
        res.status(201).json({ mensagem: 'Item cadastrado com sucesso.', id: result.rows[0].id })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ erro: 'Item com esse nome já existe.' })
        }
        console.error(err)
        res.status(500).json({ erro: 'Erro ao cadastrar item.' })
    }
})

app.put('/itens/:id', async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body
        const result = await pool.query(
            'UPDATE itens SET nome=$1, descricao=$2, preco=$3 WHERE id=$4 RETURNING id',
            [nome, descricao, preco, req.params.id]
        )
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado.' })
        res.json({ mensagem: 'Item atualizado com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar item.' })
    }
})

app.delete('/itens/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM itens WHERE id=$1 RETURNING id', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado.' })
        res.json({ mensagem: 'Item excluído com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao excluir item.' })
    }
})

// =============================================
// CATÁLOGO DE SERVIÇOS
// =============================================

app.get('/servicos-catalogo', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM servicos_catalogo ORDER BY nome')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar serviços.' })
    }
})

app.post('/servicos-catalogo', async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body
        if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' })
        const result = await pool.query(
            'INSERT INTO servicos_catalogo (nome, descricao, preco) VALUES ($1, $2, $3) RETURNING id',
            [nome, descricao || '', preco || 0]
        )
        res.status(201).json({ mensagem: 'Serviço cadastrado com sucesso.', id: result.rows[0].id })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ erro: 'Serviço com esse nome já existe.' })
        }
        console.error(err)
        res.status(500).json({ erro: 'Erro ao cadastrar serviço.' })
    }
})

app.put('/servicos-catalogo/:id', async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body
        const result = await pool.query(
            'UPDATE servicos_catalogo SET nome=$1, descricao=$2, preco=$3 WHERE id=$4 RETURNING id',
            [nome, descricao, preco, req.params.id]
        )
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Serviço não encontrado.' })
        res.json({ mensagem: 'Serviço atualizado com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar serviço.' })
    }
})

app.delete('/servicos-catalogo/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM servicos_catalogo WHERE id=$1 RETURNING id', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Serviço não encontrado.' })
        res.json({ mensagem: 'Serviço excluído com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao excluir serviço.' })
    }
})

// =============================================
// ORDENS DE SERVIÇO
// =============================================

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
                p.nome       AS cliente,
                p.telefone,
                p.email,
                a.nome       AS atendente,
                m.nome       AS mecanico,
                os.atendente_id,
                os.mecanico_id
            FROM ordens_servico os
            JOIN veiculos      v ON v.id = os.veiculo_id
            JOIN proprietarios p ON p.id = v.proprietario_id
            LEFT JOIN funcionarios a ON a.id = os.atendente_id
            LEFT JOIN funcionarios m ON m.id = os.mecanico_id
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
        res.status(500).json({ erro: 'Erro ao buscar ordens de serviço.' })
    }
})

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
                p.nome       AS cliente,
                p.telefone,
                p.email,
                a.nome       AS atendente,
                m.nome       AS mecanico,
                os.atendente_id,
                os.mecanico_id
            FROM ordens_servico os
            JOIN veiculos      v ON v.id = os.veiculo_id
            JOIN proprietarios p ON p.id = v.proprietario_id
            LEFT JOIN funcionarios a ON a.id = os.atendente_id
            LEFT JOIN funcionarios m ON m.id = os.mecanico_id
            WHERE os.codigo = $1
        `, [codigo])
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Ordem de serviço não encontrada.' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao buscar ordem de serviço.' })
    }
})

app.post('/ordens', async (req, res) => {
    const client = await pool.connect()
    try {
        const { veiculo, proprietario } = req.body
        if (!veiculo?.placa || !veiculo?.modelo) {
            return res.status(400).json({ erro: 'Placa e modelo são obrigatórios.' })
        }
        if (!proprietario?.cpf || !proprietario?.nome) {
            return res.status(400).json({ erro: 'CPF e nome do proprietário são obrigatórios.' })
        }
        await client.query('BEGIN')
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
        const codigo = await gerarCodigoOS()
        const osResult = await client.query(`
            INSERT INTO ordens_servico (codigo, veiculo_id, descricao, status, valor, atendente_id, mecanico_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [codigo, veiculoId, veiculo.descricao, veiculo.status || 'iniciado',
            veiculo.valor || 0, veiculo.atendente_id || null, veiculo.mecanico_id || null])
        await client.query('COMMIT')
        res.status(201).json({ mensagem: 'Ordem de serviço criada com sucesso.', codigo, os: osResult.rows[0] })
    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err)
        res.status(500).json({ erro: 'Erro ao criar ordem de serviço.' })
    } finally {
        client.release()
    }
})

app.put('/ordens/:codigo', async (req, res) => {
    const client = await pool.connect()
    try {
        const { codigo } = req.params
        const { veiculo, proprietario } = req.body
        const osAtual = await client.query('SELECT * FROM ordens_servico WHERE codigo=$1', [codigo])
        if (osAtual.rows.length === 0) {
            return res.status(404).json({ erro: 'Ordem de serviço não encontrada.' })
        }
        await client.query('BEGIN')
        await client.query(
            'UPDATE proprietarios SET nome=$1, telefone=$2, email=$3 WHERE cpf=$4',
            [proprietario.nome, proprietario.telefone, proprietario.email, proprietario.cpf]
        )
        await client.query(
            'UPDATE veiculos SET modelo=$1, cor=$2 WHERE placa=$3',
            [veiculo.modelo, veiculo.cor, veiculo.placa]
        )
        await client.query(`
            UPDATE ordens_servico SET
                descricao     = $1,
                status        = $2,
                valor         = $3,
                atendente_id  = $4,
                mecanico_id   = $5,
                atualizado_em = NOW()
            WHERE codigo = $6
        `, [veiculo.descricao, veiculo.status, veiculo.valor,
            veiculo.atendente_id || null, veiculo.mecanico_id || null, codigo])
        await client.query('COMMIT')
        res.json({ mensagem: 'Ordem de serviço atualizada com sucesso.' })
    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar ordem de serviço.' })
    } finally {
        client.release()
    }
})

app.delete('/ordens/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params
        const result = await pool.query(
            'DELETE FROM ordens_servico WHERE codigo=$1 RETURNING id', [codigo]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Ordem de serviço não encontrada.' })
        }
        res.json({ mensagem: 'Ordem de serviço excluída com sucesso.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao excluir ordem de serviço.' })
    }
})

// =============================================
// INICIAR SERVIDOR
// =============================================
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
