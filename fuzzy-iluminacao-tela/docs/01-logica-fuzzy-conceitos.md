# 01 — Lógica Fuzzy: Conceitos Fundamentais

## Por que lógica fuzzy existe?

A lógica clássica é **binária**: uma proposição é verdadeira (1) ou falsa (0).  
Isso funciona bem para computadores, mas mal descreve o raciocínio humano.

> "Está quente lá fora?" — depende. 25°C é quente? E 28°C? E 29,99°C?

A lógica fuzzy, proposta por **Lotfi Zadeh em 1965**, generaliza o conceito de pertinência:  
um elemento pode **pertencer parcialmente** a um conjunto, com grau entre 0 e 1.

---

## Conjuntos clássicos vs. conjuntos fuzzy

### Clássico (crisp)
```
Conjunto "quente" = {temperaturas > 30°C}
Pertinência de 29°C = 0  (não pertence)
Pertinência de 31°C = 1  (pertence)
```

### Fuzzy
```
Conjunto fuzzy "quente"
Pertinência de 25°C = 0.2  (levemente quente)
Pertinência de 30°C = 0.7  (bastante quente)
Pertinência de 35°C = 1.0  (totalmente quente)
```

---

## Função de pertinência (Membership Function — MF)

A **função de pertinência** μ(x) define como cada valor x do universo de discurso
se mapeia para um grau em [0, 1].

### Tipos usados no nosso projeto

#### Triangular — `trimf(x, [a, b, c])`
```
μ(x) = 0         se x ≤ a
μ(x) = (x-a)/(b-a)  se a < x ≤ b
μ(x) = (c-x)/(c-b)  se b < x ≤ c
μ(x) = 0         se x > c
```
Pico em `b`, zero em `a` e `c`. Usada para conjuntos do "meio" (ex: `moderado`, `médio`).

#### Trapezoidal — `trapmf(x, [a, b, c, d])`
```
μ(x) = 0            se x ≤ a
μ(x) = (x-a)/(b-a)  se a < x ≤ b
μ(x) = 1            se b < x ≤ c   ← "platô"
μ(x) = (d-x)/(d-c)  se c < x ≤ d
μ(x) = 0            se x > d
```
Tem uma faixa de pertinência total (platô). Usada para extremos (ex: `escuro`, `máximo`).

### Por que trapézio nas bordas?
Para `muito_claro`, qualquer valor acima de 850 lux **já é totalmente** muito claro.
Não faz sentido o grau cair depois de 1000 — então a MF permanece em 1 até o fim do universo.

---

## Variável linguística

Uma **variável linguística** tem:
- um **nome** (ex: `luz_ambiente`)
- um **universo de discurso** (ex: [0, 1000])
- um conjunto de **termos linguísticos** (ex: {escuro, moderado, claro, muito_claro})
- cada termo tem sua própria **função de pertinência**

No nosso sistema:
```
luz_ambiente = {escuro, moderado, claro, muito_claro}
hora_do_dia  = {noite, dia, vespertino_noturno}
atividade    = {entretenimento, neutro, leitura}
brilho_tela  = {muito_baixo, baixo, medio, alto, maximo}
```

---

## Sobreposição entre conjuntos

As MFs se sobrepõem intencionalmente.  
Um valor de 200 lux pode pertencer *parcialmente* a `escuro` e *parcialmente* a `moderado` ao mesmo tempo.

Isso é o coração da lógica fuzzy: **não há fronteira rígida**.

```
luz = 200 lux:
  μ_escuro(200)   = 0.33  (ainda um pouco escuro)
  μ_moderado(200) = 0.25  (começando a ser moderado)
  μ_claro(200)    = 0.00  (definitivamente não é claro)
```

---

## Referências

- Zadeh, L.A. (1965). *Fuzzy sets*. Information and Control, 8(3), 338–353.
- Ross, T.J. (2010). *Fuzzy Logic with Engineering Applications*. 3ª ed. Wiley.
- Mendel, J.M. (2017). *Uncertain Rule-Based Fuzzy Systems*. Springer.
