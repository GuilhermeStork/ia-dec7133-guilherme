# Simulador de Matchmaking CS2 com Algoritmo Genético

## Objetivo

Criar uma aplicação web interativa que demonstre um Algoritmo Genético real formando duas equipes equilibradas de CS2 (5x5), com foco educacional para uma disciplina de Inteligência Artificial.

## Stack

- React + TypeScript
- Tailwind CSS
- Recharts ou Chart.js
- Framer Motion
- Implementação própria do Algoritmo Genético

---

## Modelo dos Jogadores

Cada jogador possui:

- Nickname
- Elo (1000–3000)
- AWP (0–10)
- Entry (0–10)
- Support (0–10)
- IGL (0–10)
- Lurker (0–10)

Gerar automaticamente 50 jogadores fictícios.

---

## Problema

Selecionar 10 jogadores e dividi-los em:

- Team Alpha (5 jogadores)
- Team Bravo (5 jogadores)

Objetivo: maximizar o equilíbrio entre as equipes.

---

## Algoritmo Genético

### Cromossomo

Representa uma divisão possível dos jogadores entre os dois times.

Exemplo:

A A A B B A B A B B

### População Inicial

- 200 indivíduos aleatórios

### Seleção

- Tournament Selection

### Crossover

- Uniform Crossover
- Garantir restrição de 5 jogadores por equipe

### Mutação

- Troca de jogadores entre equipes
- Correção automática das restrições

### Elitismo

- Preservar os 5 melhores indivíduos por geração

---

## Função Fitness

Maximizar equilíbrio entre:

### Elo

Minimizar:

- Diferença total de Elo entre os times

### Papéis

Minimizar diferenças em:

- AWP
- Entry
- Support
- IGL
- Lurker

### Fórmula

Fitness = valor base - penalidades por desequilíbrios

Os atributos devem ser normalizados para evitar que o Elo domine o cálculo.

---

## Visualizações

### Evolução do Algoritmo

Mostrar em tempo real:

- Geração atual
- Melhor fitness
- Fitness médio
- Pior fitness

### Gráfico de Evolução

Linhas para:

- Melhor fitness
- Fitness médio

ao longo das gerações.

### Visualização dos Times

Exibir Team Alpha e Team Bravo lado a lado com:

- Nickname
- Elo
- AWP
- Entry
- Support
- IGL
- Lurker

### Comparação dos Perfis

Gráfico radar comparando:

- AWP
- Entry
- Support
- IGL
- Lurker

entre as equipes.

---

## Controles

Permitir ajustar:

- Tamanho da população
- Taxa de mutação
- Número máximo de gerações
- Velocidade da simulação

Botões:

- Iniciar
- Pausar
- Reiniciar

---

## Recursos Didáticos

Incluir explicações visuais sobre:

- Cromossomos
- Fitness
- Seleção
- Crossover
- Mutação

Destacar quais indivíduos foram escolhidos para reprodução em cada geração.

---

## Resultado Final

Ao concluir a evolução, exibir:

- Melhor solução encontrada
- Fitness final
- Diferença de Elo
- Diferença de cada papel
- Número de gerações executadas

A interface deve permitir observar claramente como as equipes evoluem e se tornam mais equilibradas ao longo das gerações.