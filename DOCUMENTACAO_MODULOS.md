# Documentação dos 5 Módulos Integrados - MeetFlow

## Visão Geral

Este documento descreve os 5 módulos principais do sistema MeetFlow que possuem integração completa entre as camadas de Front-end, Back-end/API e Banco de Dados.

---

## Módulo 01 - Autenticação e Cadastro de Usuários

### Componentes Envolvidos

| Camada | Componente | Descrição |
|--------|-----------|-----------|
| **Front-end** | `/src/app/login/page.tsx` | Tela de login com email/senha |
| **Front-end** | `/src/app/cadastro/page.tsx` | Tela de cadastro de novos usuários |
| **Back-end / API** | `/src/lib/supabase/client.ts` | Cliente Supabase para browser |
| **Back-end / API** | `/src/lib/supabase/server.ts` | Cliente Supabase para server-side |
| **Back-end / API** | `/src/app/auth/callback/route.ts` | Callback de autenticação OAuth |
| **Back-end / API** | `/src/app/actions.ts` | Server Actions (getCurrentUser) |
| **Banco de Dados** | Tabela `Usuario` | Armazena dados do usuário |
| **Banco de Dados** | Supabase Auth | Gerencia autenticação |

### Como Testar

1. **Cadastro de Usuário:**
   - Acesse `/cadastro`
   - Preencha: Nome, Email, Senha
   - Clique em "Cadastrar"
   - Verifique redirecionamento para `/cadastro/sucesso`

2. **Login:**
   - Acesse `/login`
   - Insira credenciais cadastradas
   - Verifique redirecionamento para `/home`

3. **Verificação no Banco:**
   ```sql
   SELECT * FROM "Usuario" WHERE email = 'email_testado@exemplo.com';
   ```

### Fluxo de Dados

```
[Formulário Login] → [Supabase Auth] → [Callback] → [Criar/Buscar Usuario no Prisma] → [Sessão Ativa]
```

---

## Módulo 02 - Gestão de Eventos (CRUD)

### Componentes Envolvidos

| Camada | Componente | Descrição |
|--------|-----------|-----------|
| **Front-end** | `/src/app/home/page.tsx` | Lista eventos disponíveis |
| **Front-end** | `/src/app/organizador/criar/page.tsx` | Formulário criação de evento |
| **Front-end** | `/src/app/eventos/[id]/page.tsx` | Detalhes do evento |
| **Front-end** | `/src/app/eventos/[id]/editar/page.tsx` | Edição de evento |
| **Front-end** | `/src/app/components/EventoCard.tsx` | Card de exibição do evento |
| **Back-end / API** | `/src/app/api/eventos/route.ts` | GET - Lista eventos |
| **Back-end / API** | `/src/app/api/eventos/criar/route.ts` | POST - Cria evento |
| **Back-end / API** | `/src/app/api/eventos/[id]/route.ts` | GET/PUT/DELETE - Evento específico |
| **Back-end / API** | `/src/app/actions.ts` | Server Actions (criarEvento, getEvento, atualizarEvento, deletarEvento) |
| **Banco de Dados** | Tabela `Evento` | Dados principais do evento |
| **Banco de Dados** | Tabela `TipoIngresso` | Tipos de ingresso do evento |
| **Banco de Dados** | Tabela `Programacao` | Agenda/programação do evento |
| **Banco de Dados** | Tabela `Organizador` | Dados do organizador |

### Como Testar

1. **Criar Evento:**
   - Faça login como organizador
   - Acesse `/organizador/criar`
   - Preencha todos os campos (título, descrição, data, local, imagem)
   - Adicione tipos de ingresso
   - Clique em "Criar Evento"

2. **Listar Eventos:**
   - Acesse `/home`
   - Verifique se o evento criado aparece na lista

3. **Visualizar Detalhes:**
   - Clique em um evento
   - Verifique se todas as informações aparecem em `/eventos/[id]`

4. **Editar Evento:**
   - Como organizador, acesse `/eventos/[id]/editar`
   - Modifique informações
   - Salve e verifique alterações

5. **Excluir Evento:**
   - Como organizador, acesse detalhes do evento
   - Clique em "Excluir"
   - Confirme exclusão

6. **Verificação no Banco:**
   ```sql
   SELECT e.*, t.nome as tipo_ingresso, t.preco 
   FROM "Evento" e 
   LEFT JOIN "TipoIngresso" t ON t."eventoId" = e.id 
   ORDER BY e."createdAt" DESC;
   ```

### Fluxo de Dados

```
[Formulário Criar] → [API /eventos/criar] → [Prisma Create] → [Banco PostgreSQL] → [Retorno JSON] → [Redirect /home]
```

---

## Módulo 03 - Sistema de Inscrições em Eventos

### Componentes Envolvidos

| Camada | Componente | Descrição |
|--------|-----------|-----------|
| **Front-end** | `/src/app/eventos/[id]/page.tsx` | Botão "Inscrever-se" |
| **Front-end** | `/src/app/meus-eventos/page.tsx` | Lista eventos inscritos |
| **Back-end / API** | `/src/app/actions.ts` | Server Actions (inscreverEvento, cancelarInscricao, verificarInscricao, getMeusEventos) |
| **Banco de Dados** | Tabela `Inscricao` | Registro de inscrições |
| **Banco de Dados** | Tabela `MissaoProgresso` | Progresso de missões/gamificação |

### Como Testar

1. **Inscrever-se em Evento:**
   - Faça login
   - Acesse `/eventos/[id]` de um evento
   - Clique em "Inscrever-se"
   - Verifique mensagem de sucesso

2. **Verificar Inscrição:**
   - Acesse `/meus-eventos`
   - Verifique se o evento aparece na lista

3. **Cancelar Inscrição:**
   - Em `/meus-eventos` ou `/eventos/[id]`
   - Clique em "Cancelar Inscrição"
   - Confirme cancelamento

4. **Verificação no Banco:**
   ```sql
   SELECT i.*, u.nome as usuario, e.titulo as evento 
   FROM "Inscricao" i 
   JOIN "Usuario" u ON i."usuarioId" = u.id 
   JOIN "Evento" e ON i."eventoId" = e.id;
   ```

### Fluxo de Dados

```
[Botão Inscrever] → [Server Action inscreverEvento] → [Verifica duplicidade] → [Prisma Create Inscricao] → [Cria Notificação] → [Atualiza UI]
```

---

## Módulo 04 - Sistema de Notificações

### Componentes Envolvidos

| Camada | Componente | Descrição |
|--------|-----------|-----------|
| **Front-end** | `/src/app/notificacoes/page.tsx` | Lista de notificações |
| **Front-end** | `/src/app/components/Header.tsx` | Badge de notificações |
| **Back-end / API** | `/src/app/actions.ts` | Server Actions (getNotificacoes, marcarNotificacaoComoLida, marcarTodasComoLidas) |
| **Banco de Dados** | Tabela `Notificacao` | Armazena notificações |

### Como Testar

1. **Gerar Notificação:**
   - Inscreva-se em um evento (gera notificação automática)

2. **Visualizar Notificações:**
   - Acesse `/notificacoes`
   - Verifique lista de notificações

3. **Marcar como Lida:**
   - Clique em uma notificação
   - Verifique mudança de status

4. **Marcar Todas como Lidas:**
   - Clique em "Marcar todas como lidas"
   - Verifique atualização em massa

5. **Verificação no Banco:**
   ```sql
   SELECT n.*, u.nome as usuario 
   FROM "Notificacao" n 
   JOIN "Usuario" u ON n."usuarioId" = u.id 
   ORDER BY n."createdAt" DESC;
   ```

### Fluxo de Dados

```
[Ação do Sistema] → [Cria Notificação] → [Salva no Banco] → [Busca em /notificacoes] → [Exibe na UI] → [Marca como Lida]
```

---

## Módulo 05 - Perfil do Usuário

### Componentes Envolvidos

| Camada | Componente | Descrição |
|--------|-----------|-----------|
| **Front-end** | `/src/app/perfil/page.tsx` | Tela de perfil/edição |
| **Back-end / API** | `/src/app/api/perfil/route.ts` | GET/PUT - Dados do perfil |
| **Back-end / API** | `/src/app/api/upload/route.ts` | POST - Upload de avatar |
| **Back-end / API** | `/src/app/actions.ts` | Server Actions (getPerfil, atualizarPerfil) |
| **Banco de Dados** | Tabela `Usuario` | Campos: nome, email, telefone, bio, avatar |

### Como Testar

1. **Visualizar Perfil:**
   - Faça login
   - Acesse `/perfil`
   - Verifique dados carregados

2. **Editar Informações:**
   - Modifique nome, telefone, bio
   - Clique em "Salvar"
   - Verifique mensagem de sucesso

3. **Upload de Avatar:**
   - Clique na área de foto
   - Selecione uma imagem
   - Verifique preview e salvamento

4. **Verificação no Banco:**
   ```sql
   SELECT id, nome, email, telefone, bio, avatar, "createdAt", "updatedAt" 
   FROM "Usuario" 
   WHERE email = 'seu_email@exemplo.com';
   ```

### Fluxo de Dados

```
[Formulário Perfil] → [Upload Avatar (se houver)] → [API /perfil PUT] → [Prisma Update Usuario] → [Retorno JSON] → [Atualiza UI]
```

---

## Diagrama de Relacionamento entre Módulos

```
                    ┌─────────────────┐
                    │  AUTENTICAÇÃO   │
                    │   (Módulo 01)   │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │     PERFIL      │           │     EVENTOS     │
    │   (Módulo 05)   │           │   (Módulo 02)   │
    └─────────────────┘           └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   INSCRIÇÕES    │
                                  │   (Módulo 03)   │
                                  └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │  NOTIFICAÇÕES   │
                                  │   (Módulo 04)   │
                                  └─────────────────┘
```

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **Next.js 15** | Framework React com App Router |
| **TypeScript** | Tipagem estática |
| **Prisma ORM** | Mapeamento objeto-relacional |
| **PostgreSQL** | Banco de dados relacional |
| **Supabase** | Autenticação e hosting do banco |
| **Tailwind CSS** | Estilização |
| **Server Actions** | Comunicação cliente-servidor |

---

## Como Executar os Testes de Integração

### Pré-requisitos
1. Banco PostgreSQL configurado
2. Variáveis de ambiente definidas:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Roteiro de Teste Completo

1. **Iniciar aplicação:** `pnpm dev`
2. **Cadastrar usuário** em `/cadastro`
3. **Fazer login** em `/login`
4. **Criar evento** em `/organizador/criar`
5. **Visualizar evento** na `/home`
6. **Inscrever-se** no evento
7. **Verificar inscrição** em `/meus-eventos`
8. **Verificar notificação** em `/notificacoes`
9. **Editar perfil** em `/perfil`
10. **Verificar dados** no banco via SQL

---

*Documentação gerada em: Maio 2026*
*Versão: 1.0*
