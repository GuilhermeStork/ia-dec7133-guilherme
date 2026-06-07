# 05 — Árvore de Decisão: Como Funciona

## O objetivo

Dado um cliente com recência, frequência e gasto, **classificar em qual perfil ele se encaixa** (VIP, Ocasional ou Inativo).

---

## A intuição

Uma Árvore de Decisão imita o raciocínio humano: uma série de perguntas de sim/não até chegar a uma conclusão.

Exemplo manual:

```
O cliente gastou mais de R$200?
├── SIM → Comprou nos últimos 60 dias?
│         ├── SIM → VIP 🟢
│         └── NÃO → Ocasional 🔵
└── NÃO → Comprou nos últimos 60 dias?
          ├── SIM → Ocasional 🔵
          └── NÃO → Inativo 🔴
```

O algoritmo **descobre automaticamente** quais perguntas fazer e em qual ordem.

---

## Estrutura da árvore

```
                    [Nó Raiz]
                   monetario <= 150?
                  /               \
               SIM                NÃO
               /                    \
    [Nó Interno]               [Nó Interno]
    recencia <= 60?            frequencia <= 10?
      /      \                    /        \
   SIM        NÃO              SIM          NÃO
    |           |               |             |
[Folha]    [Folha]          [Folha]       [Folha]
 Inativo   Ocasional        Ocasional       VIP
```

- **Nó Raiz:** primeira pergunta (variável mais importante)
- **Nós Internos:** perguntas seguintes
- **Folhas:** decisão final (a classe prevista)

---

## Como o algoritmo escolhe qual pergunta fazer?

Ele testa todos os possíveis cortes em todas as variáveis e escolhe o que melhor **separa as classes**. A medida usada é chamada de **Gini Impurity** (impureza).

### Gini Impurity na prática

- Gini = 0 → nó puro (todos os clientes do nó são da mesma classe) ✓
- Gini = 0.5 → nó completamente misturado ✗

O algoritmo escolhe o corte que mais reduz a impureza.

**Exemplo:**
```
Corte: monetario <= 150

Antes do corte: [100 VIP, 100 Ocasional, 100 Inativo]  → Gini alto (misturado)

Após o corte:
  Lado esquerdo (<=150): [0 VIP, 30 Ocasional, 100 Inativo] → Gini menor
  Lado direito  (>150):  [100 VIP, 70 Ocasional, 0 Inativo] → Gini menor
```

---

## Treino vs Teste

| Etapa | O que acontece |
|-------|----------------|
| **Treino (75%)** | O algoritmo vê os dados com os rótulos e aprende as regras |
| **Teste (25%)** | Aplicamos o modelo em dados que ele nunca viu para medir a qualidade |

No nosso projeto: 225 clientes para treino, 75 para teste.

**Por que não usar 100% para treinar?**
Porque queremos saber se o modelo *generaliza* — se ele funciona em dados novos, não só nos que ele já viu. Se treinássemos e testássemos nos mesmos dados, o modelo poderia simplesmente "memorizar" as respostas (overfitting).

---

## max_depth=4: o que significa?

Limitamos a profundidade da árvore a 4 níveis. Sem esse limite, a árvore pode crescer indefinidamente e "decorar" os dados de treino — o que seria overfitting.

```
Profundidade 1:    1 pergunta
Profundidade 2:    até 3 perguntas
Profundidade 3:    até 7 perguntas
Profundidade 4:    até 15 perguntas  ← nosso limite
```

---

## Vantagens da Árvore de Decisão

| Vantagem | Por quê importa |
|----------|-----------------|
| **Interpretável** | Você pode ler e explicar cada decisão |
| **Não precisa de normalização** | Ao contrário do K-Means |
| **Rápida em produção** | Classificar um novo cliente é apenas percorrer a árvore |
| **Lida com múltiplas classes** | VIP, Ocasional, Inativo — sem problema |

---

## Próximo passo

→ [06-pre-processamento.md](06-pre-processamento.md)
