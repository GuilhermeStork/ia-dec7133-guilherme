# 01 — O que é Machine Learning?

## A ideia central

Na programação tradicional, você escreve regras explícitas:

```
SE gasto > 500 E frequencia > 20 ENTÃO perfil = "VIP"
```

O problema: e se você não souber quais são as regras? E se os dados forem complexos demais para escrever à mão?

**Machine Learning (ML)** inverte isso: você dá os dados para o algoritmo e ele *descobre as regras sozinho*.

```
Programação tradicional:  Regras + Dados  →  Respostas
Machine Learning:         Dados + Respostas →  Regras
```

---

## Como a máquina "aprende"?

Imagine ensinar uma criança a reconhecer gatos:

1. Você mostra 1000 fotos dizendo "isso é gato" ou "isso não é gato"
2. A criança começa a notar padrões: orelhas pontudas, bigodes, olhos amendoados
3. Quando vê uma foto nova, ela aplica o que aprendeu

O ML faz o mesmo com números e estatística.

---

## Os três ingredientes do ML

| Ingrediente | O que é | No nosso projeto |
|-------------|---------|------------------|
| **Dados** | As informações de entrada | Recência, frequência, gasto dos clientes |
| **Algoritmo** | O método de aprendizado | K-Means, Árvore de Decisão |
| **Modelo** | O resultado treinado | O que classifica novos clientes |

---

## O que o modelo faz depois de treinado?

```
Novo cliente entra
       ↓
[Modelo treinado]
       ↓
"Esse cliente é VIP"
```

O modelo é como uma função matemática que mapeia entradas (dados do cliente) para saídas (perfil).

---

## Por que não usar IA generativa (ChatGPT) para isso?

Boa pergunta caso a banca pergunte. Modelos como ChatGPT são feitos para *gerar texto*. Para *classificar dados estruturados* (tabelas com números), algoritmos clássicos como K-Means e Árvore de Decisão são:

- Mais rápidos
- Mais simples de explicar
- Não precisam de GPU nem API
- Resultados completamente reproduzíveis

---

## Próximo passo

Agora que você sabe o que é ML, veja como ele se divide em tipos:
→ [02-supervisionado-vs-nao-supervisionado.md](02-supervisionado-vs-nao-supervisionado.md)
