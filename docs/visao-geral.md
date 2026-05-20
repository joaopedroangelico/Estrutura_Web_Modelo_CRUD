# Visão Geral do Sistema — Oficina Mecânica

Este documento explica como o sistema funciona de forma simples, sem termos técnicos complicados.

---

## O que é este sistema?

É um sistema de computador feito para ajudar uma oficina mecânica a organizar o seu trabalho do dia a dia. Por ele é possível:

- Registrar os carros que chegam para conserto
- Acompanhar o andamento de cada serviço
- Gerenciar os funcionários da oficina
- Controlar as peças e serviços oferecidos

Tudo funciona pelo navegador de internet, sem precisar instalar nada no computador.

---

## Como o sistema é dividido?

Pense no sistema como uma loja física. Ela tem três partes que trabalham juntas:

### 1. O que o usuário vê — a "vitrine"
É a parte visual do sistema, as telas que aparecem no navegador. O usuário clica em botões, preenche formulários e visualiza as informações. Cada tela tem uma função:

| Tela | O que faz |
|---|---|
| Login | Entrada no sistema com usuário e senha |
| Dashboard | Painel principal com a lista de todos os serviços |
| Nova OS | Formulário para registrar um novo carro e serviço |
| Editar OS | Tela para atualizar ou encerrar um serviço existente |
| Funcionários | Cadastro e gerenciamento da equipe |
| Itens | Cadastro de peças e materiais usados nos serviços |
| Serviços | Catálogo de serviços oferecidos pela oficina |

### 2. O cérebro do sistema — o "servidor"
É a parte invisível que fica rodando em segundo plano. Quando o usuário clica em "Salvar" ou "Buscar", é o servidor que recebe o pedido, verifica se está tudo certo e devolve a resposta. Ele também cuida das regras do negócio, como impedir que dois carros tenham a mesma placa.

### 3. O arquivo permanente — o "banco de dados"
É onde todas as informações ficam guardadas de forma permanente. Mesmo que o computador desligue, os dados continuam lá. É como um fichário gigante organizado em tabelas:

| Tabela | O que guarda |
|---|---|
| Proprietários | Nome, CPF, telefone e e-mail dos clientes |
| Veículos | Placa, modelo e cor dos carros |
| Ordens de Serviço | Registro de cada serviço realizado |
| Funcionários | Dados de cada membro da equipe |
| Itens | Peças e materiais com seus preços |
| Serviços | Catálogo de serviços com preços fixos |

---

## Como as três partes se comunicam?

O fluxo é sempre o mesmo:

```
Usuário clica em algo
      ↓
A "vitrine" envia um pedido para o "servidor"
      ↓
O "servidor" consulta ou salva no "banco de dados"
      ↓
O "servidor" devolve a resposta para a "vitrine"
      ↓
A tela atualiza com as novas informações
```

Por exemplo, quando o usuário clica em "Salvar nova OS":
1. O sistema envia os dados do carro e do proprietário
2. O servidor verifica se a placa já existe no banco
3. Se não existir, registra tudo e cria um código único (como OS-001)
4. A tela exibe a confirmação de sucesso

---

## Quem pode fazer o quê?

O sistema tem dois tipos de usuário:

**Administrador**
- Acesso completo a todas as funções
- Pode cadastrar, editar e excluir qualquer registro
- Pode gerenciar funcionários e definir seus níveis de acesso
- Pode alterar os valores dos serviços

**Funcionário**
- Pode visualizar e criar ordens de serviço
- Não pode excluir registros
- Não pode alterar valores
- Não tem acesso ao gerenciamento de funcionários

---

## Onde o sistema está hospedado?

O sistema funciona completamente na internet, sem depender de nenhum computador local:

| Parte | Onde fica | Endereço |
|---|---|---|
| Telas (vitrine) | Vercel | https://mecanica-frontend-ten.vercel.app |
| Servidor (cérebro) | Render | https://mecanica-backend-juut.onrender.com |
| Banco de dados | Neon | Nuvem (região São Paulo) |

Isso significa que qualquer pessoa com o link e uma senha pode acessar o sistema de qualquer computador ou celular com internet.

---

## Como saber se o sistema está funcionando?

Existe uma página especial que mostra a saúde do sistema em tempo real. Basta acessar:

```
https://mecanica-backend-juut.onrender.com/health
```

A resposta será algo como:
```
{ "status": "ok", "banco": "conectado" }
```

Se aparecer "ok", tudo está funcionando normalmente.

---

## Como o sistema é verificado antes de ir ao ar?

Toda vez que uma alteração é feita no código, um processo automático é acionado que:

1. Roda uma bateria de testes para garantir que as regras do sistema continuam funcionando
2. Verifica se as telas conseguem ser montadas sem erros
3. Só depois disso publica a nova versão automaticamente

Isso evita que erros cheguem até os usuários finais.

---

## Credenciais de acesso para teste

| Usuário | Senha | Nível |
|---|---|---|
| admin | 1234 | Administrador |
| carlos | 1234 | Funcionário (mecânico) |
| ana | 1234 | Funcionário (atendente) |

---

*Desenvolvido por João Pedro Angelico — 5º Semestre, Desenvolvimento Web — Católica SC*
