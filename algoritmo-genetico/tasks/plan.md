# Implementation Plan: CS2 Matchmaking com Algoritmo Genético

## Overview

Aplicação web educacional que demonstra um Algoritmo Genético real formando duas equipes equilibradas de CS2 (5×5). O usuário configura parâmetros, inicia a simulação e observa a evolução em tempo real através de gráficos, estatísticas e visualização dos times. Uma seção didática explica cada componente do AG.

## Architecture Decisions

- **Vite + React 18 + TypeScript** — scaffold padrão, HMR rápido para desenvolvimento
- **Tailwind CSS v3** — utilitários inline, sem CSS customizado salvo em casos especiais
- **Recharts** — LineChart para evolução + RadarChart para perfil dos times (API declarativa, boa integração com React)
- **Framer Motion** — animações de entrada/saída de componentes e transições de geração
- **Zustand** — estado global do AG (mais leve que Context + useReducer para updates frequentes durante a simulação)
- **AG rodando em Web Worker** — evita travar a UI durante gerações intensivas; comunica via `postMessage`
- **Sem bibliotecas de AG** — implementação própria conforme especificação

## Dependency Graph

```
[Task 1] Scaffold + Tipos
         │
         ├── [Task 2] AG Engine (pure functions, sem UI)
         │           │
         │           └── [Task 3] Web Worker + Zustand Store
         │                       │
         │                       ├── [Task 4] Player Pool + Controles
         │                       ├── [Task 5] Painel de Estatísticas ao Vivo
         │                       ├── [Task 6] Gráfico de Evolução (LineChart)
         │                       ├── [Task 7] Visualização dos Times + Radar
         │                       └── [Task 8] Resultados Finais
         │
         └── [Task 9] Seção Didática (independente do estado do AG)
                     │
                     └── [Task 10] Animações + Polish Final
```

---

## Phase 1: Foundation

### Task 1: Scaffold do projeto + definição de tipos

**Description:** Criar o projeto Vite, instalar todas as dependências e definir todos os tipos TypeScript que serão usados pelo AG e pela UI. Sem lógica, apenas estrutura.

**Acceptance criteria:**
- [ ] `npm run dev` sobe sem erros
- [ ] `npm run build` compila sem erros
- [ ] Tailwind funciona (classe `bg-gray-900` muda a cor de fundo)
- [ ] Arquivo `src/types/index.ts` exporta `Player`, `Chromosome`, `GAConfig`, `GAState`, `GenerationSnapshot`

**Verification:**
- [ ] Build: `npm run build` sem erros
- [ ] Manual: abrir `localhost:5173`, ver fundo dark com título "CS2 Matchmaking GA"

**Dependencies:** None

**Files likely touched:**
- `package.json`, `vite.config.ts`, `tsconfig.json`
- `tailwind.config.js`, `postcss.config.js`
- `src/main.tsx`, `src/App.tsx`
- `src/types/index.ts`

**Estimated scope:** Medium (5 files)

---

### Task 2: AG Engine — funções puras

**Description:** Implementar todo o núcleo do Algoritmo Genético como funções puras em TypeScript, sem qualquer dependência de React ou estado global. Inclui: geração de jogadores fictícios, criação de população inicial, função fitness, seleção por torneio, crossover uniforme (com restrição 5×5), mutação por troca e passo de elitismo.

**Acceptance criteria:**
- [ ] `generatePlayers(50)` retorna array de 50 `Player` com todos os campos dentro dos ranges especificados
- [ ] `initPopulation(players, config)` retorna array de `Chromosome[]` com tamanho `config.populationSize`, cada cromossomo com exatamente 5 `'A'` e 5 `'B'`
- [ ] `fitness(chromosome, players)` retorna número ≥ 0 onde cromossomos mais equilibrados têm valor maior
- [ ] `tournamentSelect(population, players, k)` retorna um `Chromosome`
- [ ] `uniformCrossover(p1, p2)` retorna filho com exatamente 5 `'A'` e 5 `'B'`
- [ ] `mutate(chromosome, rate)` retorna cromossomo com exatamente 5 `'A'` e 5 `'B'`
- [ ] `nextGeneration(population, players, config)` retorna nova população do mesmo tamanho com elitismo aplicado

**Verification:**
- [ ] Teste manual no console: rodar 100 gerações e verificar que fitness melhora ou estabiliza
- [ ] Inspeção: nenhum cromossomo na população tem ≠ 5 jogadores por time

**Dependencies:** Task 1

**Files likely touched:**
- `src/ga/players.ts`
- `src/ga/fitness.ts`
- `src/ga/operators.ts`
- `src/ga/engine.ts`

**Estimated scope:** Medium (4 files)

---

### Checkpoint: Phase 1

- [ ] Build limpo: `npm run build`
- [ ] AG Engine funciona isolado (testar via `console.log` em `main.tsx`)
- [ ] Revisar com humano antes de prosseguir

---

## Phase 2: Simulation Core

### Task 3: Web Worker + Zustand Store

**Description:** Mover o loop do AG para um Web Worker para não travar a UI. Criar a store Zustand com o estado completo da simulação (`status`, `generation`, `snapshots`, `bestChromosome`, `players`). A store expõe `start`, `pause`, `reset` e recebe mensagens do worker a cada geração.

**Acceptance criteria:**
- [ ] `useGAStore().start()` inicia o worker e começa a receber snapshots
- [ ] `useGAStore().pause()` pausa o worker sem perder o estado
- [ ] `useGAStore().reset()` volta ao estado inicial
- [ ] `snapshots` acumula um `GenerationSnapshot` por geração com `{ generation, best, avg, worst }`
- [ ] A UI não trava durante a simulação (scroll e cliques respondem normalmente)

**Verification:**
- [ ] Manual: adicionar `console.log` no App para ver `generation` incrementar em tempo real
- [ ] Manual: pausar e retomar sem perda de dados

**Dependencies:** Task 2

**Files likely touched:**
- `src/store/gaStore.ts`
- `src/workers/ga.worker.ts`

**Estimated scope:** Medium (2 files)

---

### Task 4: Player Pool + Painel de Controles

**Description:** Exibir a lista dos 50 jogadores gerados (tabela com nick, elo e atributos) e o painel de controles com sliders/inputs para `populationSize` (50–500), `mutationRate` (0.01–0.5), `maxGenerations` (50–1000), `speed` (delay entre gerações). Botões Iniciar / Pausar / Reiniciar.

**Acceptance criteria:**
- [ ] Tabela de jogadores renderiza 50 linhas com todos os campos
- [ ] Sliders atualizam a store ao mudar
- [ ] Botão Iniciar chama `store.start()`, fica desabilitado durante simulação
- [ ] Botão Pausar chama `store.pause()`, só ativo durante simulação
- [ ] Botão Reiniciar chama `store.reset()` e re-habilita Iniciar

**Verification:**
- [ ] Manual: ajustar sliders, iniciar, pausar, reiniciar; verificar estados dos botões

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/PlayerPool.tsx`
- `src/components/Controls.tsx`

**Estimated scope:** Medium (2 files)

---

### Checkpoint: Phase 2

- [ ] Simulação roda do início ao fim sem travar a UI
- [ ] Controles funcionam corretamente
- [ ] Revisar com humano antes de prosseguir

---

## Phase 3: Visualizações

### Task 5: Painel de estatísticas ao vivo

**Description:** Exibir em tempo real: geração atual, melhor fitness, fitness médio, pior fitness. Valores devem atualizar a cada geração recebida do worker.

**Acceptance criteria:**
- [ ] Quatro cards com os valores numéricos atualizando em tempo real
- [ ] Valores são formatados com 2 casas decimais
- [ ] Exibe "–" enquanto a simulação não iniciou

**Verification:**
- [ ] Manual: valores mudam a cada geração durante a simulação

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/StatsPanel.tsx`

**Estimated scope:** Small (1 file)

---

### Task 6: Gráfico de evolução (LineChart)

**Description:** Gráfico de linhas mostrando `best fitness` e `avg fitness` ao longo das gerações, atualizado em tempo real conforme os snapshots chegam.

**Acceptance criteria:**
- [ ] Duas linhas: "Melhor" (verde) e "Média" (azul)
- [ ] Eixo X: geração; Eixo Y: fitness
- [ ] Atualiza a cada nova geração sem flicker
- [ ] Legenda visível

**Verification:**
- [ ] Manual: executar até 100 gerações e verificar que as linhas evoluem para cima

**Dependencies:** Task 5

**Files likely touched:**
- `src/components/EvolutionChart.tsx`

**Estimated scope:** Small (1 file)

---

### Task 7: Visualização dos times + Gráfico Radar

**Description:** Exibir Team Alpha e Team Bravo lado a lado com a tabela de jogadores (nick, elo, atributos). Abaixo, um RadarChart comparando os perfis médios dos dois times nos 5 papéis (AWP, Entry, Support, IGL, Lurker). Atualiza com o melhor cromossomo de cada geração.

**Acceptance criteria:**
- [ ] Dois painéis lado a lado com 5 jogadores cada
- [ ] Destaque visual se a diferença de Elo entre times for < 100 (times equilibrados)
- [ ] RadarChart com dois polígonos sobrepostos (Alpha em azul, Bravo em laranja)
- [ ] Atualiza a cada geração

**Verification:**
- [ ] Manual: executar simulação e observar os times evoluírem para ficar mais equilibrados
- [ ] Manual: verificar que o radar fica mais simétrico com o avanço das gerações

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/TeamsDisplay.tsx`
- `src/components/RadarChart.tsx`

**Estimated scope:** Medium (2 files)

---

### Checkpoint: Phase 3

- [ ] Toda a simulação é observável visualmente
- [ ] Gráficos atualizam sem travar
- [ ] Revisar com humano antes de prosseguir

---

## Phase 4: Resultado Final + Seção Didática

### Task 8: Painel de resultados finais

**Description:** Quando a simulação termina (atingiu `maxGenerations` ou convergiu), exibir um painel destacado com: melhor solução encontrada, fitness final, diferença de Elo, diferença de cada papel, número de gerações executadas.

**Acceptance criteria:**
- [ ] Painel só aparece quando `status === 'done'`
- [ ] Exibe todas as métricas especificadas
- [ ] Botão "Nova Simulação" chama `store.reset()`
- [ ] Animação de entrada com Framer Motion

**Verification:**
- [ ] Manual: deixar simulação rodar até o fim e verificar o painel

**Dependencies:** Task 7

**Files likely touched:**
- `src/components/FinalResults.tsx`

**Estimated scope:** Small (1 file)

---

### Task 9: Seção didática

**Description:** Seção estática (independente do estado do AG) com cartões explicando: Cromossomo, Função Fitness, Seleção por Torneio, Crossover Uniforme e Mutação. Cada cartão inclui uma representação visual simples (ASCII/SVG inline) e texto explicativo.

**Acceptance criteria:**
- [ ] 5 cartões, um por conceito
- [ ] Cada cartão tem título, ícone/visual e parágrafo explicativo
- [ ] Layout responsivo (2 colunas em desktop, 1 em mobile)
- [ ] Destaque visual para o operador que foi executado na última geração (highlight dinâmico)

**Verification:**
- [ ] Manual: verificar que todos os cards são legíveis e o destaque dinâmico funciona

**Dependencies:** Task 1 (tipos), Task 3 (para highlight dinâmico)

**Files likely touched:**
- `src/components/EducationalSection.tsx`

**Estimated scope:** Medium (1 file, mas com conteúdo extenso)

---

### Task 10: Animações + Polish Final

**Description:** Adicionar animações Framer Motion nos componentes principais, refinar layout geral, garantir responsividade, revisar acessibilidade básica (contraste, labels). Adicionar tema dark com paleta CS2-inspired.

**Acceptance criteria:**
- [ ] Cards da seção didática animam na entrada com `fadeInUp`
- [ ] Troca de geração nos times tem transição suave
- [ ] Layout funciona em 1280px+ sem scroll horizontal
- [ ] Cores usam paleta consistente (cinza escuro, amarelo CS2, azul/laranja para times)

**Verification:**
- [ ] Manual: percorrer toda a aplicação verificando animações e layout

**Dependencies:** Tasks 8, 9

**Files likely touched:**
- `src/App.tsx`
- `src/index.css`
- Ajustes em componentes existentes

**Estimated scope:** Medium (3–5 files)

---

### Checkpoint Final

- [ ] `npm run build` sem erros ou warnings críticos
- [ ] Simulação completa funciona de ponta a ponta
- [ ] Seção didática legível e correta
- [ ] Animações não causam jank
- [ ] Revisão final com humano — pronto para apresentação

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Web Worker API pode não estar disponível no ambiente de testes | Médio | Fallback para `setTimeout` com chunking se necessário |
| Recharts RadarChart pode ter comportamento inesperado com dados dinâmicos | Baixo | Usar `key` prop para forçar remount se necessário |
| AG convergir muito rápido (fitness não evolui visivelmente) | Médio | Ajustar pesos da fitness para manter pressão seletiva mais longa |
| Performance: 200 indivíduos × muitas gerações pode ser lento mesmo no worker | Médio | Medir e se necessário reduzir população padrão ou usar WASM no futuro |

## Open Questions

- A seleção de 10 jogadores do pool de 50 é feita antes do AG (usuário seleciona manualmente) ou o AG também escolhe os 10? — **Assumindo: AG opera sobre um subconjunto aleatório de 10 jogadores sorteados do pool de 50 a cada nova simulação.**
- Deve haver persistência de resultados (localStorage)? — **Assumindo: não, apenas sessão atual.**
