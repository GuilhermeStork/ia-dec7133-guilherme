# Sistema de Verificação de Respostas com PLN

> Trabalho desenvolvido para a disciplina de **Inteligência Artificial - Tecnologias da Informação e Comunicação**, UFSC Araranguá.  
> Produzido por **Guilherme Pereira Teixeira** e **Sam Yamaguchi**.

O programa compara a resposta de um aluno com um gabarito usando pré-processamento de texto, TF-IDF e similaridade do cosseno, gerando uma nota de 0 a 100.

---

## Sumário

- [Como executar](#como-executar)
- [Pipeline](#pipeline)
- [Critérios de nota](#critérios-de-nota)
- [Resultados dos casos de teste](#resultados-dos-casos-de-teste)
- [Análise do modelo](#o-sistema-realmente-entende-linguagem)
- [Limitações](#limitações-do-pln-relacionadas)
- [Possíveis melhorias](#possíveis-melhorias)

---

## Como executar

### Interface web (Streamlit)

Considere rodar o programa em um ambiente virtual Python!
```bash
pip install -r requirements.txt
streamlit run main.py
```

Abre no navegador com duas abas:

- **Modo Interativo** — insira pergunta, gabarito e resposta do aluno para obter nota e feedback.
- **Casos de Teste** — executa os 7 cenários pré-definidos e exibe os resultados expandíveis.

### Linha de comando

```bash
pip install -r requirements.txt
python3 logic.py
```

Roda os **7 casos de teste** automaticamente e abre um **modo interativo** para inserção de perguntas próprias.

---

## Pipeline

```
Texto bruto
   │
   ▼
Limpeza (minúsculas, normalização de acentos, remove pontuação e números)
   │
   ▼
Remoção de stopwords (NLTK — português)
   │
   ▼
Stemming RSLP (reduz palavras à raiz morfológica)
   │
   ▼
TF-IDF manual (TF por documento + IDF sobre o corpus)
   │
   ▼
Similaridade do cosseno (0.0 → 1.0)
   │
   ▼
Nota (0–100) + Nível + Feedback
```

> **Nota sobre acentuação:** o pipeline normaliza acentos via NFD antes de tokenizar, garantindo que variações como `fotossíntese` / `fotossintese` sejam tratadas como o mesmo termo.

---

## Critérios de nota

| Similaridade | Nota   | Nível        | Feedback     |
|:------------:|:------:|:------------:|:------------:|
| ≥ 0.85       | 85–100 | Excelente    | Entendeu     |
| 0.65–0.84    | 65–84  | Bom          | Entendeu     |
| 0.35–0.64    | 35–64  | Regular      | Parcial      |
| < 0.35       | 0–34   | Insuficiente | Não entendeu |

---

## Resultados dos casos de teste

> Os resultados abaixo são calculados **em tempo de execução** pela lógica do programa (`logic.py`). As notas exibidas aqui são de uma execução de referência. Ao rodar `python3 logic.py` ou a interface Streamlit, os valores são recalculados automaticamente.

---

### Caso 1 — Resposta correta com palavras diferentes (sinônimos)

| | Texto |
|---|---|
| **Esperada** | "processo pelo qual plantas produzem alimento usando luz solar" |
| **Usuário** | "vegetais fabricam energia a partir da luminosidade do sol" |
| **Resultado** | **7.4 / 100** — Não entendeu |

**Análise:** Falha total. "Plantas" e "vegetais" são sinônimos perfeitos, assim como "luz solar" e "luminosidade do sol". O sistema não detecta isso porque TF-IDF é um modelo de espaço vetorial baseado em termos: se dois termos não compartilham a mesma raiz após o stemming, o produto escalar entre eles é zero.

---

### Caso 2 — Resposta correta com as mesmas palavras

| | Texto |
|---|---|
| **Esperada** | "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar." |
| **Usuário** | "Fotossíntese é o processo pelo qual plantas produzem alimento usando luz solar." |
| **Resultado** | **89.6 / 100** — Excelente |

**Análise:** Funciona muito bem. Quando o vocabulário se sobrepõe, o cosseno captura bem a proximidade semântica léxica. A pequena diferença (remoção de "próprio") se reflete na nota sem prejudicar o feedback.

---

### Caso 3 — Resposta errada com palavras parecidas (falso positivo)

| | Texto |
|---|---|
| **Esperada** | "plantas produzem alimento usando luz solar" |
| **Usuário** | "processo que destrói plantas quando expostas à luz solar" |
| **Resultado** | **46.5 / 100** — Parcial |

**Análise:** O sistema considera a resposta parcialmente correta, mas ela está semanticamente **errada**: nega a essência da fotossíntese. Termos como "plantas", "processo", "luz", "solar" compartilhados inflacionam a nota. Esse é um **falso positivo clássico**: vocabulário similar, significado oposto.

---

### Caso 4 — Resposta completamente errada

| | Texto |
|---|---|
| **Esperada** | "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar." |
| **Usuário** | "É um tipo de rocha vulcânica encontrada no oceano." |
| **Resultado** | **0.0 / 100** — Não entendeu |

**Análise:** Funciona corretamente. Quando não há sobreposição de vocabulário relevante, a similaridade é zero.

---

### Caso 5 — Resposta parcial

| | Texto |
|---|---|
| **Esperada** | "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar." |
| **Usuário** | "É um processo que envolve plantas e luz." |
| **Resultado** | **34.9 / 100** — Não entendeu (limiar: 35.0) |

**Análise:** A resposta contém informação verdadeira, mas incompleta. O sistema captura a sobreposição parcial, ficando no limite do "Não entendeu". Um humano avaliaria como parcialmente correta. Isso demonstra a **sensibilidade ao limiar**: uma mudança de 0.1% mudaria o feedback.

---

### Caso 6 — FALHA: negação semântica não detectada ❌

| | Texto |
|---|---|
| **Esperada** | "A capital do Brasil é Brasília." |
| **Usuário** | "A capital do Brasil **não** é Brasília." |
| **Resultado** | **100.0 / 100** — Excelente ❌ |

**Análise:** Falha crítica. A negação "não" é uma stopword em português e é removida no pré-processamento. Após esse filtro, as duas frases se tornam idênticas. O sistema dá nota máxima para uma resposta **completamente errada**. Este é o limite mais grave do modelo.

---

### Caso 7 — FALHA: sinônimos sem raiz comum ❌

| | Texto |
|---|---|
| **Esperada** | "extinção em massa" |
| **Usuário** | "aniquilamento coletivo de espécies" |
| **Resultado** | **0.0 / 100** — Não entendeu ❌ |

**Análise:** Falha total. A resposta do usuário está correta, mas usa vocabulário completamente diferente. "Extinção" e "aniquilamento", "massa" e "coletivo" são pares semânticos que o stemming RSLP não consegue aproximar porque não compartilham raiz morfológica. Seria necessário um modelo de embeddings semânticos para resolver esse caso.

---

## O sistema realmente "entende" linguagem?

**Não.** O sistema opera exclusivamente no nível **léxico-estatístico**: ele mede a sobreposição entre conjuntos de termos ponderados por frequência, sem qualquer representação de significado.

A aparência de "entendimento" nos casos de sucesso (Caso 2) é resultado de uma coincidência favorável: quando duas frases expressam a mesma ideia com as mesmas palavras, o modelo funciona. Mas isso não é compreensão, é correspondência de padrões.

Um sistema que verdadeiramente "entende" precisaria de:

- **Representações vetoriais densas** (word2vec, GloVe, BERT) que capturam similaridade semântica entre palavras diferentes
- **Modelagem de negação, escopo e pressuposição** (linguística computacional)
- **Raciocínio sobre o conteúdo** (inferência lógica)

---

## Quando o sistema funciona bem?

- Respostas com **vocabulário muito próximo** ao gabarito
- Respostas longas, onde mais termos se sobrepõem
- Avaliação de **completude** (o aluno cobriu os pontos principais?)
- Contextos técnicos com **terminologia específica** (medicina, direito, engenharia) onde sinônimos são raros

## Quando o sistema falha?

| Situação | Exemplo | Problema |
|----------|---------|----------|
| Negação | "não é Brasília" | Stopword removida, muda o significado |
| Sinônimos sem raiz | "aniquilamento" ≈ "extinção" | Stemming não aproxima raízes diferentes |
| Paráfrase | "vegetais" ≈ "plantas" | Sem embedding semântico |
| Ironia / sarcasmo | "Que ótimo sistema..." | Sem modelagem pragmática |
| Resposta implícita | "A fotossíntese realiza o processo inverso da respiração" | Requer inferência |
| Respostas muito curtas | "Sim" / "Correto" | Vetores com poucos termos são instáveis |

---

## É confiável para corrigir provas?

**Não, sem supervisão humana.**

O sistema pode ser útil como **triagem preliminar**: identificar respostas claramente vazias ou claramente idênticas ao gabarito, mas não como substituto para avaliação humana. Os falsos positivos (Casos 3 e 6) mostram que ele pode atribuir nota alta a respostas erradas, o que seria prejudicial em contexto educacional real.

**Usos razoáveis:**
- Auxiliar professores a priorizar quais respostas revisar com mais atenção
- Feedback imediato em sistemas de estudo (não em avaliações formais)
- Comparação rápida em questões de múltipla escolha com justificativa

---

## Limitações do PLN relacionadas

### Ambiguidade
TF-IDF ignora o contexto: a palavra "banco" tem o mesmo vetor se significa instituição financeira ou assento. A ausência de desambiguação pode aproximar textos semanticamente opostos que compartilham termos polissêmicos.

### Semântica
O modelo é **sintático-estatístico**, não semântico. Ele não representa o *significado* das palavras, apenas sua distribuição estatística. Dois documentos podem ter alta similaridade de cosseno e tratar de assuntos completamente diferentes se compartilharem palavras funcionais comuns.

### Outras limitações
- **Escassez de dados:** IDF calculado sobre dois documentos é pouco confiável (corpus mínimo)
- **Sensibilidade à tokenização:** erros de digitação e neologismos não são tratados
- **Ausência de estrutura:** frases, cláusulas e relações entre palavras são descartadas; o texto vira um *bag of words*
- **Idioma:** o RSLP e as stopwords são específicos para o português; o sistema se degrada em outros idiomas sem adaptação

---

## Possíveis melhorias

1. **Embeddings semânticos** (sentence-transformers, OpenAI Embeddings) — resolvem os Casos 1 e 7
2. **Detecção de negação** — identificar tokens de negação antes de remover stopwords
3. **IDF sobre corpus maior** — usar um corpus de referência em vez de apenas dois documentos
4. **Normalização de respostas curtas** — tratar respostas com < 3 tokens como casos especiais
5. **Ensemble com modelo generativo** — usar um LLM para verificar consistência semântica como segunda camada
