# 02 — Supervisionado vs Não-Supervisionado

Esta é a distinção central do trabalho. Entender ela bem é o mais importante.

---

## A diferença em uma frase

> **Supervisionado:** você ensina com exemplos *com resposta certa.*
> **Não-supervisionado:** você joga os dados e pede para o algoritmo *descobrir a estrutura sozinho.*

---

## Analogia: aprender a separar frutas

### Supervisionado
Alguém te mostra cada fruta e diz o nome:
- "Isso é maçã" → você aprende o padrão de maçã
- "Isso é laranja" → você aprende o padrão de laranja
- Fruta nova chega → você classifica com base no que aprendeu

**Você aprendeu com respostas corretas.**

### Não-supervisionado
Alguém despeja uma caixa de frutas na mesa sem dizer nada.
Você olha e começa a agrupar: "essas aqui são parecidas... essas outras também..."
No final você tem 3 grupos, mas *você mesmo* decide o que cada grupo significa.

**O algoritmo descobriu os grupos. Você interpreta o que eles são.**

---

## Comparativo técnico

| | Supervisionado | Não-supervisionado |
|---|---|---|
| **Dados de treino** | Com rótulos (labels) | Sem rótulos |
| **O algoritmo sabe a resposta?** | Sim, durante o treino | Não |
| **O que aprende** | Uma função de entrada → saída | Estrutura/padrões ocultos nos dados |
| **Exemplos de algoritmos** | Árvore de Decisão, KNN, SVM | K-Means, DBSCAN, PCA |
| **Pergunta respondida** | "A que categoria pertence X?" | "Quais grupos existem nos dados?" |
| **Avaliação** | Acurácia, F1, precisão | Inércia, Silhouette Score |

---

## No nosso projeto

```
PROBLEMA REAL:
"Temos 300 clientes. Não sabemos quais perfis existem.
 Queremos classificar clientes novos no futuro."

SOLUÇÃO EM DOIS PASSOS:

Passo 1 — Não-supervisionado (K-Means):
  Entrada: dados dos 300 clientes SEM rótulo
  Saída:   3 grupos descobertos → VIP, Ocasional, Inativo
  
Passo 2 — Supervisionado (Árvore de Decisão):
  Entrada: os mesmos 300 clientes AGORA COM rótulo (gerado pelo K-Means)
  Saída:   modelo que classifica novos clientes sem rodar K-Means novamente
```

---

## Por que usar os dois juntos?

Porque cada um resolve uma parte diferente do problema:

- K-Means resolve: *"não sei o que buscar, deixa o algoritmo descobrir"*
- Árvore de Decisão resolve: *"já sei os perfis, quero um classificador rápido para produção"*

Usar apenas o K-Means funcionaria, mas você teria que rodar o modelo inteiro toda vez que um cliente novo aparecer. Com a Árvore treinada, a classificação é instantânea.

---

## Próximo passo

→ [03-modelo-rfm.md](03-modelo-rfm.md)
