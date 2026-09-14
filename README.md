# FATEC São José dos Campos - Prof. Jessen Vidal - Progamação para Dispositivos Móveis I - Projeto Individual

<p>Projeto desenvolvido individualmente a partir dos requisitos de culinária inteligente propostos pelo professor Gerson Penha, organizado com práticas de Product Owner: User Stories, Requisitos Funcionais/Não Funcionais e planejamento de Sprints.</p>

> _Este README consolida, no formato de documentação de projeto. Por se tratar de um projeto individual, o autor acumula os papéis de Product Owner, Scrum Master e Dev Team para fins de organização do trabalho._

---

## 📑 Sumário
- [Dores do Cliente](#dores)
- [Visão do Projeto](#visao-do-projeto)
- [Cronograma do Projeto](#cronograma)
- [Requisitos](#requisitos)
- [Wireframes](#wireframes)
- [Product Backlog](#backlog)
- [Sprint Backlog](#backsprint)

---

## 🍳 Dores do Cliente <a name="dores"></a>

### Decidir
Problemas relacionados a decidir o que cozinhar no dia a dia:

- Dificuldade em decidir o que cozinhar com o que já se tem em casa, gerando fadiga de decisão repetida todos os dias.
- Falta de visibilidade sobre ingredientes próximos da validade, levando ao desperdício.
- Insegurança sobre quais receitas são realmente seguras para uma restrição alimentar ou alergia.
- Frustração ao descobrir, no meio do preparo, que falta um ingrediente específico.
- Receitas escritas para um cenário genérico (equipamento, número de porções, nível de habilidade) que raramente é o cenário real do usuário.

### Planejar
Problemas relacionados à organização da rotina de cozinha:

- Dificuldade em montar um cardápio semanal equilibrado nutricionalmente e sem repetição.
- Trabalho manual de conferir a despensa e montar a lista de compras a partir do cardápio.
- Dificuldade em organizar cardápios para ocasiões especiais, escalando receitas para o número certo de convidados.
- Falta de integração entre o plano alimentar do dia a dia e metas nutricionais pessoais (calorias, macronutrientes, IMC).

### Controlar
Problemas relacionados ao acompanhamento e à segurança dos dados de cozinha:

- Desperdício de alimentos por falta de acompanhamento de validade e de padrões de consumo.
- Ausência de um histórico consultável do que já foi preparado, avaliado e ajustado.
- Falta de controle de custo estimado das receitas preparadas.
- Perda de pequenos aprendizados de cozinha (ajustes de sal, tempo, substituições) que não ficam registrados em lugar nenhum.
- Necessidade de manter os dados do usuário seguros e privados, especialmente restrições de saúde e histórico de segurança alimentar.

---

## 👁 Visão do Projeto <a name="visao-do-projeto"></a>

<p>O <b>Sabores</b> é um aplicativo de culinária (Android) que funciona como um assistente pessoal de cozinha: em vez de tratar o usuário como um leitor passivo de um catálogo de receitas, o app parte da <b>despensa real</b> do usuário, das suas <b>restrições alimentares</b> e do seu <b>histórico de preparo</b> para decidir o que ele deveria cozinhar. O usuário cadastra os ingredientes que tem em casa (digitando ou fotografando), e o app sugere receitas viáveis priorizando o que está prestes a vencer, já ocultando por completo qualquer receita insegura para suas restrições. Ao escolher uma receita, o app ajusta porções, sugere substituições para o que falta, adapta ao equipamento disponível e guia o preparo passo a passo com temporizadores. O que é preparado é avaliado e registrado, retroalimentando as próximas recomendações. Ao redor desse ciclo central existem camadas de planejamento semanal, lista de compras automática, nutrição, comunidade e sincronização entre dispositivos — mas o coração do produto é sempre o mesmo: <b>o que eu tenho → o que eu posso fazer → como eu faço → o que eu aprendo com isso</b>.</p>

---

## Cronograma de Sprints <a name="cronograma"></a>

| Sprint | Período | Status | Relatório |
|:------:|:-------:|:------:|:---------:|
| 1 — Fundação | [PREENCHER] | Iniciado | — |
| 2 — Expansão | [PREENCHER] | Não iniciado | — |
| 3 — Finalização e Entrega | [PREENCHER] | Não iniciado | — |

> O detalhamento completo de objetivo, Definition of Done e critérios de conclusão de cada sprint está em [`sprints.md`](sprints.md).

---

### 📃 Estrutura de Branches
- **Main** — Estado principal que armazena a versão estável do projeto
- **Dev** — Estado de desenvolvimento atual

### ⬜ Status do projeto: 0/3 Sprints

---

## 📋 Requisitos <a name="requisitos"></a>

> Os IDs abaixo (RF1...RF120 / RNF1...RNF20) correspondem, na mesma ordem, a RF-001...RF-120 e RNF-001...RNF-020 em [`requisitos_f_nf.md`](requisitos_f_nf.md), onde cada um traz descrição completa, origem (User Story), critérios relacionados e prioridade. Aqui eles são apresentados em formato resumido.

### Requisitos Funcionais

**Despensa Virtual e Redução de Desperdício**

| RF | Nome | Descritivo |
|----|------|------------|
| RF1 | Cadastrar item na despensa | O sistema deve permitir cadastrar item com nome, quantidade, unidade, categoria e validade opcional. |
| RF2 | Consolidar quantidade existente | O sistema deve somar a quantidade quando o item já existir na despensa. |
| RF3 | Validar dados da despensa | O sistema deve impedir salvar item com quantidade vazia, não numérica ou negativa. |
| RF4 | Editar/remover item da despensa | O sistema deve permitir editar ou remover um item, refletindo de imediato. |
| RF5 | Sugerir receitas pela despensa | O sistema deve sugerir receitas com no máximo 3 itens adicionais além da despensa. |
| RF6 | Priorizar por validade/desperdício | O sistema deve priorizar sugestões que evitam desperdício e usam itens com validade próxima. |
| RF7 | Estado vazio de sugestão | O sistema deve orientar o usuário quando não houver receita viável. |
| RF8 | Notificar validade próxima | O sistema deve alertar sobre itens perto de vencer, com antecedência configurável. |
| RF9 | Sugerir receita por alerta de validade | O sistema deve sugerir receitas priorizando o ingrediente alertado. |
| RF10 | Calcular periodicidade de reposição | O sistema deve estimar a periodicidade de reposição de itens não perecíveis. |
| RF11 | Notificar reposição via push | O sistema deve notificar via FCM quando um item provavelmente está no fim. |
| RF12 | Estimar desperdício mensal | O sistema deve calcular a estimativa de alimentos descartados por mês. |
| RF13 | Sugerir aproveitamento integral | O sistema deve sugerir estratégias de aproveitamento (cascas, talos etc.). |
| RF14 | Sugerir receitas de aproveitamento de sobras | O sistema deve sugerir receitas com base no histórico recente de sobras. |

**Cadastro e Criação de Receitas**

| RF | Nome | Descritivo |
|----|------|------------|
| RF15 | Criar receita via editor estruturado | O sistema deve permitir criar receita com título, ingredientes, passos e categoria. |
| RF16 | Validar consistência da receita | O sistema deve impedir salvar receita com passos/ingredientes/tempos inconsistentes. |
| RF17 | Extrair dados de receita por imagem | O sistema deve extrair título/ingredientes/preparo a partir de foto (ML local). |
| RF18 | Revisar dados extraídos por imagem | O sistema deve exigir revisão/confirmação antes de salvar receita extraída. |
| RF19 | Importar receita via link | O sistema deve extrair dados de receita a partir de um link (scraping). |
| RF20 | Importar receita via arquivo de texto | O sistema deve extrair dados de receita a partir de arquivo de texto (NLP). |
| RF21 | Tratar falha de importação | O sistema deve exibir erro claro em falha de link/conteúdo inválido. |
| RF22 | Detectar receitas duplicadas | O sistema deve alertar sobre possível duplicata por similaridade de cosseno. |
| RF23 | Fusão guiada de receitas | O sistema deve oferecer merge guiado entre receitas semelhantes. |
| RF24 | Salvar rascunho automaticamente | O sistema deve salvar rascunho de receita a cada 30 segundos. |
| RF25 | Restaurar rascunho | O sistema deve permitir retomar edição a partir do último rascunho salvo. |

**Busca e Descoberta de Receitas**

| RF | Nome | Descritivo |
|----|------|------------|
| RF26 | Filtrar por critérios combinados | O sistema deve filtrar por tempo, dificuldade, dieta, alergenicidade, estação, equipamento. |
| RF27 | Ordenar busca por relevância | O sistema deve ordenar resultados considerando o histórico do usuário. |
| RF28 | Buscar por foto de prato pronto | O sistema deve sugerir receitas semelhantes a partir de foto de um prato. |
| RF29 | Buscar por ingrediente em destaque | O sistema deve retornar receitas em que o ingrediente é componente relevante. |
| RF30 | Buscar excluindo ingrediente | O sistema deve retornar receitas que propositalmente não usam um ingrediente. |
| RF31 | Buscar por técnica culinária | O sistema deve exibir explicação da técnica antes das receitas relacionadas. |
| RF32 | Buscar por comando de voz | O sistema deve interpretar buscas faladas, inclusive intenções complexas. |
| RF33 | Sugerir receitas sazonais | O sistema deve sugerir receitas por estação/localização (GPS com consentimento). |
| RF34 | Cadastrar equipamento disponível | O sistema deve permitir cadastrar utensílios/eletrodomésticos do usuário. |
| RF35 | Filtrar por equipamento disponível | O sistema deve exibir apenas receitas viáveis com o equipamento cadastrado. |
| RF36 | Modo de receitas rápidas | O sistema deve exibir receitas com menos de 15 minutos de preparo. |

**Planejamento de Refeições**

| RF | Nome | Descritivo |
|----|------|------------|
| RF37 | Gerar planejamento semanal | O sistema deve gerar cardápio de 7 dias otimizado para despensa e nutrição. |
| RF38 | Reorganizar planejamento (drag-and-drop) | O sistema deve permitir arrastar/trocar receitas entre dias. |
| RF39 | Recalcular lista de compras | O sistema deve recalcular a lista de compras após alteração do planejamento. |
| RF40 | Menu de ocasião especial | O sistema deve escalar automaticamente receitas por número de convidados. |
| RF41 | Cronograma de preparação antecipado | O sistema deve gerar cronograma de tarefas para dias antes do evento. |
| RF42 | Plano de dieta por favoritos | O sistema deve montar plano alimentar a partir de receitas favoritas e metas. |
| RF43 | Sugerir ajustes de dieta | O sistema deve sugerir ajustes quando as metas diárias não forem atingidas. |
| RF44 | Ajustar plano por IMC/peso | O sistema deve ajustar porções/frequência conforme progresso de meta de peso. |
| RF45 | Cronograma otimizado de preparo | O sistema deve calcular cronograma que minimize tempo com tarefas paralelas. |
| RF46 | Compatibilidade entre receitas | O sistema deve calcular índice de conflito entre receitas da mesma refeição. |
| RF47 | Sugerir acompanhamentos | O sistema deve sugerir acompanhamentos/entradas/sobremesas compatíveis. |

**Preparo Guiado na Cozinha**

| RF | Nome | Descritivo |
|----|------|------------|
| RF48 | Modo de preparo passo a passo | O sistema deve exibir instruções com temporizador integrado por etapa. |
| RF49 | Marcar etapa concluída | O sistema deve avançar a etapa ao ser marcada como concluída. |
| RF50 | Registrar ajuste como versão alternativa | O sistema deve salvar ajustes de preparo sem sobrescrever a receita original. |
| RF51 | Temporizadores múltiplos simultâneos | O sistema deve rodar dois ou mais temporizadores independentes. |
| RF52 | Pausar/retomar temporizador individual | O sistema deve pausar um temporizador sem afetar os demais. |
| RF53 | Reproduzir instruções em áudio | O sistema deve narrar as instruções de preparo. |
| RF54 | Navegar etapas por comando de voz | O sistema deve avançar/retroceder etapas por voz. |
| RF55 | Pausar áudio durante temporizador ativo | O sistema deve pausar o áudio durante contagem regressiva. |
| RF56 | Exibir dica de segurança contextual | O sistema deve mostrar lembretes de higiene conforme a etapa. |
| RF57 | Registrar cumprimento no perfil de segurança | O sistema deve registrar a confirmação da prática de higiene. |
| RF58 | Reorganizar etapas (cozinha suja) | O sistema deve reordenar etapas para minimizar lavagem de utensílios. |
| RF59 | Gerar imagens ilustrativas por IA | O sistema deve gerar imagens de etapa quando não há fotos originais. |
| RF60 | Perguntar precisão de medidas | O sistema deve perguntar, ao final, se as medidas estavam corretas. |
| RF61 | Ajustar conversões pelo feedback | O sistema deve usar o feedback de precisão em conversões/escalas futuras. |
| RF62 | Recalcular quantidades por porções | O sistema deve recalcular ingredientes proporcionalmente às porções. |
| RF63 | Regra especial p/ ingredientes não lineares | O sistema deve tratar fermentos/especiarias fora da proporção direta. |
| RF64 | Alertar limitação física na escala | O sistema deve alertar sobre limite de forma/panela na nova escala. |
| RF65 | Ajustar para porção individual | O sistema deve ajustar quantidades e tempos mínimos para uma porção. |
| RF66 | Adaptar para equipamento alternativo | O sistema deve ajustar tempo/temperatura para outro equipamento de cocção. |
| RF67 | Converter métrico/imperial | O sistema deve converter quantidades entre os dois sistemas. |
| RF68 | Converter volume/peso por densidade | O sistema deve converter usando densidade específica do ingrediente. |
| RF69 | Converter medidas caseiras | O sistema deve apresentar equivalência aproximada e personalizável. |
| RF70 | Gerar vídeo curto da receita | O sistema deve gerar vídeo com imagens, texto e narração das etapas. |
| RF71 | Salvar/compartilhar vídeo sem custo | O sistema deve permitir salvar/compartilhar o vídeo sem custo adicional. |

**Substituição e Restrições Alimentares**

| RF | Nome | Descritivo |
|----|------|------------|
| RF72 | Sugerir substituição inteligente | O sistema deve sugerir alternativas por função/sabor/textura/proporção. |
| RF73 | Priorizar substituição por despensa | O sistema deve priorizar substituição disponível na despensa do usuário. |
| RF74 | Exibir índice de confiança | O sistema deve exibir confiança de cada substituição sugerida. |
| RF75 | Registrar histórico de substituições | O sistema deve registrar as substituições feitas pelo usuário. |
| RF76 | Sugerir substituição já usada | O sistema deve reaplicar automaticamente substituição usada antes. |
| RF77 | Cadastrar restrições/alergias | O sistema deve permitir cadastrar múltiplas condições simultâneas. |
| RF78 | Ocultar receitas inseguras | O sistema deve ocultar totalmente receitas com ingrediente proibido, mesmo em traço. |
| RF79 | Exibir selo de certificação | O sistema deve certificar visualmente receitas seguras para o perfil. |

**Nutrição**

| RF | Nome | Descritivo |
|----|------|------------|
| RF80 | Calcular nutrição por receita | O sistema deve calcular calorias/macros/fibras/sódio/açúcar por receita (TACO). |
| RF81 | Calcular nutrição do planejamento | O sistema deve agregar os valores nutricionais do planejamento semanal. |
| RF82 | Comparar com recomendação diária | O sistema deve comparar valores com a recomendação diária personalizada. |

**Avaliação, Histórico e Recomendação Personalizada**

| RF | Nome | Descritivo |
|----|------|------------|
| RF83 | Avaliar receita em 5 estrelas | O sistema deve permitir avaliar com nota e comentários (dificuldade/sabor/tempo). |
| RF84 | Influenciar recomendação por perfil similar | O sistema deve usar avaliações para recomendar a usuários parecidos. |
| RF85 | Registrar histórico de preparo | O sistema deve registrar data, avaliação, anotação e foto do prato. |
| RF86 | Evitar recomendação repetida recente | O sistema deve evitar repetir receita preparada recentemente. |
| RF87 | Anotações pessoais por receita | O sistema deve salvar e exibir anotações privadas ao reabrir a receita. |
| RF88 | Classificar nível de dificuldade | O sistema deve classificar receitas em iniciante/intermediário/avançado. |
| RF89 | Sugerir progressão de receitas | O sistema deve sugerir receitas de nível superior conforme evolução. |
| RF90 | Recomendação social por perfil | O sistema deve recomendar receitas bem avaliadas por perfil semelhante. |
| RF91 | Atribuir tags colaborativas | O sistema deve permitir atribuir tags a receitas de outros usuários. |
| RF92 | Validar tags por votação ponderada | O sistema deve exibir tag publicamente só após consistência de votos. |

**Organização Pessoal de Receitas**

| RF | Nome | Descritivo |
|----|------|------------|
| RF93 | Organizar receitas em coleções | O sistema deve permitir coleções temáticas, receita em múltiplas coleções. |
| RF94 | Compartilhar coleção via link temporário | O sistema deve gerar link temporário para compartilhar uma coleção. |
| RF95 | Comparar receitas lado a lado | O sistema deve comparar 2-3 receitas em tabela (ingredientes/tempo/nutrição). |
| RF96 | Versões alternativas com avaliação separada | O sistema deve manter versões de receita com histórico próprio. |
| RF97 | Favorito com contexto de escala/substituição | O sistema deve salvar escala e substituições da última preparação. |

**Lista de Compras e Economia Doméstica**

| RF | Nome | Descritivo |
|----|------|------------|
| RF98 | Gerar lista de compras do planejamento | O sistema deve gerar lista subtraindo o que já está na despensa. |
| RF99 | Organizar lista por categoria | O sistema deve agrupar itens por categoria (hortaliças, proteínas etc.). |
| RF100 | Marcar item como adquirido | O sistema deve diferenciar visualmente item já comprado. |
| RF101 | Destacar ingrediente disponível/faltante | O sistema deve destacar na receita o que falta e o que já se tem. |
| RF102 | Adicionar faltantes em lote | O sistema deve adicionar todos os itens faltantes em uma única ação. |
| RF103 | Registrar histórico de compras | O sistema deve registrar itens adicionados à lista ao longo do tempo. |
| RF104 | Identificar padrões de consumo | O sistema deve alertar sobre itens de alto uso e itens nunca usados. |
| RF105 | Calcular custo por porção | O sistema deve estimar custo com base em preços médios (API pública). |
| RF106 | Permitir preço personalizado | O sistema deve usar preço informado pelo usuário com precedência. |
| RF107 | Gerar lista de compras sazonal mensal | O sistema deve gerar lista mensal por receitas frequentes e preço/qualidade. |

**Compartilhamento e Comunidade**

| RF | Nome | Descritivo |
|----|------|------------|
| RF108 | Compartilhar receita via QR code offline | O sistema deve compartilhar receita via QR code sem internet. |
| RF109 | Seguir usuários e notificar novidades | O sistema deve notificar quando usuário seguido adicionar receita. |
| RF110 | Exibir feed de novidades agrupado por dia | O sistema deve exibir feed estilo timeline com curtir/comentar. |

**Sincronização, Nuvem e Backup**

| RF | Nome | Descritivo |
|----|------|------------|
| RF111 | Sincronizar dados entre dispositivos | O sistema deve sincronizar despensa/favoritos/planejamento em tempo real. |
| RF112 | Resolver conflitos de sincronização | O sistema deve resolver conflitos pelo timestamp mais recente. |
| RF113 | Armazenar receitas na nuvem | O sistema deve restringir leitura/escrita ao proprietário da receita. |
| RF114 | Backup automático diário | O sistema deve fazer backup diário e restauração sob demanda. |
| RF115 | Exportar backup criptografado | O sistema deve exportar dados protegidos por AES-256. |
| RF116 | Importar backup com verificação de hash | O sistema deve bloquear importação se a integridade falhar. |

**Integração com Assistentes Virtuais**

| RF | Nome | Descritivo |
|----|------|------------|
| RF117 | Consultar despensa/receita por assistente virtual | O sistema deve expor API REST segura para Google Assistant/Alexa. |

**Receitas de Bebidas**

| RF | Nome | Descritivo |
|----|------|------------|
| RF118 | Cadastrar/consultar receitas de bebidas | O sistema deve ter campos específicos (teor alcoólico, açúcar) para bebidas. |

**Técnicas Culinárias**

| RF | Nome | Descritivo |
|----|------|------------|
| RF119 | Consultar biblioteca de técnicas | O sistema deve exibir vídeo e descrição de cada técnica culinária. |
| RF120 | Associar técnica automaticamente à receita | O sistema deve vincular a técnica a toda receita que a utiliza. |

### Requisitos Não Funcionais

| RNF | Nome | Descritivo |
|-----|------|------------|
| RNF1 | Restrição de acesso a receitas na nuvem | Apenas o proprietário lê/escreve suas receitas pessoais no Firestore. |
| RNF2 | Criptografia de backup exportado | Backup exportado deve ser protegido por AES-256. |
| RNF3 | Intermediação segura com assistentes virtuais | Comunicação com Google Assistant/Alexa deve passar por servidor intermediário. |
| RNF4 | Consentimento explícito de localização | GPS só pode ser usado com consentimento explícito do usuário. |
| RNF5 | Privacidade das anotações pessoais | Anotações são visíveis apenas ao usuário que as criou. |
| RNF6 | Privacidade do perfil de segurança alimentar | Registro de higiene não é exposto publicamente. |
| RNF7 | Processamento local da recomendação social | Filtro colaborativo roda on-device (TensorFlow Lite). |
| RNF8 | Ocultação rigorosa sem exceções | Nenhuma exceção de "quantidade traço" na ocultação de receita insegura. |
| RNF9 | Verificação de integridade de backups | Hash deve ser validado antes de importar backup. |
| RNF10 | Persistência automática de rascunhos | Rascunho de receita salvo a cada 30 segundos. |
| RNF11 | Resolução determinística de conflitos | Conflito de sincronização resolvido por timestamp. |
| RNF12 | Reconhecimento de imagem local (on-device) | Extração de dados por foto roda no dispositivo. |
| RNF13 | Busca local indexada (SQLite) | Busca avançada resolvida por índice invertido local. |
| RNF14 | Sincronização em tempo real (WebSockets) | Propagação de alterações entre dispositivos em tempo real. |
| RNF15 | Funcionamento offline do QR code | Compartilhamento via QR code não depende de internet. |
| RNF16 | Compatibilidade exclusiva com Android | Aplicativo compilado e funcional apenas para Android. |
| RNF17 | API nativa de reconhecimento de fala | Busca por voz usa a API nativa de fala do Android. |
| RNF18 | Arquitetura cliente-servidor (RN + Node.js) | Stack definida: React Native no cliente, Node.js no servidor. |
| RNF19 | Fontes de dados públicas e gratuitas | Substituição de ingredientes usa FoodData Central (gratuita). |
| RNF20 | Vídeo sem custo adicional ao usuário | Geração/compartilhamento de vídeo não gera custo de serviço. |

> RNFs recomendados (boas práticas não exigidas explicitamente pelos requisitos originais — testes automatizados, acessibilidade, monitoramento, rate limiting etc.) estão listados à parte em `requisitos_f_nf.md`, seção "RNFs Recomendados", e não entram no escopo obrigatório do backlog.

---

## 🖥 Wireframes <a name="wireframes"></a>

- [Wireframe do produto](docs/Sabores_Wireframe.pdf)

---

## 📜 Product Backlog <a name="backlog"></a>

> Estimativas em pontos (escala simplificada 3/5/8), atribuídas pelo autor com base na quantidade de critérios de aceitação e na complexidade técnica de cada User Story (detalhamento completo em `user_stories.md`). Prioridade herdada da metodologia descrita em `user_stories.md` (Must Have → Alta, Should Have → Média, Could Have → Baixa).

| RANK | SPRINT | PRIORIDADE | ESTIMATIVA | USER STORY | RF | STATUS |
|:----:|:------:|:----------:|:----------:|------------|:--:|:------:|
| 1 | 1 | Alta | 5 | Como usuário, quero cadastrar os ingredientes que tenho em casa (quantidade, validade, categoria), para que o app saiba o que tenho disponível. | RF1-4 | ⬜ |
| 2 | 1 | Alta | 8 | Como usuário, quero receber sugestões de receitas que já consigo preparar com o que tenho, para cozinhar sem comprar muito e evitar desperdício. | RF5-7 | ⬜ |
| 3 | 1 | Alta | 8 | Como usuário, quero criar uma receita em um editor estruturado, para guardar minhas próprias receitas. | RF15-16 | ⬜ |
| 4 | 1 | Alta | 8 | Como usuário, quero fotografar uma receita/embalagem e ter os dados extraídos automaticamente, para cadastrar receitas rapidamente. | RF17-18 | ⬜ |
| 5 | 1 | Média | 5 | Como usuário, quero ser avisado ao cadastrar uma receita muito parecida com outra existente, para manter minha biblioteca organizada. | RF22-23 | ⬜ |
| 6 | 1 | Média | 3 | Como usuário, quero ter meu progresso de criação de receita salvo automaticamente, para não perder meu trabalho. | RF24-25 | ⬜ |
| 7 | 1 | Alta | 8 | Como usuário, quero filtrar receitas por tempo, dificuldade, dieta, alergenicidade, estação e equipamento, para encontrar o que atende minhas condições. | RF26-27 | ⬜ |
| 8 | 1 | Alta | 3 | Como usuário, quero buscar receitas que usem ou excluam um ingrediente específico, para aproveitar ou evitar determinado item. | RF29-30 | ⬜ |
| 9 | 1 | Alta | 8 | Como usuário, quero seguir o modo de preparo passo a passo com temporizador, para cozinhar sem perder o tempo de cada etapa. | RF48-50 | ⬜ |
| 10 | 1 | Média | 3 | Como usuário, quero iniciar vários cronômetros simultâneos, para acompanhar etapas diferentes ao mesmo tempo. | RF51-52 | ⬜ |
| 11 | 1 | Alta | 8 | Como usuário, quero escalar a receita para outro número de porções, para preparar a quantidade certa de comida. | RF62-64 | ⬜ |
| 12 | 1 | Média | 5 | Como usuário, quero converter unidades de medida (métrico/imperial/volumétrico), para seguir a receita com as unidades que entendo. | RF67-68 | ⬜ |
| 13 | 1 | Baixa | 3 | Como usuário, quero entender medidas caseiras como "uma pitada" ou "a gosto", para seguir receitas tradicionais com mais precisão. | RF69 | ⬜ |
| 14 | 1 | Alta | 8 | Como usuário, quero receber alternativas quando um ingrediente não estiver disponível, para conseguir preparar a receita mesmo assim. | RF72 | ⬜ |
| 15 | 1 | Alta | 3 | Como usuário, quero cadastrar minhas restrições alimentares e alergias, para que o app saiba quais receitas são seguras. | RF77 | ⬜ |
| 16 | 1 | Alta | 5 | Como usuário com restrições, quero que receitas inseguras sejam completamente ocultadas, para ter certeza de só ver o que é seguro. | RF78-79 | ⬜ |
| 17 | 1 | Alta | 8 | Como usuário, quero ver calorias e valores nutricionais de uma receita e do planejamento, para entender o impacto do que estou comendo. | RF80-82 | ⬜ |
| 18 | 2 | Média | 3 | Como usuário, quero receber um alerta quando um ingrediente estiver perto de vencer, para usá-lo a tempo e evitar desperdício. | RF8-9 | ⬜ |
| 19 | 2 | Baixa | 5 | Como usuário, quero receber sugestão de periodicidade de reposição de itens não perecíveis, para repor no tempo certo. | RF10-11 | ⬜ |
| 20 | 2 | Média | 5 | Como usuário, quero ver quanto alimento descarto por mês e receber estratégias de aproveitamento, para reduzir meu desperdício. | RF12-13 | ⬜ |
| 21 | 2 | Média | 5 | Como usuário, quero colar um link ou carregar um arquivo de texto de uma receita, para importá-la sem digitar tudo. | RF19-21 | ⬜ |
| 22 | 2 | Média | 3 | Como usuário, quero buscar receitas por técnica culinária específica, para aprender e praticar essa técnica. | RF31 | ⬜ |
| 23 | 2 | Baixa | 5 | Como usuário, quero buscar receitas ou ingredientes por comando de voz, para pesquisar com as mãos ocupadas. | RF32 | ⬜ |
| 24 | 2 | Média | 5 | Como usuário, quero receber sugestões de receitas sazonais da minha região, para comer de forma mais sustentável e econômica. | RF33 | ⬜ |
| 25 | 2 | Média | 3 | Como usuário, quero informar os equipamentos que tenho, para ver apenas receitas que consigo realmente preparar. | RF34-35 | ⬜ |
| 26 | 2 | Média | 3 | Como usuário, quero um modo de receitas rápidas (menos de 15 minutos), para dias corridos. | RF36 | ⬜ |
| 27 | 2 | Alta | 8 | Como usuário, quero que o sistema gere um cardápio completo para os 7 dias da semana, para não decidir todo dia o que cozinhar. | RF37 | ⬜ |
| 28 | 2 | Alta | 5 | Como usuário, quero arrastar e trocar receitas entre dias do planejamento, para ajustar o cardápio à minha rotina. | RF38-39 | ⬜ |
| 29 | 2 | Baixa | 5 | Como usuário, quero criar um menu completo para uma ocasião especial, para organizar uma refeição para o número certo de convidados. | RF40-41 | ⬜ |
| 30 | 2 | Média | 5 | Como usuário, quero integrar minhas receitas favoritas em um plano que atenda metas de calorias e macros, para seguir uma dieta equilibrada. | RF42-43 | ⬜ |
| 31 | 2 | Média | 5 | Como usuário, quero um cronograma que minimize meu tempo total na cozinha ao preparar várias receitas, para organizar tarefas em paralelo. | RF45 | ⬜ |
| 32 | 2 | Baixa | 3 | Como usuário, quero que o sistema sugira acompanhamentos, entradas e sobremesas para uma receita principal, para montar um menu completo. | RF47 | ⬜ |
| 33 | 2 | Baixa | 5 | Como usuário, quero ouvir a receita em áudio e navegar por comando de voz, para cozinhar sem tocar no celular com as mãos sujas. | RF53-55 | ⬜ |
| 34 | 2 | Média | 3 | Como usuário, quero ver lembretes de segurança alimentar durante o preparo, para cozinhar com segurança. | RF56-57 | ⬜ |
| 35 | 2 | Baixa | 5 | Como usuário, quero ativar o modo "cozinha suja", para sujar e lavar menos louça. | RF58 | ⬜ |
| 36 | 2 | Baixa | 5 | Como usuário, quero ver imagens ilustrativas do preparo mesmo sem fotos originais, para entender melhor cada etapa. | RF59 | ⬜ |
| 37 | 2 | Média | 3 | Como usuário, quero informar se as medidas da receita estavam corretas, para ajudar o app a refinar futuras conversões. | RF60-61 | ⬜ |
| 38 | 2 | Média | 3 | Como usuário, quero selecionar a opção "uma porção", para cozinhar sem sobras desnecessárias. | RF65 | ⬜ |
| 39 | 2 | Média | 5 | Como usuário, quero adaptar a receita para outro equipamento (air fryer, panela de pressão etc.), para usar o que tenho disponível. | RF66 | ⬜ |
| 40 | 2 | Baixa | 8 | Como usuário, quero gerar um vídeo curto a partir da receita, para salvar ou compartilhar em redes sociais. | RF70-71 | ⬜ |
| 41 | 2 | Alta | 5 | Como usuário, quero que a substituição sugerida priorize o que já tenho na despensa, para aproveitar o que já está em casa. | RF73-74 | ⬜ |
| 42 | 2 | Média | 3 | Como usuário, quero ver receitas que avaliei e comentei, para registrar minha experiência de preparo. | RF83-84 | ⬜ |
| 43 | 2 | Média | 5 | Como usuário, quero ver todas as receitas que já preparei, para acompanhar minha trajetória culinária. | RF85-86 | ⬜ |
| 44 | 2 | Média | 3 | Como usuário, quero escrever observações privadas em uma receita, para lembrar ajustes na próxima vez. | RF87 | ⬜ |
| 45 | 2 | Baixa | 8 | Como usuário, quero ver receitas bem avaliadas por usuários com perfil parecido com o meu, para descobrir receitas com maior chance de agradar. | RF90 | ⬜ |
| 46 | 2 | Baixa | 5 | Como usuário, quero atribuir tags a receitas de outros usuários, para ajudar a comunidade a categorizá-las melhor. | RF91-92 | ⬜ |
| 47 | 2 | Média | 3 | Como usuário, quero organizar minhas receitas favoritas em pastas temáticas, para encontrar rapidamente receitas para cada ocasião. | RF93-94 | ⬜ |
| 48 | 2 | Baixa | 5 | Como usuário, quero guardar diferentes versões de uma mesma receita, para alternar entre elas conforme minha necessidade. | RF96 | ⬜ |
| 49 | 2 | Baixa | 3 | Como usuário, quero que meus favoritos guardem a escala e substituições da última preparação, para reproduzir a experiência que deu certo. | RF97 | ⬜ |
| 50 | 2 | Alta | 5 | Como usuário, quero que a lista de compras seja gerada automaticamente a partir do planejamento e da despensa, para saber exatamente o que comprar. | RF98-100 | ⬜ |
| 51 | 2 | Média | 3 | Como usuário, quero ver quais ingredientes tenho e quais faltam em uma receita, para adicionar os faltantes à lista de compras com um toque. | RF101-102 | ⬜ |
| 52 | 2 | Média | 5 | Como usuário, quero ver meu histórico de compras e padrões de consumo, para comprar de forma mais inteligente. | RF103-104 | ⬜ |
| 53 | 2 | Média | 5 | Como usuário, quero ver o custo estimado por porção de cada receita, para planejar refeições considerando o orçamento. | RF105-106 | ⬜ |
| 54 | 2 | Baixa | 5 | Como usuário, quero receber uma lista de compras ideal para o mês, para planejar compras mensais de forma econômica. | RF107 | ⬜ |
| 55 | 2 | Baixa | 5 | Como usuário, quero enviar uma receita para outro usuário via QR code, para compartilhar mesmo sem internet. | RF108 | ⬜ |
| 56 | 2 | Baixa | 5 | Como usuário, quero seguir outros usuários e ver as receitas que eles adicionam, para descobrir novas receitas. | RF109-110 | ⬜ |
| 57 | 2 | Média | 8 | Como usuário logado em mais de um dispositivo, quero que minha despensa, favoritos e planejamento estejam sempre sincronizados, para usar o app em qualquer aparelho. | RF111-112 | ⬜ |
| 58 | 2 | Média | 5 | Como usuário, quero que minhas receitas fiquem armazenadas na nuvem com backup automático, para não perdê-las se o dispositivo for danificado. | RF113-114 | ⬜ |
| 59 | 2 | Média | 5 | Como usuário, quero exportar e importar um backup criptografado de todos os meus dados, para migrar ou restaurar com segurança. | RF115-116 | ⬜ |
| 60 | 2 | Baixa | 5 | Como usuário, quero consultar minha despensa e receitas pelo Google Assistant/Alexa, para não precisar abrir o app. | RF117 | ⬜ |
| 61 | 2 | Média | 3 | Como usuário, quero acessar uma biblioteca de técnicas culinárias com vídeos e descrições, para aprender antes de executar a receita. | RF119-120 | ⬜ |
| 62 | 3 | Baixa | 3 | Como usuário, quero receber sugestões de receitas para aproveitar sobras de refeições anteriores, para não desperdiçar comida. | RF14 | ⬜ |
| 63 | 3 | Baixa | 5 | Como usuário, quero fotografar um prato pronto que vi em algum lugar, para descobrir receitas semelhantes. | RF28 | ⬜ |
| 64 | 3 | Baixa | 3 | Como usuário, quero que minhas metas de peso/IMC influenciem porções e frequência de receitas, para acompanhar minha evolução corporal. | RF44 | ⬜ |
| 65 | 3 | Baixa | 3 | Como usuário, quero saber se duas receitas planejadas juntas vão gerar conflito na cozinha, para evitar problemas de logística. | RF46 | ⬜ |
| 66 | 3 | Baixa | 3 | Como usuário, quero que o sistema lembre das substituições que já fiz, para receber as mesmas sugestões automaticamente. | RF75-76 | ⬜ |
| 67 | 3 | Baixa | 5 | Como usuário, quero ver receitas classificadas por dificuldade e um caminho de progressão, para evoluir gradualmente na cozinha. | RF88-89 | ⬜ |
| 68 | 3 | Baixa | 3 | Como usuário, quero comparar duas ou três receitas lado a lado, para decidir qual encaixa melhor no momento. | RF95 | ⬜ |
| 69 | 3 | Baixa | 3 | Como usuário, quero uma interface específica para bebidas (coquetéis, sucos, infusões), para preparar bebidas com informações que a comida não tem. | RF118 | ⬜ |

---

## 📝 Sprint Backlog <a name="backsprint"></a>

> Os Critérios de Aceitação completos (Given/When/Then, Regras de Negócio e Dependências) estão detalhados em [`user_stories.md`](user_stories.md). Abaixo, versão resumida por User Story.

<details>
<summary><strong>Sprint 1 — Fundação: Despensa, Receitas, Pilares Centrais e Preparo Guiado</strong></summary>

<br>

> **Período:** [PREENCHER]
> **Foco:** despensa virtual, criação/cadastro de receitas, os cinco pilares do produto (recomendação por despensa, substituição inteligente, reconhecimento de imagem, busca, restrições/segurança), escala, conversão de unidades, nutrição e preparo guiado.

| RANK | PRIORIDADE | ESTIMATIVA | USER STORY | RF | STATUS |
|:----:|:----------:|:----------:|------------|:--:|:------:|
| 1 | Alta | 5 | US-001 — Cadastrar itens na despensa virtual | RF1-4 | ⬜ |
| 2 | Alta | 8 | US-002 — Receber sugestões de receitas com base na despensa | RF5-7 | ⬜ |
| 3 | Alta | 8 | US-007 — Criar uma receita manualmente em editor estruturado | RF15-16 | ⬜ |
| 4 | Alta | 8 | US-008 — Cadastrar receita por reconhecimento de imagem | RF17-18 | ⬜ |
| 5 | Média | 5 | US-010 — Ser impedido de cadastrar receitas duplicadas | RF22-23 | ⬜ |
| 6 | Média | 3 | US-011 — Ter rascunho de receita salvo automaticamente | RF24-25 | ⬜ |
| 7 | Alta | 8 | US-012 — Buscar receitas com filtros avançados | RF26-27 | ⬜ |
| 8 | Alta | 3 | US-014 — Buscar receitas por ingrediente em destaque ou exclusão | RF29-30 | ⬜ |
| 9 | Alta | 8 | US-028 — Seguir o modo de preparo passo a passo com temporizador | RF48-50 | ⬜ |
| 10 | Média | 3 | US-029 — Usar temporizadores múltiplos simultâneos | RF51-52 | ⬜ |
| 11 | Alta | 8 | US-035 — Escalar receita para outro número de porções | RF62-64 | ⬜ |
| 12 | Média | 5 | US-038 — Converter unidades de medida | RF67-68 | ⬜ |
| 13 | Baixa | 3 | US-039 — Converter medidas caseiras | RF69 | ⬜ |
| 14 | Alta | 8 | US-041 — Receber sugestão de substituição inteligente de ingrediente | RF72 | ⬜ |
| 15 | Alta | 3 | US-044 — Cadastrar restrições alimentares e alergias | RF77 | ⬜ |
| 16 | Alta | 5 | US-045 — Ter receitas inseguras ocultadas automaticamente | RF78-79 | ⬜ |
| 17 | Alta | 8 | US-046 — Visualizar informações nutricionais de uma receita e do planejamento semanal | RF80-82 | ⬜ |

---

<details>
<summary>US-001 — Cadastrar itens na despensa virtual</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir cadastrar um item com nome, quantidade, unidade, categoria e validade opcional.
- [ ] O sistema deve somar a quantidade automaticamente quando o item já existir na despensa.
- [ ] O sistema deve impedir o salvamento quando a quantidade for vazia, inválida ou negativa.

</details>

<details>
<summary>US-002 — Receber sugestões de receitas com base na despensa</summary>

**Critérios de Aceitação**
- [ ] O sistema deve sugerir receitas que usem exclusivamente itens da despensa ou no máximo 3 itens adicionais.
- [ ] O sistema deve priorizar receitas que evitam desperdício e usam itens com validade mais próxima.
- [ ] O sistema deve exibir um estado vazio orientando o usuário quando não houver receita viável.

</details>

<details>
<summary>US-007 — Criar uma receita manualmente em editor estruturado</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exigir título, ao menos um ingrediente e ao menos um passo para salvar a receita.
- [ ] O sistema deve validar que todo passo referencia ingredientes listados antes de salvar.
- [ ] O sistema deve impedir o salvamento de receitas com tempos incoerentes ou negativos.

</details>

<details>
<summary>US-008 — Cadastrar receita por reconhecimento de imagem</summary>

**Critérios de Aceitação**
- [ ] O sistema deve extrair título, ingredientes e modo de preparo a partir de uma foto, processando localmente no dispositivo.
- [ ] O sistema deve apresentar os dados extraídos em formulário revisável antes de salvar.
- [ ] O sistema deve informar falha e permitir nova tentativa ou preenchimento manual quando a extração falhar.

</details>

<details>
<summary>US-010 — Ser impedido de cadastrar receitas duplicadas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve alertar sobre possível duplicata por similaridade de título/ingredientes/passos antes de confirmar o salvamento.
- [ ] O sistema deve permitir visualizar a receita existente lado a lado com a nova.
- [ ] O sistema deve oferecer um merge guiado quando o usuário confirmar que são a mesma receita.

</details>

<details>
<summary>US-011 — Ter rascunho de receita salvo automaticamente</summary>

**Critérios de Aceitação**
- [ ] O sistema deve salvar o rascunho automaticamente a cada 30 segundos durante a criação de receita.
- [ ] O sistema deve permitir retomar a edição a partir do último rascunho após um fechamento inesperado.
- [ ] O sistema deve descartar o rascunho temporário após o salvamento final bem-sucedido.

</details>

<details>
<summary>US-012 — Buscar receitas com filtros avançados</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir combinar filtros de tempo, dificuldade, dieta, alergenicidade, estação e equipamento.
- [ ] O sistema deve ordenar os resultados considerando o histórico de uso do usuário.
- [ ] O sistema deve exibir mensagem clara e sugestão de relaxar filtro quando o resultado for vazio.

</details>

<details>
<summary>US-014 — Buscar receitas por ingrediente em destaque ou exclusão</summary>

**Critérios de Aceitação**
- [ ] O sistema deve retornar apenas receitas em que o ingrediente buscado tem papel de destaque.
- [ ] O sistema deve retornar apenas receitas que propositalmente excluem um ingrediente informado.
- [ ] O sistema deve exibir mensagem apropriada quando nenhuma receita atender ao critério.

</details>

<details>
<summary>US-028 — Seguir o modo de preparo passo a passo com temporizador</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exibir cada etapa com temporizador integrado quando aplicável.
- [ ] O sistema deve avançar para a próxima etapa ao marcar a atual como concluída.
- [ ] O sistema deve salvar ajustes de tempo/anotações como versão alternativa, sem sobrescrever a receita original.

</details>

<details>
<summary>US-029 — Usar temporizadores múltiplos simultâneos</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir iniciar dois ou mais temporizadores independentes ao mesmo tempo.
- [ ] O sistema deve emitir alerta sonoro distinto identificando qual etapa terminou.
- [ ] O sistema deve permitir pausar/retomar um temporizador específico sem afetar os demais.

</details>

<details>
<summary>US-035 — Escalar receita para outro número de porções</summary>

**Critérios de Aceitação**
- [ ] O sistema deve recalcular proporcionalmente todos os ingredientes ao alterar o número de porções.
- [ ] O sistema deve aplicar regra especial para ingredientes não lineares (fermentos, especiarias).
- [ ] O sistema deve alertar quando a nova escala exceder a capacidade física de forma/panela.

</details>

<details>
<summary>US-038 — Converter unidades de medida</summary>

**Critérios de Aceitação**
- [ ] O sistema deve converter corretamente entre sistema métrico e imperial.
- [ ] O sistema deve converter entre volume e peso usando densidade específica do ingrediente.
- [ ] O sistema deve informar quando a densidade do ingrediente não estiver disponível.

</details>

<details>
<summary>US-039 — Converter medidas caseiras</summary>

**Critérios de Aceitação**
- [ ] O sistema deve apresentar equivalência aproximada em unidade padrão para medidas caseiras.
- [ ] O sistema deve permitir personalizar essa equivalência conforme a experiência do usuário.
- [ ] O sistema deve reaplicar a personalização nas próximas ocorrências da mesma medida.

</details>

<details>
<summary>US-041 — Receber sugestão de substituição inteligente de ingrediente</summary>

**Critérios de Aceitação**
- [ ] O sistema deve sugerir alternativas com base em função culinária, sabor, textura e proporção.
- [ ] O sistema deve informar quando não houver substituição viável cadastrada.
- [ ] O sistema deve ajustar as quantidades da receita ao aceitar uma substituição.

</details>

<details>
<summary>US-044 — Cadastrar restrições alimentares e alergias</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir cadastrar múltiplas condições alimentares simultaneamente.
- [ ] O sistema deve considerar todas as condições cadastradas ao avaliar receitas.
- [ ] O sistema deve liberar novamente as receitas ao remover uma condição cadastrada.

</details>

<details>
<summary>US-045 — Ter receitas inseguras ocultadas automaticamente</summary>

**Critérios de Aceitação**
- [ ] O sistema deve ocultar totalmente qualquer receita com ingrediente proibido, mesmo em quantidade traço.
- [ ] O sistema deve exibir selo de certificação em receitas seguras para todas as restrições cadastradas.
- [ ] O sistema não deve certificar nem ocultar automaticamente receitas sem informação suficiente de ingredientes.

</details>

<details>
<summary>US-046 — Visualizar informações nutricionais de uma receita e do planejamento semanal</summary>

**Critérios de Aceitação**
- [ ] O sistema deve calcular calorias, proteínas, carboidratos, gorduras, fibras, sódio e açúcar por receita (tabela TACO).
- [ ] O sistema deve agregar os valores nutricionais de todo o planejamento semanal ativo.
- [ ] O sistema deve comparar os valores com a recomendação diária personalizada do perfil do usuário.

</details>

</details>

---

<details>
<summary><strong>Sprint 2 — Expansão: Planejamento, Lista de Compras, Comunidade e Sincronização</strong></summary>

<br>

> **Período:** [PREENCHER]
> **Foco:** planejamento de refeições, lista de compras, avaliação/histórico, substituição avançada, organização pessoal, comunidade, sincronização, nuvem, backup e integrações externas. Ao final desta sprint, 110 dos 120 RF (92%) e os 20 RNF obrigatórios já estão concluídos.

| RANK | PRIORIDADE | ESTIMATIVA | USER STORY | RF | STATUS |
|:----:|:----------:|:----------:|------------|:--:|:------:|
| 18 | Média | 3 | US-003 — Ser alertado sobre ingredientes próximos da validade | RF8-9 | ⬜ |
| 19 | Baixa | 5 | US-004 — Receber sugestão de periodicidade de reposição de itens não perecíveis | RF10-11 | ⬜ |
| 20 | Média | 5 | US-005 — Visualizar análise de desperdício de alimentos | RF12-13 | ⬜ |
| 21 | Média | 5 | US-009 — Importar receita a partir de link ou arquivo de texto | RF19-21 | ⬜ |
| 22 | Média | 3 | US-015 — Buscar receitas por técnica culinária específica | RF31 | ⬜ |
| 23 | Baixa | 5 | US-016 — Buscar receitas ou ingredientes por comando de voz | RF32 | ⬜ |
| 24 | Média | 5 | US-017 — Receber sugestões de receitas sazonais por localização | RF33 | ⬜ |
| 25 | Média | 3 | US-018 — Filtrar receitas por equipamento disponível | RF34-35 | ⬜ |
| 26 | Média | 3 | US-019 — Acessar modo de receitas rápidas | RF36 | ⬜ |
| 27 | Alta | 8 | US-020 — Gerar planejamento semanal automático | RF37 | ⬜ |
| 28 | Alta | 5 | US-021 — Reorganizar o planejamento semanal | RF38-39 | ⬜ |
| 29 | Baixa | 5 | US-022 — Planejar cardápio para ocasiões especiais | RF40-41 | ⬜ |
| 30 | Média | 5 | US-023 — Planejar dieta com metas de calorias e macronutrientes | RF42-43 | ⬜ |
| 31 | Média | 5 | US-025 — Visualizar cronograma otimizado de preparo | RF45 | ⬜ |
| 32 | Baixa | 3 | US-027 — Receber sugestão automática de acompanhamentos | RF47 | ⬜ |
| 33 | Baixa | 5 | US-030 — Ouvir receita em áudio com comandos de voz | RF53-55 | ⬜ |
| 34 | Média | 3 | US-031 — Visualizar dicas de segurança alimentar durante o preparo | RF56-57 | ⬜ |
| 35 | Baixa | 5 | US-032 — Usar o modo "cozinha suja" | RF58 | ⬜ |
| 36 | Baixa | 5 | US-033 — Visualizar imagens ilustrativas geradas automaticamente para o preparo | RF59 | ⬜ |
| 37 | Média | 3 | US-034 — Informar se as medidas indicadas estavam corretas | RF60-61 | ⬜ |
| 38 | Média | 3 | US-036 — Ajustar receita para porção individual | RF65 | ⬜ |
| 39 | Média | 5 | US-037 — Adaptar receita para outro equipamento de cocção | RF66 | ⬜ |
| 40 | Baixa | 8 | US-040 — Gerar vídeo curto a partir da receita | RF70-71 | ⬜ |
| 41 | Alta | 5 | US-042 — Receber sugestão de substituição com base na despensa | RF73-74 | ⬜ |
| 42 | Média | 3 | US-047 — Avaliar e comentar uma receita preparada | RF83-84 | ⬜ |
| 43 | Média | 5 | US-048 — Consultar histórico de receitas preparadas | RF85-86 | ⬜ |
| 44 | Média | 3 | US-049 — Adicionar anotações pessoais a uma receita | RF87 | ⬜ |
| 45 | Baixa | 8 | US-051 — Receber recomendações sociais de receitas | RF90 | ⬜ |
| 46 | Baixa | 5 | US-052 — Atribuir tags colaborativas a receitas | RF91-92 | ⬜ |
| 47 | Média | 3 | US-053 — Organizar receitas em coleções/pastas temáticas | RF93-94 | ⬜ |
| 48 | Baixa | 5 | US-055 — Alternar entre versões alternativas de uma receita | RF96 | ⬜ |
| 49 | Baixa | 3 | US-056 — Ter favoritos salvos com o contexto da última preparação | RF97 | ⬜ |
| 50 | Alta | 5 | US-057 — Gerar lista de compras automática a partir do planejamento | RF98-100 | ⬜ |
| 51 | Média | 3 | US-058 — Adicionar ingredientes faltantes à lista de compras | RF101-102 | ⬜ |
| 52 | Média | 5 | US-059 — Consultar histórico de compras e padrões de consumo | RF103-104 | ⬜ |
| 53 | Média | 5 | US-060 — Visualizar custo estimado por porção | RF105-106 | ⬜ |
| 54 | Baixa | 5 | US-061 — Gerar lista de compras sazonal mensal | RF107 | ⬜ |
| 55 | Baixa | 5 | US-062 — Compartilhar receita via QR code | RF108 | ⬜ |
| 56 | Baixa | 5 | US-063 — Seguir usuários e receber novidades em feed | RF109-110 | ⬜ |
| 57 | Média | 8 | US-064 — Sincronizar dados entre dispositivos em tempo real | RF111-112 | ⬜ |
| 58 | Média | 5 | US-065 — Armazenar receitas na nuvem com backup automático | RF113-114 | ⬜ |
| 59 | Média | 5 | US-066 — Exportar e importar backup criptografado | RF115-116 | ⬜ |
| 60 | Baixa | 5 | US-067 — Consultar despensa e receitas por assistente virtual | RF117 | ⬜ |
| 61 | Média | 3 | US-069 — Consultar biblioteca de técnicas culinárias | RF119-120 | ⬜ |

---

<details>
<summary>US-003 — Ser alertado sobre ingredientes próximos da validade</summary>

**Critérios de Aceitação**
- [ ] O sistema deve notificar o usuário dentro da antecedência configurada para a validade do item.
- [ ] O sistema deve sugerir receitas priorizando o ingrediente alertado ao abrir a notificação.
- [ ] O sistema não deve gerar alertas duplicados no mesmo dia para o mesmo item.

</details>

<details>
<summary>US-004 — Receber sugestão de periodicidade de reposição de itens não perecíveis</summary>

**Critérios de Aceitação**
- [ ] O sistema deve calcular a periodicidade ideal de reposição com base no histórico de consumo.
- [ ] O sistema deve notificar via push quando um item provavelmente estiver no fim.
- [ ] O sistema não deve gerar alerta quando não houver histórico suficiente do item.

</details>

<details>
<summary>US-005 — Visualizar análise de desperdício de alimentos</summary>

**Critérios de Aceitação**
- [ ] O sistema deve calcular a estimativa de alimentos descartados no mês.
- [ ] O sistema deve sugerir estratégias de aproveitamento integral junto ao resultado.
- [ ] O sistema deve exibir estado vazio quando não houver dados suficientes de histórico.

</details>

<details>
<summary>US-009 — Importar receita a partir de link ou arquivo de texto</summary>

**Critérios de Aceitação**
- [ ] O sistema deve extrair dados estruturados a partir de um link válido de receita.
- [ ] O sistema deve extrair dados estruturados a partir de um arquivo de texto carregado.
- [ ] O sistema deve exibir erro claro e permitir nova tentativa quando a importação falhar.

</details>

<details>
<summary>US-015 — Buscar receitas por técnica culinária específica</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exibir explicação breve da técnica antes da lista de receitas relacionadas.
- [ ] O sistema deve listar apenas receitas associadas à técnica buscada.
- [ ] O sistema deve informar quando a técnica buscada não existir na biblioteca.

</details>

<details>
<summary>US-016 — Buscar receitas ou ingredientes por comando de voz</summary>

**Critérios de Aceitação**
- [ ] O sistema deve retornar, para um comando simples, os mesmos resultados de uma busca textual equivalente.
- [ ] O sistema deve interpretar intenções complexas por meio de modelo de linguagem leve local.
- [ ] O sistema deve pedir repetição quando o comando de voz não for compreendido.

</details>

<details>
<summary>US-017 — Receber sugestões de receitas sazonais por localização</summary>

**Critérios de Aceitação**
- [ ] O sistema deve sugerir receitas com ingredientes da estação atual na região do usuário.
- [ ] O sistema deve solicitar permissão de localização quando não concedida.
- [ ] O sistema deve usar a localização apenas mediante consentimento explícito.

</details>

<details>
<summary>US-018 — Filtrar receitas por equipamento disponível</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir cadastrar os equipamentos que o usuário possui.
- [ ] O sistema deve exibir apenas receitas viáveis com o equipamento cadastrado.
- [ ] O sistema deve recalcular o filtro ao atualizar a lista de equipamentos.

</details>

<details>
<summary>US-019 — Acessar modo de receitas rápidas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exibir apenas receitas com tempo total de preparo inferior a 15 minutos.
- [ ] O sistema deve priorizar receitas que usam itens da despensa e menos utensílios.
- [ ] O sistema deve exibir estado vazio quando não houver receita dentro do critério.

</details>

<details>
<summary>US-020 — Gerar planejamento semanal automático</summary>

**Critérios de Aceitação**
- [ ] O sistema deve gerar cardápio de 7 dias com almoço, jantar e lanches.
- [ ] O sistema deve equilibrar macronutrientes e variar tipos de cozinha ao longo da semana.
- [ ] O sistema deve indicar quais refeições não puderam ser preenchidas quando a despensa for insuficiente.

</details>

<details>
<summary>US-021 — Reorganizar o planejamento semanal</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir arrastar e trocar receitas entre dias do planejamento.
- [ ] O sistema deve recalcular a lista de compras automaticamente após qualquer alteração.
- [ ] O sistema deve sinalizar como vazio um dia sem receita atribuída.

</details>

<details>
<summary>US-022 — Planejar cardápio para ocasiões especiais</summary>

**Critérios de Aceitação**
- [ ] O sistema deve escalar automaticamente todas as receitas do menu para o número de convidados.
- [ ] O sistema deve gerar cronograma de preparação com dias de antecedência.
- [ ] O sistema deve recalcular tudo ao alterar o número de convidados.

</details>

<details>
<summary>US-023 — Planejar dieta com metas de calorias e macronutrientes</summary>

**Critérios de Aceitação**
- [ ] O sistema deve montar o plano usando exclusivamente receitas favoritas do usuário.
- [ ] O sistema deve sugerir ajustes de porção/substituição quando as metas não forem atingidas.
- [ ] O sistema deve informar limitação quando não houver favoritos suficientes para a semana.

</details>

<details>
<summary>US-025 — Visualizar cronograma otimizado de preparo</summary>

**Critérios de Aceitação**
- [ ] O sistema deve calcular tempo total considerando tarefas executáveis em paralelo entre receitas.
- [ ] O sistema deve exibir a ordem sugerida de execução das etapas de todas as receitas envolvidas.
- [ ] O sistema deve atualizar o cronograma conforme as etapas forem concluídas.

</details>

<details>
<summary>US-027 — Receber sugestão automática de acompanhamentos</summary>

**Critérios de Aceitação**
- [ ] O sistema deve sugerir acompanhamentos, entradas e sobremesas compatíveis ao exibir a receita principal.
- [ ] O sistema deve considerar sabor e tempo de preparo na harmonização.
- [ ] O sistema deve permitir adicionar a sugestão diretamente ao planejamento da mesma refeição.

</details>

<details>
<summary>US-030 — Ouvir receita em áudio com comandos de voz</summary>

**Critérios de Aceitação**
- [ ] O sistema deve reproduzir em áudio as instruções da etapa atual.
- [ ] O sistema deve permitir avançar/retroceder etapas por comando de voz.
- [ ] O sistema deve pausar o áudio automaticamente durante a contagem regressiva de um temporizador ativo.

</details>

<details>
<summary>US-031 — Visualizar dicas de segurança alimentar durante o preparo</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exibir lembrete de segurança relevante à etapa atual.
- [ ] O sistema deve registrar a confirmação de cumprimento no perfil de segurança do usuário.
- [ ] O sistema não deve exibir lembrete em etapas sem prática associada.

</details>

<details>
<summary>US-032 — Usar o modo "cozinha suja"</summary>

**Critérios de Aceitação**
- [ ] O sistema deve reorganizar a ordem das etapas para minimizar troca/lavagem de utensílios.
- [ ] O sistema não deve alterar o resultado final da receita ao reorganizar.
- [ ] O sistema deve restaurar a ordem original ao desativar o modo.

</details>

<details>
<summary>US-033 — Visualizar imagens ilustrativas geradas automaticamente para o preparo</summary>

**Critérios de Aceitação**
- [ ] O sistema deve gerar imagens ilustrativas por etapa quando a receita não tiver fotos originais.
- [ ] O sistema deve continuar funcional mesmo se a geração de imagem falhar.
- [ ] O sistema deve gerar as imagens a partir da descrição textual de cada etapa.

</details>

<details>
<summary>US-034 — Informar se as medidas indicadas estavam corretas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve perguntar, ao final do preparo, se as quantidades estavam corretas.
- [ ] O sistema deve permitir concluir o preparo mesmo sem responder à pergunta.
- [ ] O sistema deve usar o feedback para ajustar futuras conversões e escalas da receita.

</details>

<details>
<summary>US-036 — Ajustar receita para porção individual</summary>

**Critérios de Aceitação**
- [ ] O sistema deve ajustar automaticamente as quantidades para uma porção.
- [ ] O sistema deve manter o tempo mínimo de processos que não escalam para baixo (ex.: ferver água).
- [ ] O sistema deve recalcular os tempos de preparo para o lote reduzido.

</details>

<details>
<summary>US-037 — Adaptar receita para outro equipamento de cocção</summary>

**Critérios de Aceitação**
- [ ] O sistema deve ajustar tempos e temperaturas ao selecionar um equipamento alternativo.
- [ ] O sistema deve usar tabelas de conversão padronizadas por tipo de equipamento.
- [ ] O sistema deve informar quando a conversão não estiver disponível para a combinação escolhida.

</details>

<details>
<summary>US-040 — Gerar vídeo curto a partir da receita</summary>

**Critérios de Aceitação**
- [ ] O sistema deve gerar um vídeo curto com imagens, texto sobreposto e narração das etapas.
- [ ] O sistema deve permitir salvar localmente ou compartilhar o vídeo sem custo adicional.
- [ ] O sistema deve informar o erro sem afetar a receita original quando a geração falhar.

</details>

<details>
<summary>US-042 — Receber sugestão de substituição com base na despensa</summary>

**Critérios de Aceitação**
- [ ] O sistema deve priorizar substituições de ingredientes já disponíveis na despensa do usuário.
- [ ] O sistema deve priorizar substituições que mantenham sabor e textura originais.
- [ ] O sistema deve exibir um índice de confiança para cada substituição sugerida.

</details>

<details>
<summary>US-047 — Avaliar e comentar uma receita preparada</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir avaliar de uma a cinco estrelas, com comentários opcionais.
- [ ] O sistema deve exigir ao menos a nota em estrelas para registrar a avaliação.
- [ ] O sistema deve usar a avaliação para influenciar recomendações a usuários com perfil similar.

</details>

<details>
<summary>US-048 — Consultar histórico de receitas preparadas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve registrar cada receita concluída com data, avaliação, anotação e foto opcional.
- [ ] O sistema deve permitir filtrar o histórico por data ou avaliação.
- [ ] O sistema deve evitar recomendar novamente, em curto prazo, uma receita preparada recentemente.

</details>

<details>
<summary>US-049 — Adicionar anotações pessoais a uma receita</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir adicionar, editar e excluir anotações privadas em uma receita.
- [ ] O sistema deve exibir as anotações automaticamente ao reabrir a receita.
- [ ] O sistema não deve tornar essas anotações visíveis a outros usuários.

</details>

<details>
<summary>US-051 — Receber recomendações sociais de receitas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve recomendar receitas bem avaliadas por usuários com perfil semelhante (idade, região, restrições).
- [ ] O sistema deve processar o filtro colaborativo localmente no dispositivo.
- [ ] O sistema deve informar quando não houver usuários suficientes com perfil semelhante.

</details>

<details>
<summary>US-052 — Atribuir tags colaborativas a receitas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir atribuir tags a receitas de outros usuários, registrando cada atribuição como voto.
- [ ] O sistema deve validar a consistência da tag por votação ponderada pela reputação do usuário.
- [ ] O sistema não deve exibir publicamente tags com poucos votos ou baixa reputação.

</details>

<details>
<summary>US-053 — Organizar receitas em coleções/pastas temáticas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir que uma receita pertença a múltiplas coleções simultaneamente.
- [ ] O sistema deve gerar link temporário para compartilhar uma coleção completa.
- [ ] O sistema deve informar quando um link de coleção compartilhada tiver expirado.

</details>

<details>
<summary>US-055 — Alternar entre versões alternativas de uma receita</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir alternar entre versões de uma receita com um único toque.
- [ ] O sistema deve manter histórico de avaliação separado por versão.
- [ ] O sistema não deve alterar a versão original ao criar uma nova versão.

</details>

<details>
<summary>US-056 — Ter favoritos salvos com o contexto da última preparação</summary>

**Critérios de Aceitação**
- [ ] O sistema deve salvar a escala (porções) e as substituições usadas na última preparação de um favorito.
- [ ] O sistema deve exibir a receita já ajustada a esse contexto ao reabrir o favorito.
- [ ] O sistema deve salvar em estado padrão um favorito nunca preparado.

</details>

<details>
<summary>US-057 — Gerar lista de compras automática a partir do planejamento</summary>

**Critérios de Aceitação**
- [ ] O sistema deve gerar a lista subtraindo as quantidades já disponíveis na despensa.
- [ ] O sistema deve organizar os itens da lista por categoria.
- [ ] O sistema deve recalcular a lista automaticamente a cada alteração do planejamento.

</details>

<details>
<summary>US-058 — Adicionar ingredientes faltantes à lista de compras</summary>

**Critérios de Aceitação**
- [ ] O sistema deve destacar visualmente, na receita, o que já está na despensa e o que falta.
- [ ] O sistema deve adicionar todos os itens faltantes à lista em uma única ação.
- [ ] O sistema não deve sinalizar nenhum item faltante quando tudo já estiver na despensa.

</details>

<details>
<summary>US-059 — Consultar histórico de compras e padrões de consumo</summary>

**Critérios de Aceitação**
- [ ] O sistema deve registrar todos os itens adicionados à lista de compras ao longo do tempo.
- [ ] O sistema deve sugerir compra em maior quantidade para itens de alto uso.
- [ ] O sistema deve alertar sobre itens comprados mas nunca utilizados em nenhuma receita preparada.

</details>

<details>
<summary>US-060 — Visualizar custo estimado por porção</summary>

**Critérios de Aceitação**
- [ ] O sistema deve estimar o custo por porção com base em preços médios de uma API pública.
- [ ] O sistema deve permitir preços personalizados, com precedência sobre o preço médio.
- [ ] O sistema deve informar quando a estimativa estiver incompleta por falta de preço.

</details>

<details>
<summary>US-061 — Gerar lista de compras sazonal mensal</summary>

**Critérios de Aceitação**
- [ ] O sistema deve gerar mensalmente uma lista baseada nas receitas mais frequentes do usuário na época.
- [ ] O sistema deve considerar ingredientes em melhor preço/qualidade no momento.
- [ ] O sistema deve informar quando a sugestão for baseada em dados gerais por falta de histórico.

</details>

<details>
<summary>US-062 — Compartilhar receita via QR code</summary>

**Critérios de Aceitação**
- [ ] O sistema deve gerar localmente um QR code com os dados da receita em JSON compactado.
- [ ] O sistema deve permitir a leitura do QR code sem necessidade de conexão com a internet.
- [ ] O sistema deve informar falha e orientar novo código quando o QR estiver corrompido.

</details>

<details>
<summary>US-063 — Seguir usuários e receber novidades em feed</summary>

**Critérios de Aceitação**
- [ ] O sistema deve notificar quando um usuário seguido adicionar uma nova receita.
- [ ] O sistema deve exibir o feed agrupado por dia, em estilo timeline, com opção de curtir/comentar.
- [ ] O sistema deve exibir estado vazio com sugestão de seguir usuários quando não houver ninguém seguido.

</details>

<details>
<summary>US-064 — Sincronizar dados entre dispositivos em tempo real</summary>

**Critérios de Aceitação**
- [ ] O sistema deve propagar alterações de despensa, favoritos e planejamento em tempo real entre dispositivos.
- [ ] O sistema deve resolver conflitos de sincronização com base no timestamp mais recente.
- [ ] O sistema deve enviar atualizações pendentes a um dispositivo que estava temporariamente offline.

</details>

<details>
<summary>US-065 — Armazenar receitas na nuvem com backup automático</summary>

**Critérios de Aceitação**
- [ ] O sistema deve restringir leitura/escrita das receitas pessoais exclusivamente ao proprietário.
- [ ] O sistema deve realizar backup automático diário das receitas armazenadas.
- [ ] O sistema deve permitir restauração sob demanda a partir do último backup.

</details>

<details>
<summary>US-066 — Exportar e importar backup criptografado</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exportar receitas, despensa e histórico em arquivo protegido por AES-256.
- [ ] O sistema deve verificar a integridade do arquivo por hash antes de importar.
- [ ] O sistema deve bloquear a importação e informar o motivo quando a verificação falhar.

</details>

<details>
<summary>US-067 — Consultar despensa e receitas por assistente virtual</summary>

**Critérios de Aceitação**
- [ ] O sistema deve responder, via Google Assistant/Alexa, consultas sobre o conteúdo da despensa.
- [ ] O sistema deve fornecer sugestões de receita por comando de voz seguindo as mesmas regras da sugestão por despensa.
- [ ] O sistema deve recusar, sem expor dados de outro usuário, requisições sem autenticação válida.

</details>

<details>
<summary>US-069 — Consultar biblioteca de técnicas culinárias</summary>

**Critérios de Aceitação**
- [ ] O sistema deve exibir vídeo curto e descrição detalhada para cada técnica cadastrada.
- [ ] O sistema deve associar automaticamente a técnica a toda receita que a utiliza.
- [ ] O sistema deve permitir estudar a técnica antes de iniciar o modo de preparo de uma receita relacionada.

</details>

</details>

---

<details>
<summary><strong>Sprint 3 — Finalização e Entrega: Itens Residuais, Testes e Build</strong></summary>

<br>

> **Período:** [PREENCHER]
> **Foco:** implementar apenas as 8 User Stories pequenas e isoladas restantes; em seguida, interromper todo desenvolvimento de funcionalidade nova e concentrar o restante da sprint em regressão completa, correção de bugs, validação de todos os RF/RNF, build de produção e teste em dispositivo físico Android. Ver `sprints.md` para a Checklist Final de Entrega completa.

| RANK | PRIORIDADE | ESTIMATIVA | USER STORY | RF | STATUS |
|:----:|:----------:|:----------:|------------|:--:|:------:|
| 62 | Baixa | 3 | US-006 — Receber sugestões de receitas de aproveitamento de sobras | RF14 | ⬜ |
| 63 | Baixa | 5 | US-013 — Buscar receitas fotografando um prato pronto | RF28 | ⬜ |
| 64 | Baixa | 3 | US-024 — Integrar metas de IMC e peso ao planejamento alimentar | RF44 | ⬜ |
| 65 | Baixa | 3 | US-026 — Verificar compatibilidade entre receitas planejadas para a mesma refeição | RF46 | ⬜ |
| 66 | Baixa | 3 | US-043 — Reutilizar substituições feitas anteriormente | RF75-76 | ⬜ |
| 67 | Baixa | 5 | US-050 — Visualizar nível de dificuldade e caminho de progressão de receitas | RF88-89 | ⬜ |
| 68 | Baixa | 3 | US-054 — Comparar receitas lado a lado | RF95 | ⬜ |
| 69 | Baixa | 3 | US-068 — Cadastrar e consultar receitas de bebidas | RF118 | ⬜ |

---

<details>
<summary>US-006 — Receber sugestões de receitas de aproveitamento de sobras</summary>

**Critérios de Aceitação**
- [ ] O sistema deve sugerir receitas de aproveitamento com base no histórico recente de sobras.
- [ ] O sistema deve exibir estado vazio quando não houver sobras recentes registradas.
- [ ] O sistema deve priorizar o que sobrou mais recentemente na sugestão.

</details>

<details>
<summary>US-013 — Buscar receitas fotografando um prato pronto</summary>

**Critérios de Aceitação**
- [ ] O sistema deve sugerir receitas semelhantes a partir de uma foto de prato pronto.
- [ ] O sistema deve usar um banco de imagens de pratos catalogados para o reconhecimento.
- [ ] O sistema deve informar quando não houver confiança suficiente para identificar o prato.

</details>

<details>
<summary>US-024 — Integrar metas de IMC e peso ao planejamento alimentar</summary>

**Critérios de Aceitação**
- [ ] O sistema deve ajustar porções e frequência de receitas conforme progresso da meta de peso/IMC.
- [ ] O sistema deve recalcular as recomendações ao atualizar o peso atual do usuário.
- [ ] O sistema não deve aplicar esse ajuste quando não houver meta cadastrada.

</details>

<details>
<summary>US-026 — Verificar compatibilidade entre receitas planejadas para a mesma refeição</summary>

**Critérios de Aceitação**
- [ ] O sistema deve calcular um índice de compatibilidade considerando forno, utensílios e ordem de preparo.
- [ ] O sistema deve sugerir reorganização de horários quando houver conflito.
- [ ] O sistema deve confirmar ausência de conflito quando as receitas forem totalmente compatíveis.

</details>

<details>
<summary>US-043 — Reutilizar substituições feitas anteriormente</summary>

**Critérios de Aceitação**
- [ ] O sistema deve registrar todas as substituições feitas pelo usuário em diferentes receitas.
- [ ] O sistema deve sugerir automaticamente uma substituição já usada em situação similar.
- [ ] O sistema deve permitir consultar o histórico de substituições por receita.

</details>

<details>
<summary>US-050 — Visualizar nível de dificuldade e caminho de progressão de receitas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve classificar receitas em iniciante, intermediário ou avançado por métricas objetivas.
- [ ] O sistema deve sugerir receitas de nível superior após a conclusão de receitas do nível atual.
- [ ] O sistema não deve atribuir a classificação manualmente, apenas por cálculo.

</details>

<details>
<summary>US-054 — Comparar receitas lado a lado</summary>

**Critérios de Aceitação**
- [ ] O sistema deve permitir comparar de duas a três receitas em uma tabela comparativa.
- [ ] O sistema deve exibir ingredientes, tempo, dificuldade e valor nutricional na comparação.
- [ ] O sistema deve impedir a comparação com menos de duas ou mais de três receitas selecionadas.

</details>

<details>
<summary>US-068 — Cadastrar e consultar receitas de bebidas</summary>

**Critérios de Aceitação**
- [ ] O sistema deve oferecer campos específicos de teor alcoólico e proporção de açúcar para bebidas.
- [ ] O sistema deve permitir associar técnicas específicas (agitação, maceração) ao modo de preparo.
- [ ] O sistema deve permitir filtrar a busca especificamente por receitas de bebidas.

</details>

</details>
