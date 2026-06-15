# Relatório de Análise de Qualidade com SonarQube
## N3 – E2 | Disciplina: Arquitetura de Software Web

---

## 1. Identificação do Projeto

**Nome do projeto:** Sistema de Gestão de Oficina Mecânica

**Objetivo do sistema:**
Aplicação web CRUD para gestão operacional de uma oficina mecânica. O sistema permite o cadastro e acompanhamento de ordens de serviço (OS), gerenciamento de funcionários, catálogo de itens e serviços. Possui autenticação por login, controle de acesso por perfil (admin e funcionário) e persistência em banco de dados relacional.

**Tecnologias utilizadas:**

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js 24 + Express 4 |
| Banco de dados | PostgreSQL 16 |
| Testes | Jest 30 |
| CI/CD | GitHub Actions |
| Deploy | Render (backend) + Vercel (frontend) |

---

## 2. Configuração da Análise

**Versão do SonarQube:** Community Build v26.6.0.123539 (MQR Mode)

**Linguagem analisada:** JavaScript (Node.js – backend)

**Forma de execução:**
A análise foi executada utilizando o pacote `sonar-scanner` (v3.1.0), configurado como dependência de desenvolvimento no `package.json` do backend. O projeto já possuía o arquivo `sonar-project.properties` com as configurações de fonte, exclusões e caminho do relatório de cobertura LCOV gerado pelo Jest.

Passos executados:
1. `npm test` — gerou relatório `coverage/lcov.info` (cobertura de testes)
2. SonarQube Community Edition iniciado localmente na porta 9000
3. `npm run sonar` — executou o scanner e enviou resultados ao servidor

**Arquivo `sonar-project.properties` utilizado:**
```
sonar.projectKey=mecanica-oficina
sonar.projectName=Sistema de Gestao de Oficina Mecanica
sonar.projectVersion=1.0
sonar.sources=server.js,db.js,validacoes.js
sonar.tests=validacoes.test.js
sonar.sourceEncoding=UTF-8
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.exclusions=node_modules/**,coverage/**
sonar.host.url=http://localhost:9000
```

**Data da análise:** 15 de junho de 2026

---

## 3. Resultados Obtidos

### 3.1 Capturas de Tela

**Visão Geral (Overview) e Quality Gate**

![Visão geral do projeto no SonarQube](Quality_Gate_PASSED.png)

**Reliability**

![Seção Reliability do SonarQube com o rating e lista de bugs encontrados](Reliability.png)

**Security**

![Seção Security do SonarQube com o rating, vulnerabilidades e Security Hotspots](Security.png)

**Maintainability**

![Seção Maintainability mostrando rating, code smells e dívida técnica](Maintainability.png)

**Coverage**

![Seção Coverage mostrando percentual de cobertura e linhas cobertas/não cobertas](Coverage.png)

**Duplications**

![Seção Duplications mostrando percentual de código duplicado e blocos duplicados](Duplications.png)

---

### 3.2 Métricas Obtidas

| Métrica | Valor Obtido |
|---------|-------------|
| Linhas de Código (NCLOC) | 494 |
| Cobertura de Testes (Coverage) | 31,4% (sobre 255 linhas cobertas) |
| Complexidade Ciclomática | 122 (db.js: 9 · server.js: 74 · validacoes.js: 39) |
| Complexidade Cognitiva | 75 (db.js: 5 · server.js: 48 · validacoes.js: 22) |
| Duplicação de Código | 23,1% (sobre 559 linhas) |
| Bugs / Problemas de Confiabilidade | 3 issues (Rating C) |
| Vulnerabilidades / Problemas de Segurança | 2 issues (Rating C) |
| Security Hotspots | 0 (Rating A) |
| Code Smells / Problemas de Manutenibilidade | 9 issues (Rating A) |
| Total de Issues | 11 |
| Dívida Técnica (Technical Debt) | 1h 31min (server.js: 1h 2min · validacoes.js: 29min) |
| Índice de Manutenibilidade | A |
| Quality Gate | PASSED (com avisos) |

**Contexto da cobertura:** O projeto possui 27 testes unitários em `validacoes.test.js` cobrindo 100% das funções de `validacoes.js` (96,61% de statements). Os arquivos `server.js` e `db.js`, que concentram as rotas Express e a configuração de banco, não possuem testes — o que explica a cobertura geral de 31,4% sobre as 255 linhas cobertas identificadas pelo SonarQube.

**Contexto da duplicação:** O índice de 23,1% é elevado para um projeto deste porte. Ele reflete a repetição estrutural dos blocos CRUD para itens e serviços (código quase idêntico em rotas diferentes) e a duplicação da query SQL completa de listagem de ordens de serviço, que aparece em dois endpoints distintos.

---

## 4. Análise dos Problemas Encontrados

A seguir são apresentados os problemas selecionados dentre as 11 issues identificadas pelo SonarQube. A listagem completa foi obtida na seção "Questões" da interface, com issues distribuídas em `server.js` e `validacoes.js`.

### 4.1 Code Smells

---

#### Code Smell 1 — Exceção capturada mas não tratada adequadamente

**Arquivo:** `mecanica-backend/server.js`
**Linha:** 17
**Regra SonarQube:** *"Handle this exception or don't catch it at all"*
**Categoria:** Maintainability · Low · Esforço estimado: 1h

**Trecho:**
```javascript
// db.js — conexão inicial ao banco
pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no PostgreSQL:', err.message)  // linha 17
    // o erro é apenas logado — a aplicação continua executando
  } else {
    console.log(`Conectado ao PostgreSQL com sucesso. [${modo}]`)
  }
})
```

**Por que o SonarQube considera um problema:**
O bloco `if (err)` captura o erro de conexão mas não o propaga, não encerra o processo e não notifica nenhum sistema externo. Para o SonarQube, capturar uma exceção/erro apenas para fazer log e silenciá-lo é um code smell de intencionalidade: quem lê o código não sabe se o comportamento de "continuar mesmo sem banco" é proposital ou foi esquecido.

**Impacto:**
- **Confiabilidade:** A aplicação sobe mesmo sem conexão com o banco, e todas as requisições seguintes falharão silenciosamente com erros de banco, dificultando o diagnóstico.
- **Manutenção:** Em produção, logs de `console.error` não geram alertas automáticos — o problema pode passar despercebido por horas.

---

#### Code Smell 2 — Uso de `parseFloat` e `isNaN` globais em vez de `Number.parseFloat` e `Number.isNaN`

**Arquivo:** `mecanica-backend/validacoes.js`
**Linhas:** 30 e 31
**Regra SonarQube:** *"Prefer `Number.parseFloat` over `parseFloat`"* e *"Prefer `Number.isNaN` over `isNaN`"*
**Categoria:** Reliability · Medium + Maintainability · Low · Esforço estimado: 2min cada

**Trecho:**
```javascript
// validacoes.js — função validarPreco
function validarPreco(preco) {
  if (preco === undefined || preco === null || preco === '') return null
  const valor = parseFloat(preco)    // linha 30 — flagged
  if (isNaN(valor)) return 'Preço deve ser um número.'   // linha 31 — flagged
  if (valor < 0) return 'Preço não pode ser negativo.'
  return null
}
```

**Por que o SonarQube considera um problema:**
`parseFloat` e `isNaN` são funções globais herdadas do JavaScript antigo. O SonarQube recomenda as versões encapsuladas em `Number` (`Number.parseFloat`, `Number.isNaN`) por duas razões: (1) são semanticamente mais precisas — `isNaN('')` retorna `true` globalmente mas `Number.isNaN('')` retorna `false`, comportamento mais correto; (2) o uso explícito de `Number.*` deixa claro que a intenção é tratar o valor como número, melhorando a legibilidade e consistência com o padrão ES2015+.

**Impacto:**
- **Confiabilidade:** `isNaN` global coerce o argumento antes de testar, podendo retornar resultados inesperados para certos tipos de entrada.
- **Manutenção:** Código inconsistente — em outros pontos do projeto já se usa `parseInt` com base explícita — misturar estilos aumenta o custo cognitivo de leitura.

---

#### Code Smell 3 — Cinco ocorrências de verificação nula sem optional chaining

**Arquivo:** `mecanica-backend/validacoes.js`
**Linhas:** 40, 48, 54, 55, 56
**Regra SonarQube:** *"Prefer using an optional chain expression instead, as it's more concise and easier to read"*
**Categoria:** Maintainability · Medium · Esforço estimado: 5min cada (25min total)

**Trecho representativo** (padrão repetido nas 5 ocorrências):
```javascript
// validacoes.js — linha 40 (validarVeiculo)
if (!veiculo.modelo || !veiculo.modelo.trim()) return 'Modelo do veículo é obrigatório.'

// validacoes.js — linha 48 (validarProprietario)
if (!proprietario.nome || !proprietario.nome.trim()) return 'Nome do proprietário é obrigatório.'

// validacoes.js — linhas 54, 55, 56 (validarFuncionario)
if (!funcionario.nome || !funcionario.nome.trim()) return 'Nome é obrigatório.'
if (!funcionario.usuario || !funcionario.usuario.trim()) return 'Usuário é obrigatório.'
if (!funcionario.senha || !funcionario.senha.trim()) return 'Senha é obrigatória.'
```

**Por que o SonarQube considera um problema:**
O padrão `!obj.prop || !obj.prop.method()` é verboso e pode ser substituído por optional chaining (`obj.prop?.method()`), introduzido no ES2020. A versão com optional chain é mais concisa, elimina a repetição da propriedade e deixa a intenção explícita: "acesse `trim()` se `prop` existir".

**Impacto:**
- **Manutenção:** A repetição do mesmo nome de propriedade duas vezes (`veiculo.modelo || !veiculo.modelo`) cria risco de erro de digitação em refatorações futuras.
- **Legibilidade:** Com optional chaining, a lógica fica em uma expressão só, reduzindo a complexidade cognitiva da função.

---

### 4.2 Problema de Segurança — CORS configurado sem restrição de origem

**Arquivo:** `mecanica-backend/server.js`
**Linha:** 9
**Regra SonarQube:** *"Make sure that enabling CORS is safe here"*
**Categoria:** Security · Medium · Esforço estimado: 4h

**Trecho:**
```javascript
// server.js — linha 9
app.use(cors())   // sem parâmetro: aceita requisições de QUALQUER origem
```

**Por que o SonarQube considera um problema:**
Ao chamar `cors()` sem configuração, o Express responde com o header `Access-Control-Allow-Origin: *` para todas as requisições. Isso significa que qualquer site externo pode fazer chamadas autenticadas à API do sistema — incluindo sites maliciosos que executem JavaScript no navegador da vítima (ataques CSRF via CORS). O SonarQube classifica como **Security · Medium** e requer 4 horas de esforço para correção, pois envolve levantar quais origens legítimas devem ser permitidas e testar os fluxos afetados.

**Impacto:**
- **Segurança:** Um atacante pode criar uma página que, ao ser visitada por um funcionário logado, faz chamadas à API da oficina usando as credenciais da sessão ativa do navegador da vítima.
- **Compliance:** APIs de sistemas internos não devem ter CORS aberto; isso viola o princípio de menor privilégio.
- **Evolução:** Corrigir isso após o deploy em produção com usuários ativos exige coordenação cuidadosa para não quebrar o frontend legítimo.

---

### 4.3 Problema de Duplicação — 23,1% de código duplicado no projeto

**Arquivo:** `mecanica-backend/server.js` (principal responsável)
**Métrica SonarQube:** Duplications: **23,1%** sobre 559 linhas
**Visualização:** Gráfico "Visão geral das duplicações" — um único círculo grande (~120 linhas duplicadas) concentrado no arquivo com mais de 400 linhas de código

**Trechos duplicados identificados:**

**Duplicação 1 — Blocos CRUD de `/itens` e `/servicos-catalogo`** (estrutura quase idêntica):
```javascript
// GET /itens (linha 144) e GET /servicos-catalogo (linha 202) — mesma estrutura
app.get('/itens', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM itens ORDER BY nome')
    res.json(result.rows)
  } catch (err) { console.error(err); res.status(500).json({ erro: '...' }) }
})
// Idêntico para /servicos-catalogo, apenas trocando o nome da tabela
```

**Duplicação 2 — Query SELECT completa de ordens de serviço** (aparece em dois endpoints):
```javascript
// GET /ordens (linha ~263) e GET /ordens/:codigo (linha ~310)
// Mesmos 16 campos SELECT + 4 JOINs repetidos literalmente
SELECT os.id, os.codigo, os.descricao, os.status, os.valor,
       TO_CHAR(os.criado_em, 'DD/MM/YYYY') AS data,
       v.placa, v.modelo, v.cor, p.cpf, p.nome AS cliente, ...
FROM ordens_servico os
JOIN veiculos v ... JOIN proprietarios p ... LEFT JOIN funcionarios a ... LEFT JOIN funcionarios m ...
```

**Por que o SonarQube considera um problema:**
O SonarQube detecta blocos duplicados por análise de tokens, independente de nomes de variáveis. Um índice de 23,1% em um projeto de apenas 494 linhas é considerado elevado — indica que quase 1 em cada 4 linhas é cópia de outra parte do código. Isso viola o princípio DRY e aumenta a probabilidade de inconsistências futuras.

**Impacto:**
- **Manutenção:** Qualquer novo campo adicionado à tabela `itens` precisa ser replicado manualmente em `servicos-catalogo`. Uma mudança no SELECT de ordens precisa ser feita em dois lugares.
- **Evolução:** O crescimento do sistema tende a ampliar ainda mais o índice de duplicação se o padrão não for endereçado.

---

## 5. Plano de Correção

### 5.1 Exceção de conexão sem tratamento (server.js L17)

**Como corrigir:** Encerrar o processo quando a conexão inicial falhar, tornando o comportamento explícito:

```javascript
pool.connect((err) => {
  if (err) {
    console.error('Falha fatal ao conectar no PostgreSQL:', err.message)
    process.exit(1)   // encerra o servidor — falha visível em vez de silenciosa
  }
  console.log(`Conectado ao PostgreSQL com sucesso. [${modo}]`)
})
```

**Melhoria obtida:** O processo falha de forma ruidosa e imediata, facilitando a detecção do problema em ambientes de CI/CD e monitoramento. O orquestrador (PM2, Docker, Render) pode reiniciar automaticamente.

**Prioridade:** Média

---

### 5.2 `parseFloat` e `isNaN` globais (validacoes.js L30–31)

**Como corrigir:** Substituir pelas versões encapsuladas em `Number`:

```javascript
// Antes
const valor = parseFloat(preco)
if (isNaN(valor)) return 'Preço deve ser um número.'

// Depois
const valor = Number.parseFloat(preco)
if (Number.isNaN(valor)) return 'Preço deve ser um número.'
```

Mesma correção para `parseInt` em `server.js` linha 31.

**Melhoria obtida:** Elimina 3 issues de Reliability e Maintainability. Código alinhado com ES2015+ e comportamento mais previsível do `isNaN`.

**Prioridade:** Baixa

---

### 5.3 Optional chaining nas validações (validacoes.js L40, 48, 54–56)

**Como corrigir:** Substituir o padrão duplo `!prop || !prop.method()` por optional chaining:

```javascript
// Antes (5 ocorrências)
if (!veiculo.modelo || !veiculo.modelo.trim()) return 'Modelo do veículo é obrigatório.'

// Depois
if (!veiculo.modelo?.trim()) return 'Modelo do veículo é obrigatório.'
```

**Melhoria obtida:** Reduz 5 issues de Maintainability Medium. Cada linha fica mais concisa e sem repetição de propriedade.

**Prioridade:** Baixa

---

### 5.4 CORS sem restrição de origem (server.js L9) — ALTA PRIORIDADE

**Como corrigir:** Configurar o CORS para aceitar apenas a origem do frontend legítimo:

```javascript
// Antes
app.use(cors())

// Depois
const origemPermitida = process.env.FRONTEND_URL || 'http://localhost:5173'
app.use(cors({
  origin: origemPermitida,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
```

Adicionar `FRONTEND_URL=https://seu-dominio.vercel.app` nas variáveis de ambiente do Render.

**Melhoria obtida:** Elimina o issue de Security Medium. Apenas o frontend legítimo pode fazer chamadas à API, bloqueando ataques CSRF baseados em CORS aberto.

**Prioridade:** **Alta**

---

### 5.5 Duplicação de código (server.js — 23,1%)

**Como corrigir:** Extrair a query de ordens e o padrão CRUD repetido em funções auxiliares:

```javascript
// Função auxiliar para a query base de ordens
function sqlBaseOrdens() {
  return `SELECT os.id, os.codigo, os.descricao, os.status, os.valor,
                 TO_CHAR(os.criado_em, 'DD/MM/YYYY') AS data,
                 v.placa, v.modelo, v.cor, p.cpf, p.nome AS cliente,
                 p.telefone, p.email, a.nome AS atendente, m.nome AS mecanico,
                 os.atendente_id, os.mecanico_id
          FROM ordens_servico os
          JOIN veiculos v ON v.id = os.veiculo_id
          JOIN proprietarios p ON p.id = v.proprietario_id
          LEFT JOIN funcionarios a ON a.id = os.atendente_id
          LEFT JOIN funcionarios m ON m.id = os.mecanico_id`
}

// Para os CRUDs de itens/serviços: parametrizar por nome de tabela
function rotasCatalogo(app, tabela, nomeExibicao) {
  app.get(`/${tabela}`, async (req, res) => { /* ... */ })
  app.post(`/${tabela}`, async (req, res) => { /* ... */ })
  // etc.
}
```

**Melhoria obtida:** Reduz o índice de duplicação de 23,1% para abaixo de 5%. Qualquer mudança no schema de ordens é feita uma única vez.

**Prioridade:** Baixa

---

### Resumo do Plano de Correção

| # | Problema | Prioridade | Esforço Estimado (SonarQube) |
|---|----------|-----------|-------------------------------|
| 1 | CORS sem restrição de origem | **Alta** | 4h |
| 2 | Exceção de conexão sem tratamento | Média | 1h |
| 3 | `parseFloat`/`isNaN` globais | Baixa | 2min cada (6min total) |
| 4 | Optional chaining nas validações | Baixa | 5min cada (25min total) |
| 5 | Duplicação de código (23,1%) | Baixa | ~2h (refatoração estrutural) |

---

## 6. Conclusão

### Utilidade do SonarQube no processo de desenvolvimento

O SonarQube demonstrou ser uma ferramenta valiosa ao proporcionar uma visão objetiva e automatizada da qualidade do código. Em vez de depender exclusivamente de revisões manuais, a ferramenta identifica padrões problemáticos de forma consistente em todo o código-fonte — algo difícil de garantir manualmente em projetos com múltiplos contribuidores. A integração com a cobertura de testes (via LCOV) e a classificação de problemas por severidade permitem priorizar as ações de melhoria de forma racional.

A possibilidade de acompanhar a evolução das métricas ao longo do tempo (com análises recorrentes) é especialmente útil em projetos acadêmicos e profissionais para comprovar que melhorias foram efetivamente implementadas, não apenas prometidas.

### Métricas mais relevantes

As métricas consideradas mais importantes para este projeto foram:

1. **Issues de Segurança (rating C)** — o SonarQube identificou 2 problemas de segurança, sendo o mais relevante o CORS configurado sem restrição de origem (Security · Medium, 4h de esforço estimado). Essa configuração permite que qualquer site externo faça chamadas à API usando as credenciais de um funcionário logado no navegador.
2. **Duplicação de Código (23,1%)** — o índice mais alto relativo ao tamanho do projeto. Em 494 linhas de código, 23,1% são cópias de outros trechos — principalmente pelos blocos CRUD de itens e serviços e pela query SQL de ordens duplicada em dois endpoints. Esse número surpreendeu por ser bem superior ao esperado para um projeto desse porte.
3. **Cobertura de Testes (31,4%)** — embora o módulo `validacoes.js` esteja bem testado (96,61%), as rotas Express em `server.js` não possuem nenhuma cobertura automatizada. Todo o fluxo de autenticação, cadastro e ordens de serviço opera sem verificação por testes.

### Principais problemas encontrados

O problema de maior impacto imediato foi o **CORS configurado sem restrição de origem** (`app.use(cors())` na linha 9 de `server.js`). Embora passe despercebido durante o desenvolvimento local, em produção essa configuração expõe a API a ataques CSRF baseados em CORS — qualquer página maliciosa pode acionar os endpoints da oficina usando a sessão de um funcionário autenticado no navegador.

O segundo ponto de atenção foi a **alta duplicação de código (23,1%)**, resultado da abordagem de copiar o padrão CRUD inteiro para cada recurso (itens, serviços, ordens) em vez de abstrair a lógica repetida. Em um projeto acadêmico isso é aceitável, mas em produção representaria dívida técnica crescente a cada novo recurso adicionado.

Por fim, a **complexidade cognitiva de `server.js` (48 de um total de 75)** confirma que o arquivo concentra muita responsabilidade — autenticação, todos os CRUDs e a lógica de geração de código OS convivem no mesmo arquivo, tornando-o progressivamente mais difícil de manter.

Em síntese, a análise com o SonarQube evidenciou que o projeto possui funcionamento correto e estrutura adequada para um sistema acadêmico, mas apresenta pontos de atenção concretos em segurança (CORS aberto) e manutenibilidade (duplicação e concentração de lógica) que seriam prioritários antes de qualquer uso em produção real.
