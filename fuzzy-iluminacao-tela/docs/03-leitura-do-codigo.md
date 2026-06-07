# 03 — Leitura do Código: Notebook Célula a Célula

Este documento mapeia cada bloco do notebook `fuzzy_brilho_tela.ipynb`
para o conceito fuzzy correspondente.

---

## Célula: Imports

```python
import skfuzzy as fuzz
from skfuzzy import control as ctrl
```

- `skfuzzy` — operações sobre conjuntos fuzzy (MFs, operadores)
- `skfuzzy.control` — camada de alto nível: variáveis, regras, sistema, simulação

---

## Célula: Universos de discurso

```python
luz      = ctrl.Antecedent(np.arange(0, 1001, 1),  'luz_ambiente')
hora     = ctrl.Antecedent(np.arange(0, 25, 1),    'hora_do_dia')
atividade = ctrl.Antecedent(np.arange(0, 2.1, 0.1), 'atividade_usuario')
brilho   = ctrl.Consequent(np.arange(0, 101, 1),   'brilho_tela', defuzzify_method='centroid')
```

### O que é `Antecedent` / `Consequent`?

| Classe | Papel na regra | Análogo a |
|---|---|---|
| `Antecedent` | Variável de entrada (lado IF) | Premissa |
| `Consequent` | Variável de saída (lado THEN) | Conclusão |

`np.arange(0, 1001, 1)` cria o array [0, 1, 2, ..., 1000].
Este array é o **universo de discurso** — todos os valores possíveis
sobre os quais as MFs serão definidas.

`defuzzify_method='centroid'` especifica que a defuzzificação usa o centróide.

---

## Célula: Funções de pertinência

```python
luz['escuro'] = fuzz.trapmf(luz.universe, [0, 0, 100, 250])
```

### Como ler `trapmf([a, b, c, d])`

```
        b         c
        ┌─────────┐
       /│         │\
      / │         │ \
     /  │         │  \
────/   │         │   \────
   a                    d
```

Para `[0, 0, 100, 250]`:
- Sobe de 0 a 0 (já começa em 1)
- Platô de 0 a 100 (pertinência total)
- Desce de 100 a 250 (transição para moderado)

```python
luz['moderado'] = fuzz.trimf(luz.universe, [150, 350, 550])
```

### Como ler `trimf([a, b, c])`

```
         b
         /\
        /  \
       /    \
──────/      \──────
      a        c
```

Para `[150, 350, 550]`:
- Sobe de 150 até 350 (pico em 350)
- Desce de 350 até 550

---

## Célula: Variável `atividade_usuario`

```python
atividade['entretenimento'] = fuzz.trapmf(atividade.universe, [0.0, 0.0, 0.3, 0.8])
atividade['neutro']         = fuzz.trimf( atividade.universe, [0.5, 1.0, 1.5])
atividade['leitura']        = fuzz.trapmf(atividade.universe, [1.2, 1.7, 2.0, 2.0])
```

O universo [0, 2] é uma **codificação numérica** de uma variável categórica:

```
0.0 ─── entretenimento ─── neutro ─── leitura ─── 2.0
```

Não existe "0.5 de atividade" no mundo real — essa codificação é uma simplificação
para que o skfuzzy consiga calcular pertinências contínuas.
Em produção, a entrada seria categórica e convertida para 0, 1 ou 2.

---

## Célula: Regras

```python
r1 = ctrl.Rule(luz['escuro'] & atividade['leitura'], brilho['baixo'])
```

### Anatomia de uma regra Mamdani

```
ctrl.Rule( ANTECEDENTE , CONSEQUENTE )
            ↑                ↑
         IF parte          THEN parte
```

O operador `&` implementa o **AND fuzzy (t-norma mínimo)**.

```python
r4 = ctrl.Rule(luz['moderado'] & atividade['leitura'] & hora['dia'], brilho['medio'])
```

Três antecedentes combinados com AND:
```
Força = min(μ_moderado(luz), μ_leitura(atv), μ_dia(hora))
```

---

## Célula: Sistema e simulação

```python
sistema_brilho = ctrl.ControlSystem(todas_as_regras)
sim = ctrl.ControlSystemSimulation(sistema_brilho)
```

`ControlSystem` — compila as regras e verifica consistência.  
`ControlSystemSimulation` — instância que aceita entradas e computa saídas.

```python
sim.input['luz_ambiente']      = 200
sim.input['hora_do_dia']       = 23
sim.input['atividade_usuario'] = 2.0
sim.compute()
print(sim.output['brilho_tela'])
```

`.compute()` executa as 4 etapas de inferência (fuzzificação → disparo → agregação → defuzzificação).
O resultado em `sim.output` é o valor defuzzificado — um número em [0, 100].

---

## Célula: Superfície de controle

```python
for i, lv in enumerate(lux_grid):
    for j, av in enumerate(atv_grid):
        Z_la[j, i] = inferir_brilho(lv, 14, av)
```

Para cada combinação (luz, atividade) com hora fixa em 14h, rodamos a inferência
e armazenamos o resultado em uma matriz 2D.

`contourf` plota essa matriz como um mapa de calor com curvas de nível —
equivalente a uma "vista de cima" da superfície de resposta 3D do sistema.

A superfície de controle é a melhor forma de **verificar visualmente**
se a base de regras produz comportamento coerente: se a superfície for
suave e sem descontinuidades bizarras, o sistema está bem definido.

---

## Perguntas para reflexão

1. O que aconteceria se não houvesse sobreposição entre as MFs de `luz_ambiente`?
2. Por que a regra R14 (`muito_claro → maximo`) não precisa de `hora` ou `atividade`?
3. Como a força de disparo de R1 e R5 se combinam quando luz=200 e hora=23?
4. O que muda na superfície de controle se você trocar `defuzzify_method` para `'mom'`?
