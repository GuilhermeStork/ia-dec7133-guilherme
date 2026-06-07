# 04 — K-Means: Como Funciona

## O objetivo

Dado um conjunto de pontos (clientes), dividir em **K grupos** onde cada grupo reúne os pontos mais parecidos entre si.

No nosso caso: K=3 grupos (VIP, Ocasional, Inativo).

---

## O algoritmo passo a passo

### Passo 1 — Escolha K pontos aleatórios como "centróides"
Centróides são os centros provisórios de cada grupo.

```
Clientes no espaço:        Centróides iniciais (aleatórios):
    •  •  •                        ★ (centróide 1)
   •    •   •        →    •  •  •
  •  •    •                    ★ (centróide 2)
      •  •  •               •    •   •
                           •  •    ★ (centróide 3)
```

### Passo 2 — Atribua cada ponto ao centróide mais próximo
Calcula-se a distância de cada cliente para cada centróide.

```
Cada cliente vai para o grupo do centróide mais próximo:
    🟢  🟢  🟢
   🟢    🔵   🔵
  🟢  🟢    🔴
      🔴  🔴  🔴
```

### Passo 3 — Recalcule o centróide de cada grupo
O novo centróide é a *média* das posições de todos os pontos do grupo.

```
Centróides se movem para o centro real de cada grupo:
    🟢  🟢  🟢
   🟢   ★🟢  🔵   🔵
  🟢  🟢   ★🔵  🔴
      🔴  🔴 ★🔴 🔴
```

### Passo 4 — Repita os passos 2 e 3
Até que os centróides parem de se mover (convergência).

---

## Visualizando a convergência

```
Iteração 1:  grupos bagunçados, centróides longe do ideal
Iteração 2:  grupos melhoram, centróides se aproximam
Iteração 3:  grupos estáveis, centróides chegaram ao centro
Convergiu ✓
```

---

## O que é inércia?

**Inércia** = soma das distâncias de cada ponto ao seu centróide.

- Inércia **alta** → pontos espalhados, grupos mal definidos
- Inércia **baixa** → pontos concentrados, grupos bem definidos

Quanto mais K aumenta, menor a inércia (com K = número de clientes, inércia = 0). Por isso usamos o Método do Cotovelo.

---

## Método do Cotovelo (Elbow Method)

Testamos vários valores de K e plotamos a inércia:

```
Inércia
  |
  |  \
  |   \
  |    \___
  |        \____________________
  +--+--+--+--+--+--+--+--+--→ K
     1  2  3  4  5  6  7  8  9
              ↑
          "cotovelo" — K ideal
```

O "cotovelo" é onde a queda da inércia começa a desacelerar. Adicionar mais clusters além desse ponto traz ganho marginal. **No nosso projeto, o cotovelo está em K=3.**

---

## Por que o K-Means é não-supervisionado?

Porque em nenhum momento você informa ao algoritmo que existem "VIP", "Ocasional" ou "Inativo". Ele apenas vê números e agrupa os mais parecidos. **Os rótulos são interpretação humana feita depois.**

---

## Limitações do K-Means

| Limitação | Explicação |
|-----------|------------|
| Você precisa definir K | Não sabe quantos grupos existem? Precisa do Método do Cotovelo |
| Sensível à escala | Se uma variável vai de 1–10 e outra de 1–1000, a segunda domina o cálculo de distância. Por isso normalizamos. |
| Grupos esféricos | Funciona bem para grupos arredondados. Para formatos irregulares, DBSCAN seria melhor. |
| Resultado pode variar | Os centróides iniciais são aleatórios. Usamos `random_state=42` para fixar o resultado. |

---

## Próximo passo

→ [05-arvore-de-decisao.md](05-arvore-de-decisao.md)
