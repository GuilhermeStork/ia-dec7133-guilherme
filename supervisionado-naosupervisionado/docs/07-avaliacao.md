# 07 — Como Avaliamos os Modelos?

Cada tipo de algoritmo tem suas próprias métricas de avaliação.

---

## Avaliando o K-Means (Não-supervisionado)

Como não há rótulos certos ou errados, avaliamos a *qualidade dos grupos*.

### Inércia

Soma das distâncias de cada ponto ao centróide do seu cluster.

```
Inércia baixa = pontos concentrados perto do centro = grupos coesos ✓
Inércia alta  = pontos espalhados                   = grupos ruins  ✗
```

Usamos a inércia no **Método do Cotovelo** para escolher K.

### Interpretação humana dos clusters

Depois de rodar o K-Means, calculamos a média de cada variável por cluster:

```
Cluster | Recência | Frequência | Monetário  | Nome dado
--------|----------|------------|------------|----------
   0    |  15 dias |  22 comp.  |  R$550     | VIP
   1    |  75 dias |   9 comp.  |  R$190     | Ocasional
   2    | 240 dias |   2 comp.  |   R$45     | Inativo
```

Os nomes (VIP, Ocasional, Inativo) **não vêm do algoritmo** — são interpretação nossa com base nos padrões observados.

---

## Avaliando a Árvore de Decisão (Supervisionado)

Aqui temos rótulos, então podemos medir acertos e erros diretamente.

### Acurácia

```
Acurácia = Número de acertos / Total de previsões
```

No nosso projeto: **100%** de acurácia.

Isso significa que nos 75 clientes do conjunto de teste, a árvore não errou nenhum. É um resultado alto porque os três perfis são bem distintos nos dados simulados.

> ⚠️ Em dados reais, 100% seria suspeito (provável overfitting). Com dados simulados e bem separados, é esperado.

### Matriz de Confusão

Mostra *onde* o modelo acerta e erra, classe por classe.

```
                 Previsto
                 Inativo  Ocasional  VIP
Real  Inativo  [   25         0       0  ]
      Ocasional [   0        25       0  ]
      VIP       [   0         0      25  ]
```

- **Diagonal principal** (25, 25, 25): acertos
- **Fora da diagonal**: erros (no nosso caso, nenhum)

#### Como ler uma matriz de confusão com erros (para entender o conceito)

```
                 Previsto
                 Inativo  Ocasional  VIP
Real  Inativo  [   23         2       0  ]   ← 2 Inativos classificados como Ocasional
      Ocasional [   1        22       2  ]   ← 3 erros no total
      VIP       [   0         1      24  ]
```

- Linha = o que realmente é
- Coluna = o que o modelo disse que era

---

## Importância das Variáveis

A Árvore de Decisão também nos diz quais variáveis foram mais úteis para classificar:

```
Importância:
  monetario   ████████████████████  0.65   ← mais importante
  recencia    ████████              0.25
  frequencia  ███                   0.10
```

Isso faz sentido: o quanto um cliente gasta é o fator mais discriminante entre os três perfis.

---

## Resumo das métricas

| Algoritmo | Métrica | O que mede |
|-----------|---------|------------|
| K-Means | Inércia | Coesão dos grupos |
| K-Means | Método do Cotovelo | Número ideal de clusters |
| Árvore | Acurácia | % de previsões corretas |
| Árvore | Matriz de Confusão | Acertos e erros por classe |
| Árvore | Importância de variáveis | Quais features mais ajudam |

---

## Próximo passo

→ [08-perguntas-e-respostas.md](08-perguntas-e-respostas.md)
