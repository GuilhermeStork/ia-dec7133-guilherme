# 06 — Pré-processamento: Por que Normalizamos os Dados?

## O problema da escala

Nossas três variáveis têm escalas muito diferentes:

| Variável | Mínimo | Máximo | Amplitude |
|----------|--------|--------|-----------|
| Recência | 1 dia | 365 dias | 364 |
| Frequência | 1 compra | 30 compras | 29 |
| Monetário | R$10 | R$800 | 790 |

Quando o K-Means calcula a distância entre dois clientes, ele usa algo parecido com o Teorema de Pitágoras:

```
distância = √( (R1-R2)² + (F1-F2)² + (M1-M2)² )
```

---

## O problema em números

Compare dois clientes:

```
Cliente A:  recencia=10,  frequencia=20,  monetario=500
Cliente B:  recencia=10,  frequencia=20,  monetario=510
```

Diferença no monetário: 10 reais.

```
Cliente C:  recencia=10,  frequencia=20,  monetario=500
Cliente D:  recencia=15,  frequencia=20,  monetario=500
```

Diferença na recência: 5 dias.

Sem normalização, a diferença de R$10 no monetário (0,7% da escala) pesa *menos* do que 5 dias na recência (1,4% da escala de 0–365). Mas intuitivamente, R$10 pode não ser significativo e 5 dias também pode não ser.

O K-Means sem normalização seria **dominado pela variável com maior amplitude** — no nosso caso, monetário (0–800).

---

## A solução: StandardScaler

O **StandardScaler** transforma cada variável para ter:
- Média = 0
- Desvio padrão = 1

A fórmula é simples:

```
valor_normalizado = (valor - média) / desvio_padrão
```

### Exemplo

```
monetário original:  [10, 80, 150, 300, 500, 800]
média = 306,  desvio_padrão = 274

após normalização:  [-1.08, -0.82, -0.57, -0.02, 0.71, 1.80]
```

Agora todas as variáveis têm a mesma "importância" para o cálculo de distância.

---

## Antes e depois da normalização (visualmente)

```
ANTES:
Recência:   |--1-------365--|     amplitude 364
Frequência: |1--30|              amplitude  29
Monetário:  |10----------800|    amplitude 790

DEPOIS (StandardScaler):
Recência:   |---0---|            média 0, desvio 1
Frequência: |---0---|            média 0, desvio 1
Monetário:  |---0---|            média 0, desvio 1
```

---

## Por que a Árvore de Decisão não precisa disso?

A Árvore de Decisão faz perguntas do tipo "monetário <= 150?". Ela compara valores dentro da mesma variável, não entre variáveis. Então a escala não interfere.

**Regra prática:**
- Algoritmos baseados em **distância** (K-Means, KNN, SVM): precisam de normalização
- Algoritmos baseados em **regras** (Árvore de Decisão, Random Forest): não precisam

---

## Próximo passo

→ [07-avaliacao.md](07-avaliacao.md)
