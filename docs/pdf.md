# RELATÓRIO – ANÁLISE DE QUALIDADE DE CÓDIGO COM ESLINT

**Disciplina:** Qualidade de Software
**Aluno:** João Pedro Angelico
**Data:** Junho de 2026

---

## PARTE 1 – DESENVOLVIMENTO DA APLICAÇÃO

### 1.1 Descrição do Sistema

O projeto utilizado nesta atividade é um **Sistema de Gestão de Ordens de Serviço para Oficina Mecânica**, desenvolvido com Node.js e JavaScript. O sistema permite o cadastro de funcionários, veículos, proprietários, itens de serviço e ordens de serviço completas, com suporte a transações de banco de dados para garantir consistência dos dados.

### 1.2 Tecnologias Utilizadas

- **Plataforma:** Node.js
- **Linguagem:** JavaScript (CommonJS)
- **Framework web:** Express.js
- **Banco de dados:** PostgreSQL (via biblioteca `pg`)
- **ORM/Query:** SQL puro com Pool de conexões
- **Variáveis de ambiente:** dotenv
- **Log de requisições:** morgan

### 1.3 Estrutura de Arquivos

| Arquivo | Descrição | Linhas |
|---|---|---|
| `server.js` | Servidor Express com todas as rotas da API | 457 |
| `db.js` | Configuração e pool de conexão com PostgreSQL | 28 |
| `validacoes.js` | Funções puras de validação de dados | 72 |
| `validacoes.test.js` | Testes unitários das funções de validação | 153 |
| `eslint.config.mjs` | Configuração do ESLint | 38 |
| **Total** | | **748 linhas** |

### 1.4 Funcionalidades Implementadas

**Módulo de Autenticação**
- Login de funcionários com validação de usuário e senha
- Controle de acesso por perfil (admin, atendente, mecânico)

**Módulo de Funcionários (CRUD completo)**
- Cadastro com nome, usuário, senha, função, CPF, telefone e endereço
- Listagem com data de criação formatada
- Edição com suporte a alteração opcional de senha
- Exclusão com verificação de existência

**Módulo de Veículos e Proprietários**
- Cadastro integrado na criação de ordem de serviço
- Upsert automático (INSERT ON CONFLICT DO UPDATE) para evitar duplicatas
- Vínculo obrigatório entre veículo e proprietário

**Módulo de Itens de Serviço e Catálogo**
- CRUD completo de itens e serviços do catálogo
- Controle de preços e descrições

**Módulo de Ordens de Serviço**
- Geração automática de código sequencial (OS-001, OS-002, ...)
- Criação com transação de banco (BEGIN/COMMIT/ROLLBACK)
- Filtros por status e busca por placa ou CPF
- Atribuição de atendente e mecânico responsáveis
- Controle de status: iniciado, em andamento, finalizado

### 1.5 Requisitos Atendidos

| Requisito | Status |
|---|---|
| Mínimo de 5 arquivos fonte | Atendido (5 arquivos JS/MJS) |
| Mínimo de 300 linhas de código | Atendido (748 linhas) |
| Utilização de funções | Atendido (validarPlaca, validarCPF, gerarCodigoOS, etc.) |
| Estruturas condicionais | Atendido (if/else em todas as rotas e validações) |
| Estruturas de repetição | Atendido (loop implícito via .map, .includes, .join) |
| Módulos/importações | Atendido (require em todos os arquivos) |
| Interação com dados | Atendido (banco PostgreSQL via queries SQL) |

---

## PARTE 2 – ESTUDO DA FERRAMENTA

### 2.1 O que é o ESLint

#### Definição

ESLint é uma ferramenta de análise estática de código para JavaScript e TypeScript, capaz de identificar e reportar padrões problemáticos no código-fonte sem a necessidade de executá-lo. O nome deriva de "ES" (ECMAScript, a especificação base do JavaScript) e "Lint" (termo histórico da computação para ferramentas de análise de código).

#### Objetivo

O objetivo principal do ESLint é ajudar desenvolvedores a escrever código mais consistente, seguro e legível. Ele atua como um "revisor automático" que verifica o código em tempo real, apontando erros potenciais, más práticas e violações de estilo antes que o software seja executado ou entregue.

#### Histórico da Ferramenta

O ESLint foi criado por **Nicholas C. Zakas** e lançado em **junho de 2013**. Antes de sua existência, as ferramentas disponíveis para análise de JavaScript (como JSLint e JSHint) eram limitadas em termos de configurabilidade e extensibilidade. O ESLint surgiu com uma proposta diferente: ser totalmente plugável, permitindo que desenvolvedores criassem suas próprias regras.

Principais marcos históricos:

- **2013:** Lançamento inicial por Nicholas Zakas
- **2015:** O ESLint supera o JSHint em popularidade nos projetos JavaScript
- **2016:** Integração com o ecossistema React e adoção massiva na comunidade
- **2019:** Suporte nativo a TypeScript via plugin `@typescript-eslint`
- **2022:** Lançamento do ESLint v8 com melhorias de desempenho
- **2023–2024:** Migração para o novo formato de configuração "flat config" (eslint.config.js/mjs), que é o formato utilizado neste projeto

Atualmente, o ESLint é mantido pela **ESLint team** com apoio financeiro de empresas como Google, Microsoft e Airbnb, e conta com mais de **40 milhões de downloads semanais** no npm.

#### Contexto de Utilização

O ESLint é utilizado em praticamente todo o ecossistema JavaScript moderno:

- **Frameworks front-end:** React, Vue.js, Angular incluem configurações padrão do ESLint em seus projetos
- **Back-end:** Projetos Node.js utilizam ESLint para padronizar código de servidor
- **Monorepos:** Grandes empresas como Airbnb, Google e Meta utilizam regras customizadas do ESLint para garantir padronização em centenas de projetos
- **CI/CD:** O ESLint é integrado em pipelines de integração contínua para bloquear merges com código que viola as regras definidas

---

### 2.2 O que é Análise Estática

#### Conceito

Análise estática é o processo de examinar o código-fonte de um programa **sem executá-lo**, com o objetivo de identificar problemas, padrões indesejados, vulnerabilidades ou violações de estilo. O termo "estática" contrasta com "dinâmica" — na análise dinâmica, o código é executado para observar seu comportamento em tempo real.

Ferramentas de análise estática percorrem a estrutura sintática e semântica do código (geralmente representada como uma AST — Árvore Sintática Abstrata) e aplicam regras predefinidas para identificar problemas.

#### Diferenças entre Análise Estática e Testes

| Aspecto | Análise Estática | Testes |
|---|---|---|
| Execução do código | Não executa | Executa |
| Quando ocorre | Antes da execução | Durante/após desenvolvimento |
| O que verifica | Estrutura, estilo, padrões | Comportamento e resultado |
| Velocidade | Muito rápida | Depende da cobertura |
| Falsos positivos | Possíveis | Raros |
| Cobertura | Todo o código-fonte | Apenas os fluxos testados |
| Exemplos | ESLint, SonarQube | Jest, Mocha, Cypress |

A análise estática **complementa** os testes, mas não os substitui. Um código pode passar no ESLint sem ter nenhum teste escrito, assim como testes podem passar em um código com problemas de estilo ou más práticas.

#### Vantagens da Análise Estática

1. **Detecção precoce:** Problemas são identificados antes mesmo de executar o sistema
2. **Custo reduzido:** Corrigir um bug antes da execução é muito mais barato do que corrigi-lo em produção
3. **Automatização:** Não requer intervenção manual — pode rodar automaticamente ao salvar arquivos ou em pipelines CI/CD
4. **Cobertura total:** Analisa todo o código-fonte, inclusive caminhos que raramente são executados nos testes
5. **Padronização:** Garante que toda a equipe siga as mesmas convenções de código
6. **Educação:** Quando o desenvolvedor vê uma regra violada com uma explicação, aprende boas práticas gradualmente

#### Limitações da Análise Estática

1. **Falsos positivos:** A ferramenta pode apontar como problema algo que é intencional
2. **Não verifica lógica de negócio:** O ESLint não sabe se a fórmula de cálculo está correta
3. **Limitação semântica:** Análise estática não simula a execução, portanto não detecta erros que só aparecem em tempo de execução (como valores nulos inesperados)
4. **Curva de configuração:** Configurar as regras corretas para um projeto específico requer conhecimento e tempo
5. **Resistência da equipe:** Desenvolvedores podem desativar regras ou usar comentários de supressão para ignorar os alertas

---

### 2.3 Aplicações do ESLint

#### Padronização de Código

O ESLint permite definir e aplicar um estilo de código único em todo o projeto. Regras como `indent` (indentação), `quotes` (tipo de aspas) e `semi` (ponto e vírgula) eliminam discussões subjetivas sobre estilo em revisões de código. O time define as regras uma vez, e o ESLint garante que todos sigam.

**Exemplo neste projeto:** A regra `indent: ['error', 2]` detectou 281 linhas com indentação de 4 espaços quando o padrão adotado é de 2 espaços.

#### Identificação de Erros

O ESLint detecta padrões que frequentemente causam bugs, como variáveis declaradas mas nunca usadas (`no-unused-vars`), uso de `==` em vez de `===` (`eqeqeq`), e uso do `parseInt` sem especificar a base numérica (`radix`).

**Exemplo neste projeto:** A regra `radix` detectou `parseInt(ultimo.split('-')[1])` sem o segundo parâmetro. Em JavaScript, sem a base, o comportamento pode ser imprevisível em strings que começam com `0` (interpretadas como octal em contextos legados).

#### Manutenção

Um código padronizado é mais fácil de manter. Quando todos os desenvolvedores seguem as mesmas convenções, qualquer pessoa do time consegue ler e modificar qualquer parte do código sem precisar se adaptar a diferentes estilos. O ESLint também identifica código morto (variáveis ou imports não utilizados) que pode ser removido com segurança.

#### Qualidade

A consistência forçada pelo ESLint reduz a complexidade cognitiva do código. Regras como `eqeqeq` (igualdade estrita) e `no-var` (evitar o `var` legado) promovem práticas mais seguras e previsíveis, diretamente impactando a qualidade final do software.

#### Trabalho em Equipe

Sem um linter, cada desenvolvedor tende a escrever no seu próprio estilo. O resultado é um código inconsistente, difícil de revisar e de entender. O ESLint atua como um árbitro neutro: as regras valem igualmente para todos. Isso reduz atritos em revisões de código, pois questões de estilo já foram resolvidas automaticamente.

Empresas como **Airbnb** e **Google** publicam seus conjuntos de regras ESLint como pacotes npm (`eslint-config-airbnb`, `eslint-config-google`), permitindo que times adotem padrões reconhecidos pela indústria.

#### Integração Contínua

O ESLint pode ser executado em pipelines de CI/CD (GitHub Actions, Jenkins, GitLab CI, etc.) para impedir que código com violações seja integrado à branch principal. O comando retorna um código de saída diferente de zero quando encontra erros, o que é suficiente para falhar automaticamente um pipeline.

Exemplo de configuração em GitHub Actions:
```yaml
- name: Lint
  run: npx eslint .
```

Se o ESLint encontrar erros, o pipeline falha e o merge é bloqueado, garantindo que apenas código validado entre no repositório.

---

## PARTE 3 – INSTALAÇÃO E CONFIGURAÇÃO

### 3.1 Instalação

O ESLint foi instalado como dependência de desenvolvimento no projeto `mecanica-backend`:

```bash
npm install eslint --save-dev
```

Para suporte ao formato "flat config" (eslint.config.mjs) usado no projeto, também foram instalados os pacotes de configuração base e globals:

```bash
npm install @eslint/js globals --save-dev
```

O arquivo `package.json` após a instalação registrou as dependências:

```json
"devDependencies": {
  "@eslint/js": "^9.x.x",
  "eslint": "^9.x.x",
  "globals": "^15.x.x"
}
```

Para suporte a testes Jest, o pacote `globals` fornece as variáveis globais necessárias (`describe`, `it`, `expect`, etc.), eliminando falsos positivos do ESLint sobre variáveis não declaradas nos arquivos de teste.

### 3.2 Inicialização

O arquivo de configuração foi criado manualmente no formato "flat config" (novo padrão do ESLint 9.x), em vez de usar o assistente interativo do comando `npx eslint --init`. O motivo é que o formato flat config oferece mais controle e é o padrão futuro da ferramenta.

O arquivo criado foi `eslint.config.mjs` (extensão `.mjs` para módulo ES dentro de um projeto CommonJS).

### 3.3 Configuração Adotada

O arquivo `eslint.config.mjs` final utilizado no projeto:

```javascript
import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'radix': 'error',
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    ignores: ['node_modules/**'],
  },
]
```

#### Explicação das Regras Configuradas

| Regra | Nível | Descrição |
|---|---|---|
| `js.configs.recommended` | base | Conjunto padrão de regras recomendadas pelo ESLint |
| `no-unused-vars` | warn | Avisa sobre variáveis declaradas mas não utilizadas |
| `no-console` | off | Permite o uso de console.log (necessário em servidor) |
| `indent` | error (2) | Exige indentação de 2 espaços |
| `quotes` | error (single) | Exige aspas simples para strings |
| `radix` | error | Exige o segundo parâmetro de parseInt (base numérica) |
| `eqeqeq` | error | Proíbe `==` e `!=`, exigindo `===` e `!==` |
| `no-var` | error | Proíbe declarações com `var` |
| `prefer-const` | error | Exige `const` quando a variável não é reatribuída |
| `no-multiple-empty-lines` | error (max: 1) | Limita linhas em branco consecutivas a 1 |

#### Decisões de Configuração

- **`no-console: 'off'`**: Em um servidor Node.js, `console.log` é a forma primária de logging. Desativar esta regra evita falsos positivos em um contexto onde logs são esperados e necessários.
- **`no-unused-vars` com `argsIgnorePattern: '^_'`**: Permite prefixar variáveis intencionalmente não usadas com `_` (convenção comum). Por exemplo, `_err` em um catch block onde só se quer ignorar o erro sem usar sua mensagem.
- **`quotes: { avoidEscape: true }`**: Permite aspas duplas quando necessário para evitar escape. Por exemplo, `"it's valid"` não será flagrado.
- **`sourceType: 'commonjs'`**: Necessário pois o projeto usa `require()` em vez de `import`.


## PARTE 4 – EXECUÇÃO DA FERRAMENTA

### 4.1 Comando Utilizado

```bash
npx eslint .
```

O comando foi executado dentro do diretório `mecanica-backend`, analisando todos os arquivos `.js` do projeto (excluindo `node_modules`).

### 4.2 Resultado da Execução

```
C:\...\mecanica-backend\db.js
   8:1  error  Expected indentation of 4 spaces but found 6  indent
   9:1  error  Expected indentation of 4 spaces but found 6  indent
  10:1  error  Expected indentation of 2 spaces but found 4  indent
  12:1  error  Expected indentation of 4 spaces but found 6  indent
  13:1  error  Expected indentation of 4 spaces but found 6  indent
  ...

C:\...\mecanica-backend\server.js
   26:1   error  Expected indentation of 2 spaces but found 4   indent
   27:1   error  Expected indentation of 4 spaces but found 8   indent
   27:9   error  Strings must use singlequote                   quotes
   28:1   error  Expected indentation of 2 spaces but found 4   indent
   31:17  error  Missing radix parameter                        radix
   ...

✖ 283 problems (283 errors, 0 warnings)
  282 errors and 0 warnings potentially fixable with the `--fix` option.
```

### 4.3 Resumo dos Problemas Encontrados

| Métrica | Valor |
|---|---|
| Total de problemas | **283** |
| Erros | **283** |
| Avisos (warnings) | **0** |
| Arquivos com problemas | **2** (db.js e server.js) |
| Problemas auto-corrigíveis | **282** |
| Problemas que exigem correção manual | **1** |

### 4.4 Categorias de Problemas Identificados

| Regra | Quantidade | Tipo | Auto-fix |
|---|---|---|---|
| `indent` | 281 | Indentação incorreta (4 espaços em vez de 2) | Sim |
| `quotes` | 1 | String com aspas duplas em vez de simples | Sim |
| `radix` | 1 | `parseInt` sem parâmetro de base numérica | Não |

### 4.5 Análise dos Problemas

#### Problema 1: Indentação Inconsistente (281 ocorrências)

O arquivo `server.js` foi escrito com indentação mista: o bloco da rota `/health` usava 2 espaços (padrão correto), enquanto a função `gerarCodigoOS` e todas as demais rotas usavam 4 espaços (fora do padrão). O arquivo `db.js` também apresentava a mesma inconsistência no bloco do pool de conexão.

Essa inconsistência ocorreu porque diferentes partes do código foram escritas em momentos distintos, sem um linter ativo para impor o padrão. O resultado é um código visualmente irregular que dificulta a leitura, especialmente em blocos aninhados (try/catch dentro de rotas, condicionais aninhadas, etc.).

#### Problema 2: Aspas Duplas em String SQL (1 ocorrência)

Na linha 27 do `server.js`, a query SQL estava escrita com aspas duplas:

```javascript
"SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1"
```

Todo o restante do código usa aspas simples para strings. Essa inconsistência, embora não cause erro em runtime, viola o padrão definido para o projeto e aumenta o ruído visual na leitura do código.

#### Problema 3: `parseInt` sem Radix (1 ocorrência)

Na linha 31 do `server.js`:

```javascript
const num = parseInt(ultimo.split('-')[1]) + 1
```

A função `parseInt` aceita dois parâmetros: a string a ser convertida e a base numérica (radix). Quando o segundo parâmetro é omitido, o comportamento depende do prefixo da string. Strings que começam com `0x` são interpretadas como hexadecimal, e em alguns contextos legados strings com `0` são interpretadas como octal. Para garantir comportamento previsível, deve-se sempre passar `10` como segundo argumento ao trabalhar com números decimais.

---

## PARTE 5 – CORREÇÃO AUTOMÁTICA

### 5.1 Comando Utilizado

```bash
npx eslint . --fix
```

### 5.2 Resultado

```
C:\...\mecanica-backend\server.js
  31:15  error  Missing radix parameter  radix

✖ 1 problem (1 error, 0 warnings)
```

O ESLint corrigiu **282 problemas automaticamente** e deixou **1 problema** que exige intervenção manual.

### 5.3 O que Foi Corrigido Automaticamente

#### Indentação (281 ocorrências)

O ESLint reescreveu automaticamente toda a indentação do projeto, convertendo todos os blocos de 4 espaços para 2 espaços. Isso afetou:

- A função `gerarCodigoOS` em `server.js`
- Todas as rotas do servidor (`/auth/login`, `/funcionarios`, `/itens`, `/servicos-catalogo`, `/ordens`)
- O bloco do pool de conexão em `db.js`

As correções foram aplicadas preservando a lógica do código — apenas o espaçamento foi alterado.

#### Aspas Duplas → Aspas Simples (1 ocorrência)

A string SQL na linha 27 de `server.js` foi automaticamente convertida de aspas duplas para aspas simples:

```javascript
// Antes
"SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1"

// Depois
'SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1'
```

### 5.4 O que Precisou de Intervenção Manual

#### `parseInt` sem Radix (1 ocorrência)

A regra `radix` não pode ser corrigida automaticamente porque o ESLint não sabe qual base numérica o desenvolvedor pretendia usar. A correção foi feita manualmente, adicionando o segundo argumento `10` (base decimal):

```javascript
// Antes (com erro)
const num = parseInt(ultimo.split('-')[1]) + 1

// Depois (corrigido manualmente)
const num = parseInt(ultimo.split('-')[1], 10) + 1
```

Após essa correção manual, o ESLint foi executado novamente:

```bash
npx eslint .
# Nenhuma saída — exit code 0 (sem erros)
```

### 5.5 Limitações da Correção Automática

A correção automática do ESLint (`--fix`) tem limitações importantes:

1. **Não resolve problemas semânticos:** Regras que exigem entendimento do que o código deve fazer (como `radix`) não podem ser corrigidas automaticamente, pois o ESLint não sabe a intenção do desenvolvedor.

2. **Não garante equivalência funcional:** Em casos raros, uma correção automática de indentação pode introduzir problemas em arquivos sensíveis a espaços (como arquivos de configuração YAML ou strings multiline). Sempre verificar o código após o `--fix`.

3. **Apenas regras marcadas como fixable:** Nem todas as regras do ESLint suportam auto-fix. A documentação de cada regra indica se ela é fixável automaticamente.

4. **Não corrige lógica de negócio:** O `--fix` nunca alterará a lógica do código, somente aspectos de estilo e padrões estruturais.

5. **Conflitos entre regras:** Se duas regras configuradas entrarem em conflito (por exemplo, `indent` e uma regra de alinhamento personalizada), o auto-fix pode alternar entre os dois estilos infinitamente. O ESLint limita as tentativas de correção para evitar loops.



## PARTE 6 – COMPARAÇÃO ANTES E DEPOIS

### Exemplo 1 – Indentação na função utilitária `gerarCodigoOS` (server.js, linhas 25–33)

**Antes:**
```javascript
async function gerarCodigoOS() {
    const result = await pool.query(
        "SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1"
    )
    if (result.rows.length === 0) return 'OS-001'
    const ultimo = result.rows[0].codigo
    const num = parseInt(ultimo.split('-')[1]) + 1
    return `OS-${String(num).padStart(3, '0')}`
}
```

**Depois:**
```javascript
async function gerarCodigoOS() {
  const result = await pool.query(
    'SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1'
  )
  if (result.rows.length === 0) return 'OS-001'
  const ultimo = result.rows[0].codigo
  const num = parseInt(ultimo.split('-')[1], 10) + 1
  return `OS-${String(num).padStart(3, '0')}`
}
```

**Explicação:**
- **Problema:** Indentação de 4 espaços e aspas duplas na string SQL
- **Regras aplicadas:** `indent` (corrigida para 2 espaços), `quotes` (aspas simples), `radix` (adição de base 10)
- **Benefício:** Consistência visual com o restante do arquivo e comportamento previsível do `parseInt`

---

### Exemplo 2 – Indentação na rota de autenticação (server.js, linhas 39–57)

**Antes:**
```javascript
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
```

**Depois:**
```javascript
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
```

**Explicação:**
- **Problema:** Todos os blocos internos usavam 4 e 8 espaços em vez de 2 e 4
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** Leitura mais compacta e padronizada, alinhada com o estilo do restante do código

---

### Exemplo 3 – Indentação na rota GET de funcionários (server.js, linhas 63–76)

**Antes:**
```javascript
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
```

**Depois:**
```javascript
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
```

**Explicação:**
- **Problema:** Indentação de 4 espaços no bloco do callback da rota
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** O conteúdo da template literal SQL não é alterado (strings multiline são respeitadas), apenas o código JavaScript ao redor é padronizado

---

### Exemplo 4 – Indentação na rota POST de funcionários (server.js, linhas 78–96)

**Antes:**
```javascript
app.post('/funcionarios', async (req, res) => {
    try {
        const { nome, usuario, senha, funcao, role, cpf, telefone, endereco } = req.body
        if (!nome || !usuario || !senha || !funcao) {
            return res.status(400).json({ erro: 'Nome, usuário, senha e função são obrigatórios.' })
        }
        // ...
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ erro: 'Usuário ou CPF já cadastrado.' })
        }
        console.error(err)
        res.status(500).json({ erro: 'Erro ao cadastrar funcionário.' })
    }
})
```

**Depois:**
```javascript
app.post('/funcionarios', async (req, res) => {
  try {
    const { nome, usuario, senha, funcao, role, cpf, telefone, endereco } = req.body
    if (!nome || !usuario || !senha || !funcao) {
      return res.status(400).json({ erro: 'Nome, usuário, senha e função são obrigatórios.' })
    }
    // ...
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ erro: 'Usuário ou CPF já cadastrado.' })
    }
    console.error(err)
    res.status(500).json({ erro: 'Erro ao cadastrar funcionário.' })
  }
})
```

**Explicação:**
- **Problema:** Indentação de 4/8/12 espaços em cascata dentro do callback, try e if
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** Código mais compacto, reduzindo o "efeito pirâmide" em blocos aninhados

---

### Exemplo 5 – Indentação na rota PUT de ordens de serviço (server.js, linhas 395–433)

**Antes:**
```javascript
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
        // ...
    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err)
        res.status(500).json({ erro: 'Erro ao atualizar ordem de serviço.' })
    } finally {
        client.release()
    }
})
```

**Depois:**
```javascript
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
    // ...
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ erro: 'Erro ao atualizar ordem de serviço.' })
  } finally {
    client.release()
  }
})
```

**Explicação:**
- **Problema:** Indentação incorreta em rota com try/catch/finally (3 níveis de aninhamento)
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** Especialmente importante em estruturas try/catch/finally — a indentação incorreta dificulta identificar a qual bloco pertence cada instrução

---

### Exemplo 6 – Indentação no bloco pool de conexão (db.js, linhas 6–17)

**Antes:**
```javascript
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
```

**Depois:**
```javascript
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
```

**Explicação:**
- **Problema:** As propriedades do objeto `Pool` usavam 6 espaços (3 níveis de 2), quando o ESLint calculava o alinhamento correto como 4 espaços considerando o operador ternário
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** Alinhamento consistente com o padrão da ferramenta, eliminando ambiguidade visual

---

### Exemplo 7 – Indentação no callback de conexão (db.js, linhas 19–26)

**Antes:**
```javascript
pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no PostgreSQL:', err.message)
    } else {
        const modo = connectionString ? 'Neon (nuvem)' : 'local'
        console.log(`Conectado ao PostgreSQL com sucesso. [${modo}]`)
    }
})
```

**Depois:**
```javascript
pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no PostgreSQL:', err.message)
  } else {
    const modo = connectionString ? 'Neon (nuvem)' : 'local'
    console.log(`Conectado ao PostgreSQL com sucesso. [${modo}]`)
  }
})
```

**Explicação:**
- **Problema:** Callback usando 4 espaços de indentação em vez de 2
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** Consistência com o restante do arquivo `db.js`, que já usava 2 espaços no bloco do pool

---

### Exemplo 8 – String com aspas duplas (server.js, linha 27)

**Antes:**
```javascript
const result = await pool.query(
    "SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1"
)
```

**Depois:**
```javascript
const result = await pool.query(
  'SELECT codigo FROM ordens_servico ORDER BY id DESC LIMIT 1'
)
```

**Explicação:**
- **Problema:** String delimitada por aspas duplas em um projeto que usa aspas simples em todo o restante do código
- **Regra aplicada:** `quotes: ['error', 'single']`
- **Benefício:** Consistência visual — um desenvolvedor que lê o arquivo não precisa se perguntar se existe algum motivo especial para o uso de aspas duplas naquele trecho. A ausência de razão especial deve ser sinalizada pela uniformidade

---

### Exemplo 9 – `parseInt` sem radix (server.js, linha 31)

**Antes:**
```javascript
const num = parseInt(ultimo.split('-')[1]) + 1
```

**Depois:**
```javascript
const num = parseInt(ultimo.split('-')[1], 10) + 1
```

**Explicação:**
- **Problema:** `parseInt` sem o segundo argumento (radix). O comportamento padrão em JavaScript moderno é inferir base 10, mas a especificação permite que implementações antigas interpretem strings com prefixo `0` como octal. Além disso, omitir o radix é uma prática que gera confusão e warnings em diversas ferramentas de análise
- **Regra aplicada:** `radix: 'error'`
- **Benefício:** Clareza explícita da intenção (converter para inteiro na base 10) e proteção contra comportamento inesperado em ambientes legados. Esta é a única correção que exigiu intervenção manual, pois o ESLint não pode inferir a base desejada

---

### Exemplo 10 – Indentação na rota DELETE de ordens (server.js, linhas 435–449)

**Antes:**
```javascript
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
```

**Depois:**
```javascript
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
```

**Explicação:**
- **Problema:** Indentação de 4/8 espaços em todos os níveis do callback
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** O padrão de 2 espaços é especialmente vantajoso em arquivos longos como o `server.js` (457 linhas), pois reduz o deslocamento horizontal do código em blocos aninhados, evitando a necessidade de rolar horizontalmente a tela em linhas longas

---

### Exemplo 11 – Indentação no bloco inicial da rota POST de ordens (server.js, linhas 346–393)

**Antes:**
```javascript
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
        // ...
    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err)
        res.status(500).json({ erro: 'Erro ao criar ordem de serviço.' })
    } finally {
        client.release()
    }
})
```

**Depois:**
```javascript
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
    // ...
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ erro: 'Erro ao criar ordem de serviço.' })
  } finally {
    client.release()
  }
})
```

**Explicação:**
- **Problema:** Rota mais complexa do sistema, com transação de banco, múltiplas validações e estrutura try/catch/finally — toda ela com indentação incorreta de 4 espaços
- **Regra aplicada:** `indent: ['error', 2]`
- **Benefício:** Com 2 espaços, as condicionais de validação (if/else) ficam visualmente mais próximas de seu contexto lógico, facilitando a compreensão do fluxo da rota


## PARTE 7 – AVALIAÇÃO DOS RESULTADOS

### 7.1 O ESLint encontrou problemas relevantes?

**Sim.** Dos 283 problemas encontrados, todos eram reais e verificáveis no código-fonte. A grande maioria (281 ocorrências) era de indentação inconsistente — um problema que, embora não cause erro em runtime, impacta diretamente a legibilidade e a manutenibilidade do código.

Os dois problemas não relacionados à indentação eram ainda mais significativos:

- O uso de **aspas duplas** em um único trecho do arquivo sinalizava inconsistência de estilo em um código que usava aspas simples em todo o restante
- O uso do **`parseInt` sem radix** é uma prática que pode causar comportamento inesperado em contextos específicos — é um bug latente, pois funciona corretamente na maioria dos casos mas pode falhar silenciosamente em dados com formatos incomuns

A relevância dos problemas fica clara ao considerar que o código estava funcional antes do ESLint: a ferramenta identificou riscos que não eram visíveis simplesmente executando o sistema.

---

### 7.2 Os problemas poderiam causar falhas reais?

**Parcialmente.** A avaliação varia por categoria:

**Indentação (281 ocorrências):** Não causaria falhas em runtime. JavaScript é insensível a espaços em branco. Porém, indentação inconsistente aumenta o risco de erros humanos durante manutenção — um desenvolvedor que edita um bloco mal indentado pode não perceber os limites dos blocos lógicos (como se um `catch` pertence ao `try` interno ou ao externo).

**Aspas (1 ocorrência):** Não causaria falha alguma. Apenas estilo.

**`parseInt` sem radix (1 ocorrência):** **Poderia causar falha real.** No contexto do sistema, o valor passado para o `parseInt` é extraído do código de uma ordem de serviço (ex: `"OS-001"` → `"001"`). A string `"001"` começa com zeros. Em engines JavaScript antigas (anteriores ao ECMAScript 5), strings com zero à esquerda eram interpretadas como **octal**, não decimal. Assim, `parseInt("001")` retornaria `1` (correto), mas `parseInt("008")` retornaria `0` em vez de `8`, pois `8` não é um dígito octal válido. Em ambientes modernos isso não ocorre, mas a regra do ESLint é uma salvaguarda importante para compatibilidade.

---

### 7.3 A ferramenta ajudou a melhorar a legibilidade?

**Sim, consideravelmente.** O efeito mais visível foi na redução do "efeito pirâmide" — o fenômeno onde blocos muito aninhados com indentação de 4 espaços forçam o código a se deslocar muito para a direita, especialmente em arquivos como o `server.js`, que possui rotas com try/catch aninhados dentro de callbacks de arrow functions.

Com indentação de 2 espaços:
- Linhas longas (como queries SQL e mensagens de erro) ficam menos propensas a ultrapassar 80–100 caracteres de largura
- A estrutura lógica do código (quais instruções pertencem a qual bloco) fica visualmente mais clara
- O diff no controle de versão fica mais limpo, pois alterações de lógica não misturam mudanças de indentação

---

### 7.4 A ferramenta ajudou a padronizar o código?

**Sim.** Antes do ESLint, o arquivo `server.js` tinha dois padrões de indentação coexistindo: a rota `/health` (escrita inicialmente) usava 2 espaços, enquanto todas as rotas escritas posteriormente usavam 4 espaços. Essa inconsistência indicava que não havia um padrão definido e aplicado de forma disciplinada.

O ESLint resolveu isso de forma objetiva: definiu o padrão em um arquivo de configuração e aplicou automaticamente para todo o projeto. A padronização é ainda mais valiosa em equipes com múltiplos desenvolvedores, onde cada pessoa tende a escrever no estilo que lhe é mais confortável.

Outro aspecto de padronização foi a consistência no uso de aspas. Com a regra `quotes: ['error', 'single']`, qualquer string futura que seja escrita com aspas duplas (por exemplo, por um desenvolvedor acostumado com outro projeto) será imediatamente sinalizada.

---

### 7.5 Quais limitações foram observadas?

**1. A ferramenta não avalia lógica de negócio.**
O ESLint não detectou, por exemplo, que as senhas dos funcionários são armazenadas em texto plano no banco de dados — uma vulnerabilidade de segurança significativa. Problemas de design e lógica exigem revisão humana ou ferramentas especializadas (como SonarQube para análise de segurança).

**2. A maioria dos erros era de indentação.**
Dos 283 erros encontrados, 281 (99,3%) eram do mesmo tipo. Isso pode dar uma falsa impressão de gravidade ("283 erros!" soa alarmante, mas na prática eram todos do mesmo padrão corrigido em segundos). Para o relatório, foi necessário selecionar exemplos representativos de categorias distintas.

**3. Regras que não se aplicavam ao projeto.**
Regras como `no-var` e `eqeqeq` não encontraram nenhum problema, pois o código já seguia essas práticas. Isso é positivo, mas significa que as regras foram configuradas sem impacto neste caso específico. Em outros projetos, essas mesmas regras poderiam ser essenciais.

**4. O `--fix` não é 100% seguro.**
A correção automática de indentação alterou o comportamento visual de strings multiline (template literals SQL). O ESLint foi criterioso e não modificou o conteúdo das strings, mas o desenvolvedor deve sempre revisar as alterações feitas pelo `--fix` antes de fazer um commit.

**5. Não substitui revisão de código.**
O ESLint garante estilo e alguns padrões, mas não substitui a revisão humana de pull requests, onde aspectos como arquitetura, clareza das abstrações e corretude do algoritmo são avaliados.

---

### 7.6 Você utilizaria essa ferramenta em projetos reais?

**Sim, sem dúvidas — e ela já faz parte deste projeto.**

O caso concreto demonstrado nesta atividade evidencia o valor prático do ESLint: o código estava funcional, mas com inconsistências de estilo que se acumularam ao longo do desenvolvimento. Sem o ESLint, essas inconsistências seriam identificadas apenas em revisões de código manuais (se identificadas), gerando discussões desnecessárias sobre preferências pessoais de formatação.

Com o ESLint configurado e integrado ao fluxo de desenvolvimento, cada novo trecho de código é verificado automaticamente. Editores como VS Code integram o ESLint diretamente, exibindo os erros em tempo real enquanto o desenvolvedor escreve — sem precisar executar nenhum comando manualmente.

Para projetos em equipe, o ESLint é ainda mais valioso: elimina "guerras de estilo", garante que novos integrantes sigam o mesmo padrão desde o primeiro commit, e pode ser integrado ao pipeline de CI/CD para bloquear automaticamente merges que violem as regras definidas.

Em resumo: o ESLint é uma das ferramentas de menor custo de adoção e maior retorno em qualidade dentro do ecossistema JavaScript. Configurar e executar o ESLint levou menos de 10 minutos; os benefícios em legibilidade, padronização e prevenção de bugs persistem pelo tempo de vida do projeto.

---

## CONCLUSÃO

Esta atividade demonstrou de forma prática como a análise estática de código com ESLint contribui para a qualidade de software em todas as suas dimensões. Foram identificados 283 problemas em um projeto funcional — evidência de que código que "funciona" nem sempre é código de qualidade.

A experiência reforça uma lição importante: ferramentas de qualidade não são burocracias — são investimentos. O tempo gasto configurando o ESLint é recuperado rapidamente em revisões de código mais ágeis, menos bugs de manutenção e um codebase mais fácil de entender e evoluir.

A análise estática não é um substituto para testes, revisão humana ou bom design de software. É uma camada complementar que automatiza a verificação do que pode ser verificado automaticamente, liberando a atenção humana para o que realmente importa: a lógica, a arquitetura e o valor entregue pelo sistema.
