# 03 — O Modelo RFM

## O que é RFM?

RFM é um modelo clássico de marketing para avaliar o comportamento de clientes. A sigla vem de três métricas:

| Letra | Nome | Pergunta | No nosso projeto |
|-------|------|----------|-----------------|
| **R** | Recência | Há quantos dias o cliente comprou pela última vez? | `recencia` (dias) |
| **F** | Frequência | Quantas vezes comprou no último ano? | `frequencia` (compras/ano) |
| **M** | Monetário | Quanto gasta em média por compra? | `monetario` (R$) |

---

## Por que RFM funciona?

Porque captura os três comportamentos mais preditivos de um cliente:

- Um cliente que comprou **recentemente** → ainda está engajado
- Um cliente que compra com **frequência** → é fiel
- Um cliente que **gasta muito** → tem alto valor para o negócio

Juntos, esses três números descrevem bem o perfil de qualquer cliente de e-commerce, varejo, assinatura etc.

---

## Os três perfis do nosso projeto

### 🟢 VIP
```
Recência:   1–30 dias       (comprou há pouco tempo)
Frequência: 15–30 compras   (compra muito)
Monetário:  R$300–R$800     (gasta bastante)
```
> Cliente ideal. Alta fidelidade, alto valor.

### 🔵 Ocasional
```
Recência:   30–120 dias     (comprou há algum tempo)
Frequência: 4–14 compras    (compra às vezes)
Monetário:  R$80–R$300      (gasto moderado)
```
> Cliente médio. Vale a pena engajar com promoções.

### 🔴 Inativo
```
Recência:   120–365 dias    (não compra há muito tempo)
Frequência: 1–4 compras     (raramente compra)
Monetário:  R$10–R$80       (gasto muito baixo)
```
> Cliente perdido ou de baixo valor. Pode valer uma campanha de reativação.

---

## Por que esses dados são simulados?

No projeto usamos dados gerados artificialmente com `numpy`. Isso é prática comum em estudos acadêmicos quando não se tem acesso a dados reais. O importante é que os dados simulam padrões realistas — os três perfis têm características bem distintas, o que permite que o K-Means os encontre com facilidade.

---

## Próximo passo

→ [04-kmeans.md](04-kmeans.md)
