# 04 — Base de Regras Comentada

Cada regra codifica uma decisão de especialista em conforto visual.
Este documento explica o **raciocínio por trás de cada grupo**.

---

## Grupo 1 — Ambiente Escuro (< ~250 lux)

Exemplos: quarto à noite com luz apagada, cinema, corredor com luz mínima.

```
R1: SE luz=escuro E atividade=leitura   → brilho=baixo       (~30%)
R2: SE luz=escuro E atividade=entret.   → brilho=muito_baixo (~15%)
R3: SE luz=escuro E atividade=neutro    → brilho=muito_baixo (~15%)
```

### Por que leitura não recebe `muito_baixo`?

Numa tela muito escura (< 20%), os olhos precisam de mais esforço para distinguir
texto de fundo — mesmo com o ambiente escuro. O brilho `baixo` (~30%) é um equilíbrio:
suficiente para conforto de leitura sem agredir os olhos adaptados ao escuro.

### Por que entretenimento recebe `muito_baixo`?

Vídeo e jogos têm contraste próprio no conteúdo. Brilho baixo aumenta a percepção
de contraste e profundidade — é o efeito "modo cinema". O olho não precisa resolver
texto; apenas absorve movimento e cor.

---

## Grupo 2 — Ambiente Moderado (~150–550 lux)

Exemplos: escritório com luz indireta, sala com cortinas semicerradas, café.

```
R4: SE luz=moderado E atividade=leitura E hora=dia         → brilho=medio    (~50%)
R5: SE luz=moderado E atividade=leitura E hora=noite       → brilho=baixo    (~30%)
R6: SE luz=moderado E atividade=leitura E hora=vesp/noturno→ brilho=baixo    (~30%)
R7: SE luz=moderado E atividade=entret.                    → brilho=baixo    (~30%)
R8: SE luz=moderado E atividade=neutro                     → brilho=medio    (~50%)
```

### Por que leitura com luz moderada muda conforme a hora?

- **Durante o dia (R4):** a luz ambiente é provavelmente natural (janela, sol indireto).
  Os olhos estão adaptados à luz — brilho médio é adequado para leitura.

- **À noite ou ao entardecer (R5, R6):** a mesma luminância de 300 lux vem de luz
  artificial (fluorescente, LED). O olho noturno é mais sensível; brilho médio
  pareceria intenso demais. Baixamos para ~30% por conforto.

Esse é o diferencial da variável `hora_do_dia` no sistema.

---

## Grupo 3 — Ambiente Claro (~450–800 lux)

Exemplos: escritório com luz direta, varanda coberta, sala com janelas abertas.

```
R9:  SE luz=claro E atividade=leitura E hora=dia         → brilho=alto   (~75%)
R10: SE luz=claro E atividade=leitura E hora=noite       → brilho=medio  (~50%)
R11: SE luz=claro E atividade=leitura E hora=vesp/noturno→ brilho=medio  (~50%)
R12: SE luz=claro E atividade=entret.                    → brilho=medio  (~50%)
R13: SE luz=claro E atividade=neutro                     → brilho=alto   (~75%)
```

### O "leve aumento" da leitura diurna (R9)

Este é o caso motivador central: `luz=claro + atividade=leitura + hora=dia → alto`.

Com 600 lux de luz natural, a luminância do ambiente compete com a tela.
Para manter o **contraste de Michelson** aceitável para leitura,
a tela precisa emitir mais luz — daí o brilho `alto` (~75%).

### Por que entretenimento recebe `medio` e não `alto` no mesmo ambiente?

Conteúdo de vídeo/jogo é auto-iluminado e tem contraste intrínseco.
Com brilho `medio` (~50%) num ambiente claro, o conteúdo ainda é visível.
`alto` seria desnecessário e aceleraria a fadiga ocular em sessões longas.

---

## Grupo 4 — Muito Claro (> ~700 lux)

Exemplos: luz solar direta, praia, campo aberto.

```
R14: SE luz=muito_claro → brilho=maximo (~95%)
```

### Por que não diferenciar atividade aqui?

Com > 700 lux, qualquer uso exige brilho máximo para que a tela seja legível.
Abaixo de 90-100%, a tela fica "lavada" pela luz ambiente.
A atividade torna-se irrelevante — a visibilidade física domina.

Esta é uma **regra dominante**: sua força de disparo será alta para qualquer
input com luz muito alta, sobrepondo as contribuições dos outros grupos.

---

## Conflitos e resolução

Em zonas de sobreposição das MFs (ex: luz=350 lux — moderado e claro ao mesmo tempo),
**múltiplas regras disparam simultaneamente** com forças diferentes.

O mecanismo de **agregação (máximo)** e depois **defuzzificação (centróide)**
resolve o conflito naturalmente: regras mais fortes (maior μ) pesam mais no resultado.

Exemplo para luz=400, hora=14, atividade=leitura:
```
R4 (moderado & leitura & dia → medio):  força ≈ 0.50 → puxa centróide para ~50%
R9 (claro    & leitura & dia → alto):   força ≈ 0.25 → puxa centróide para ~75%
Resultado agregado: centróide ≈ 58%  (entre meio e alto, mais próximo do médio)
```
