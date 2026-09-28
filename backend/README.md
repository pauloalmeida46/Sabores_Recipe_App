# SABORES — Backend (Sprint 1)

Backend standalone (Node.js + TypeScript + Express) para o app SABORES. Este
backend é **independente** do app Expo/React Native em `app/frontend` — o
frontend hoje usa 100% dados estáticos mockados e **não foi alterado nem
conectado** a esta API. Este serviço existe para cumprir os requisitos do
Sprint 1 e ficar pronto para integração futura.

## Stack

- Node.js + TypeScript + Express 4
- Validação com `zod`
- IDs via `crypto.randomUUID()`
- Upload de imagem com `multer` (memória, endpoint de reconhecimento)
- `cors`, `morgan` (log de requisições em modo `dev`)
- **Dados em memória** (`src/db/store.ts`) — reiniciam a cada `npm run dev` /
  restart. Veja `BACKEND_DATABASE.md` para o plano de migração para um banco
  real (PostgreSQL + Prisma).

## Setup

```bash
cd app/backend
npm install
npm run dev        # tsx watch src/server.ts — porta padrão 4000
```

Outros scripts:

```bash
npm run build       # tsc -> dist/
npm start           # node dist/server.js (rodar após build)
npm run typecheck   # tsc --noEmit
```

Variáveis de ambiente (veja `.env.example`):

```
PORT=4000
```

Health check: `GET /health`

## Arquitetura (importante para quem for mexer no código)

```
src/
  db/store.ts              <- ÚNICO lugar com os dados "crus" (Maps em memória)
  db/seed-data.ts          <- dados de seed (pt-BR), sem tocar em store.ts
  modules/<feature>/
    <feature>.types.ts
    <feature>.repository.ts   <- ÚNICO tipo de arquivo que pode importar db/store.ts
    <feature>.service.ts      <- regra de negócio, só chama o repository
    <feature>.controller.ts   <- lê req, chama o service, escreve res
    <feature>.routes.ts
```

Regra fixa: **serviços e controllers nunca importam `db/store.ts`
diretamente** — só os arquivos `*.repository.ts` podem. Isso é o que permite
trocar `store.ts` por um client Prisma/Postgres no futuro sem tocar em
serviços, controllers ou rotas (detalhes em `BACKEND_DATABASE.md`).

## Endpoints, por história de usuário

### US-001 (RF1-4) — Despensa
- `GET /api/pantry` — lista itens
- `GET /api/pantry/summary` — total, itens vencendo em breve, por categoria
- `POST /api/pantry` — cria item (`name, quantity, unit, category, expiresAt?`). Se já existir item com mesmo nome+unidade normalizados, **soma** a quantidade em vez de duplicar.
- `PATCH /api/pantry/:id` — atualiza item
- `DELETE /api/pantry/:id` — remove item

### US-007 (RF15-16) — Receitas: CRUD + editor estruturado
- `GET /api/recipes` — lista (com `safety` computado, ver US-045)
- `GET /api/recipes/:id`
- `POST /api/recipes` — cria (título, ≥1 ingrediente, ≥1 passo, refs de ingredientes válidas, tempos coerentes/não-negativos)
- `PUT /api/recipes/:id` — substitui (mesma validação)
- `DELETE /api/recipes/:id`

### US-010 (RF22-23) — Detecção de duplicidade
- `POST /api/recipes/check-duplicate` — `{title, ingredients, steps}` → candidatos com `score`, `possibleDuplicate` (limiar 0.6, documentado em `duplicate.service.ts`) e a receita completa
- `POST /api/recipes/:id/merge` — `{draft, choices}` (mescla guiada campo a campo: `title`, `mergeIngredients`, `mergeSteps` ∈ `'union'|'keepExisting'|'keepDraft'`)

### US-011 (RF24-25) — Autosave de rascunho
- `POST /api/recipes/drafts` — `{ownerId, data}`
- `PUT /api/recipes/drafts/:id` — upsert (chamado a cada ~30s pelo cliente)
- `GET /api/recipes/drafts/:id`
- `GET /api/recipes/drafts?ownerId=` — retomar último rascunho
- `POST /api/recipes/drafts/:id/finalize` — valida como o editor estruturado, cria a receita e **apaga** o rascunho

### US-008 (RF17-18) — Reconhecimento por imagem (⚠️ MOCK — ver aviso abaixo)
- `POST /api/recipes/recognize` — multipart, campo `image` (até 8MB, apenas `image/*`). `simulateFailure=true` (query ou campo do form) simula falha para testar novo envio. Retorna um rascunho estruturado **canned/aleatório**, pronto para revisão — não salva nada.

### US-012 (RF26-27) / US-014 (RF29-30) — Busca e filtros
- `GET /api/recipes/search?q=&maxDurationMin=&difficulty=&diet=&allergens=&season=&equipment=&highlightIngredient=&excludeIngredient=&sort=relevance|recent|popular`
  Todos os filtros informados se combinam com **E** lógico. Sem resultados → `{results: [], message, suggestion}` (sugere qual filtro relaxar). Ordenação padrão (`relevance`) considera `usageCount`/`lastUsedAt`.
- `POST /api/recipes/:id/track-use` — incrementa `usageCount`/`lastUsedAt` (chamado pelo fluxo de cozinha guiada)

### US-028 (RF48-50) / US-029 (RF51-52) — Cozinha guiada + timers
- `GET /api/recipes/:id/cooking-session` — passos ordenados com info de timer
- `POST /api/recipes/:id/cooking-session/steps/:stepId/complete` — marca passo concluído, retorna o próximo
- `POST /api/recipes/:id/cooking-session/save-variant` — salva timers/notas ajustados como uma `RecipeVariant` **sem alterar a receita original**
- `POST /api/timers` — `{recipeId?, stepId?, label, durationSec}` cria timer independente
- `GET /api/timers` / `GET /api/timers/:id` — lista/consulta com `remainingSec` calculado
- `PATCH /api/timers/:id` — `{action: 'pause'|'resume'|'cancel'}`. Pausar/retomar um timer não afeta os demais.

### US-035 (RF62-64) — Escalonamento de receita
- `POST /api/recipes/:id/scale` — `{targetServings}`. Ingredientes `scalingRule: 'fixed'` não mudam; `'sqrt'` escalam por `sqrt(razão)`; os demais escalam linearmente. Se `equipmentCapacityLiters` estiver definido, retorna `warning` quando o volume estimado excede a capacidade.

### US-038 (RF67-68) / US-039 (RF69) — Conversão de unidades
- `GET /api/conversions/units?value=&fromUnit=&toUnit=&ingredient=` — peso↔peso, volume↔volume (métrico/imperial) e peso↔volume (via densidade seed, `{error: 'density_unknown', ...}` quando não há densidade cadastrada)
- `GET /api/conversions/household-measures` — medidas caseiras padrão (xícara, colher de sopa, ...)
- `PUT /api/conversions/household-measures/custom` — `{ownerId, measureName, standardEquivalentMl}` personaliza uma medida para um usuário; passe `ownerId` nas próximas consultas de `/units` para reaplicar

### US-041 (RF72) — Substituição de ingredientes
- `GET /api/ingredients/:name/substitutions` — `{found: false, message}` quando não há nada cadastrado
- `POST /api/recipes/:id/apply-substitution` — `{ingredientId, substitutionName}` → lista de ingredientes recalculada (via `ratio`), sem alterar a receita salva

### US-044 (RF77) — Perfil e restrições
- `GET /api/profile` / `PATCH /api/profile`
- `GET /api/profile/restrictions`
- `POST /api/profile/restrictions` — `{label, kind: 'allergy'|'diet'}`
- `DELETE /api/profile/restrictions/:id`

### US-045 (RF78-79) — Certificação de segurança
Campo **computado** `safety: 'certified' | 'unsafe' | 'unknown'`, anexado a toda receita retornada (lista/detalhe/busca), calculado ao vivo contra as restrições ativas — ver `src/modules/safety/safety.service.ts`.

### US-046 (RF80-82) — Nutrição e plano semanal
- `GET /api/recipes/:id/nutrition` — totais + `missingData` (ingredientes sem conversão/tabela TACO)
- `GET /api/plan/week` / `PUT /api/plan/week/:weekday/:meal` (`weekday` ∈ SEG..DOM, `meal` ∈ almoco/jantar/lanche)
- `GET /api/plan/week/nutrition` — agrega nutrição de toda a semana
- `GET /api/plan/week/nutrition/comparison` — compara com `profile.dailyGoals * 7`

## ⚠️ Aviso importante: `POST /api/recipes/recognize` é um MOCK

A RF17 pede extração **local, no dispositivo**. Um backend Node não pode
legitimamente fazer isso. Esse endpoint existe só para o fluxo de review
funcionar ponta a ponta: ele valida o upload e devolve um rascunho
canned/aleatório para revisão. A extração real deve rodar no dispositivo
(ex.: ML Kit / Core ML / TFLite) ou via um serviço real de visão/OCR — quando
isso existir, troque apenas o corpo de
`src/modules/recipes/recognize.service.ts`.

## Interpretações de critério de aceite (para repassar ao Paulo)

Ver a lista completa na resposta final do agente que gerou este backend —
resumo rápido:
- `US-010`: limiar de duplicidade fixado em `score >= 0.6` (Jaccard de título + Jaccard de ingredientes, média simples), documentado em `duplicate.service.ts`.
- `US-012/US-014`: semântica de `allergens` (busca) = exclui receitas que contêm aquele alérgeno; `equipment` = receita usa **todos** os equipamentos informados; `excludeIngredient` = receita simplesmente não contém o ingrediente (sem tag explícita de "exclusão proposital").
- `US-028`: sessão de cozinha guiada é **stateless** (sem progresso persistido por usuário/dispositivo) — não há autenticação multiusuário no Sprint 1 para atrelar esse estado.
- `US-035`: heurística de volume para o aviso de capacidade do equipamento é documentada em `scaling.service.ts` (soma de volumes estimados por ingrediente via conversão + densidade; ingredientes contados como "unid"/"a gosto" são tratados como volume desprezível).
- `US-045`: só restrições do tipo `allergy` (com `allergenKey`) participam da checagem de segurança; restrições `diet` (ex.: Diabetes) não bloqueiam receitas automaticamente no Sprint 1.

## Dados em memória

Todo o estado vive em `src/db/store.ts` e é reiniciado a cada restart do
processo. Para o plano de migração para um banco de dados real, veja
[`BACKEND_DATABASE.md`](./BACKEND_DATABASE.md).
