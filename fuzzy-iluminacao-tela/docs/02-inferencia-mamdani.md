# 02 — Inferência Mamdani: Do IF-THEN ao Valor Numérico

## O pipeline de inferência fuzzy

Um sistema fuzzy transforma entradas numéricas em saídas numéricas em **4 etapas**:

```
Entrada numérica
      ↓
 1. Fuzzificação
      ↓
 2. Avaliação das regras
      ↓
 3. Agregação
      ↓
 4. Defuzzificação
      ↓
Saída numérica
```

---

## Etapa 1 — Fuzzificação

Converter cada entrada numérica em graus de pertinência para os conjuntos fuzzy.

**Exemplo:** `luz_ambiente = 200 lux`

```python
μ_escuro(200)      = fuzz.trapmf([0, 0, 100, 250], 200) = 0.33
μ_moderado(200)    = fuzz.trimf([150, 350, 550], 200)   = 0.25
μ_claro(200)       = fuzz.trimf([450, 650, 800], 200)   = 0.00
μ_muito_claro(200) = fuzz.trapmf([700, 850, 1000, 1000], 200) = 0.00
```

Isso nos diz: "200 lux é 33% escuro e 25% moderado".

---

## Etapa 2 — Avaliação das regras (Disparo)

Cada regra IF-THEN é avaliada. O método Mamdani usa **t-norma mínimo** para o AND:

```
Regra R1: SE luz=escuro AND atividade=leitura → brilho=baixo

Força de disparo = min(μ_escuro(luz), μ_leitura(atividade))
                 = min(0.33, μ_leitura(2.0))
                 = min(0.33, 1.00)
                 = 0.33
```

Interpretação: "Esta regra se aplica com força 0.33."

### Por que mínimo para AND?

O mínimo é a t-norma mais conservadora:
- "A regra A AND B" → tão forte quanto o elo mais fraco.
- Alternativa comum: produto algébrico (A × B), mas mínimo é mais simples e intuitivo.

---

## Etapa 3 — Agregação

Cada regra disparada produz um **conjunto fuzzy de saída** cortado (clipped)
na sua força de disparo. Todos esses conjuntos são **unidos** (OR fuzzy = máximo).

```
Resultado da R1 (força=0.33):
  MF de 'baixo' clipada em μ ≤ 0.33

Resultado da R4 (força=0.25):
  MF de 'medio' clipada em μ ≤ 0.25

Agregação = max(clip_R1, clip_R4, ...)
```

O resultado é um único conjunto fuzzy composto, representando a "opinião coletiva"
de todas as regras sobre qual deve ser o brilho.

---

## Etapa 4 — Defuzzificação (Centróide)

O conjunto fuzzy agregado precisa ser convertido num **único número**.

### Método do Centróide (COG — Center of Gravity)

```
         ∫ x · μ(x) dx
brilho = ──────────────
            ∫ μ(x) dx
```

É a "média ponderada" do conjunto fuzzy, onde cada ponto x é ponderado
por sua pertinência μ(x).

**Propriedades:**
- Suave e contínuo (sem saltos)
- Sensível a toda a forma do conjunto agregado
- O método mais comum em controle fuzzy

**Alternativas não usadas aqui:**
- **MOM** (Mean of Maximum): média dos pontos de máximo — mais rápido, menos suave
- **COA** (Center of Area): variante do centróide
- **Bisector**: divide a área em duas metades iguais

---

## Por que Mamdani e não Takagi-Sugeno?

| Aspecto | Mamdani | Takagi-Sugeno (TSK) |
|---|---|---|
| Saída das regras | Conjunto fuzzy | Função linear das entradas |
| Defuzzificação | Necessária (centróide etc.) | Média ponderada simples |
| Interpretabilidade | Alta — a saída fuzzy é legível | Menor |
| Custo computacional | Maior | Menor |
| Adequado para | Sistemas baseados em especialistas | Controle de alta precisão |

Para fins **acadêmicos e de interpretabilidade**, Mamdani é a escolha natural:
você consegue visualizar o conjunto fuzzy de saída antes de defuzzificar
e entender intuitivamente o resultado de cada regra.

---

## Fluxo completo no nosso sistema

```
Entradas: luz=200lux, hora=23h, atividade=2.0 (leitura)

Fuzzificação:
  luz:       escuro=0.33, moderado=0.25
  hora:      noite=1.00, dia=0.00, vespertino=0.00
  atividade: leitura=1.00

Avaliação:
  R1 (escuro & leitura → baixo):          min(0.33, 1.00) = 0.33  → clip 'baixo' em 0.33
  R5 (moderado & leitura & noite → baixo): min(0.25, 1.00, 1.00) = 0.25 → clip 'baixo' em 0.25

Agregação: max das duas saídas clipadas (ambas 'baixo', maior ganha = 0.33)

Defuzzificação (centróide): ≈ 30%
```
