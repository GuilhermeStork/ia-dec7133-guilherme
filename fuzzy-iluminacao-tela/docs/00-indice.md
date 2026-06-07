# Material de Estudo — Lógica Fuzzy: Brilho de Tela

Leia na ordem sugerida abaixo.

---

## Documentos

| # | Arquivo | O que você aprende |
|---|---|---|
| 1 | [01-logica-fuzzy-conceitos.md](01-logica-fuzzy-conceitos.md) | O que é lógica fuzzy, conjuntos fuzzy, funções de pertinência triangular e trapezoidal |
| 2 | [02-inferencia-mamdani.md](02-inferencia-mamdani.md) | As 4 etapas do pipeline: fuzzificação → disparo → agregação → defuzzificação (centróide) |
| 3 | [03-leitura-do-codigo.md](03-leitura-do-codigo.md) | Cada célula do notebook explicada — o que cada linha de código faz e por quê |
| 4 | [04-base-de-regras-comentada.md](04-base-de-regras-comentada.md) | O raciocínio por trás de cada regra IF-THEN do sistema |

---

## Ordem de leitura sugerida

```
01 (conceitos) → 02 (inferência) → abrir o notebook → 03 (código) → 04 (regras)
```

Depois de ler 01 e 02, abra o notebook e execute célula por célula.
Use 03 e 04 como referência enquanto explora o código.

---

## Resumo do sistema em uma frase

> Um sistema Mamdani com 3 entradas (`luz_ambiente`, `hora_do_dia`, `atividade_usuario`)
> e 14 regras que infere o `brilho_tela` ideal usando centróide como defuzzificador —
> priorizando conforto visual para leitura e imersão para entretenimento.

---

## Glossário rápido

| Termo | Significado |
|---|---|
| Conjunto fuzzy | Conjunto onde pertinência é gradual, entre 0 e 1 |
| MF (Membership Function) | Função que mapeia um valor numérico para grau de pertinência |
| Fuzzificação | Converter número em graus de pertinência |
| Defuzzificação | Converter conjunto fuzzy de saída em número |
| Centróide (COG) | Método de defuzzificação: centro de gravidade da área do conjunto |
| t-norma mínimo | Implementação do AND fuzzy: min(μ_A, μ_B) |
| Mamdani | Tipo de sistema fuzzy onde a saída das regras é um conjunto fuzzy |
| Antecedente | Parte IF de uma regra |
| Consequente | Parte THEN de uma regra |
| Força de disparo | Grau com que uma regra se ativa para uma dada entrada |
| Agregação | União (máximo) dos conjuntos fuzzy de saída de todas as regras |
