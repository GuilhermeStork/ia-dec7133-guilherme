import re
import math
import string
import unicodedata

import nltk
nltk.download("stopwords", quiet=True)
nltk.download("rslp",      quiet=True)
nltk.download("punkt_tab", quiet=True)

from nltk.corpus import stopwords
from nltk.stem   import RSLPStemmer

# Trabalho feito para a disciplina de Inteligência Artificial, por Guilherme Pereira Teixeira e Sam Nascimento Yamaguchi.

# O programa recebe uma pergunta, uma resposta esperada e uma resposta do usuário.
# Ele pré-processa os textos, constrói vetores TF-IDF e usa similaridade do cosseno
# para calcular uma nota de 0 a 100, junto com um feedback qualitativo.

STOPWORDS_PT = set(
    unicodedata.normalize("NFD", w).encode("ascii", "ignore").decode("ascii")
    for w in stopwords.words("portuguese")
)
STEMMER      = RSLPStemmer()

# Limiares que definem as faixas de feedback.
LIMIAR_ENTENDEU  = 0.65
LIMIAR_PARCIAL   = 0.35



# ----- PRÉ-PROCESSAMENTO -----

# Remove pontuação, converte para minúsculas e tokeniza o texto.

def limpar_texto(texto):
    texto = texto.lower()
    texto = unicodedata.normalize("NFD", texto).encode("ascii", "ignore").decode("ascii")
    texto = re.sub(r"[^\w\s]", " ", texto)   # remove pontuação
    texto = re.sub(r"\d+", " ", texto)        # remove números isolados
    tokens = texto.split()
    return tokens


# Remove stopwords e aplica stemming (RSLP — algoritmo para o português).
# Stemming reduz palavras à sua raiz morfológica: "correndo" → "corr".

def preprocessar(texto):
    tokens = limpar_texto(texto)
    tokens = [t for t in tokens if t not in STOPWORDS_PT and len(t) > 1]
    tokens = [STEMMER.stem(t) for t in tokens]
    return tokens



# ----- TF-IDF MANUAL -----

# TF: frequência relativa de cada termo dentro de um único documento.
# TF(t, d) = ocorrências de t em d / total de termos em d

def calcular_tf(tokens):
    tf = {}
    total = len(tokens)
    if total == 0:
        return tf
    for token in tokens:
        tf[token] = tf.get(token, 0) + 1
    for token in tf:
        tf[token] /= total
    return tf


# IDF: penaliza termos que aparecem em muitos documentos (são pouco informativos).
# IDF(t) = log( (1 + N) / (1 + df(t)) ) + 1   — fórmula suavizada

def calcular_idf(lista_de_tokens):
    N   = len(lista_de_tokens)
    idf = {}
    vocabulario = set(t for tokens in lista_de_tokens for t in tokens)
    for termo in vocabulario:
        df = sum(1 for tokens in lista_de_tokens if termo in tokens)
        idf[termo] = math.log((1 + N) / (1 + df)) + 1
    return idf


# Multiplica TF por IDF para obter o vetor final de cada documento.

def calcular_tfidf(tokens, idf):
    tf  = calcular_tf(tokens)
    return {termo: tf[termo] * idf.get(termo, 1.0) for termo in tf}



# ----- SIMILARIDADE DO COSSENO -----

# Mede o ângulo entre dois vetores no espaço de termos.
# Cos(A, B) = (A · B) / (|A| × |B|)
# Resultado entre 0 (sem sobreposição) e 1 (vetores idênticos).

def similaridade_cosseno(vec_a, vec_b):
    termos_comuns = set(vec_a) & set(vec_b)
    if not termos_comuns:
        return 0.0

    produto_escalar = sum(vec_a[t] * vec_b[t] for t in termos_comuns)
    norma_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    norma_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))

    if norma_a == 0 or norma_b == 0:
        return 0.0

    return produto_escalar / (norma_a * norma_b)



# ----- AVALIAÇÃO -----

# Converte a similaridade (0.0–1.0) em nota (0–100) e feedback textual.

def avaliar(similaridade):
    nota = round(similaridade * 100, 1)

    if similaridade >= LIMIAR_ENTENDEU:
        feedback = "Entendeu"
        nivel    = "Excelente" if similaridade >= 0.85 else "Bom"
    elif similaridade >= LIMIAR_PARCIAL:
        feedback = "Parcial"
        nivel    = "Regular"
    else:
        feedback = "Não entendeu"
        nivel    = "Insuficiente"

    return nota, feedback, nivel



# ----- PIPELINE PRINCIPAL -----

# Recebe os três textos, executa todo o pipeline e retorna o diagnóstico completo.

def verificar_resposta(pergunta, esperada, usuario):
    tokens_esp = preprocessar(esperada)
    tokens_usr = preprocessar(usuario)

    # O IDF é calculado sobre ambas as respostas como corpus mínimo.
    idf = calcular_idf([tokens_esp, tokens_usr])

    vec_esp = calcular_tfidf(tokens_esp, idf)
    vec_usr = calcular_tfidf(tokens_usr, idf)

    sim          = similaridade_cosseno(vec_esp, vec_usr)
    nota, fb, nv = avaliar(sim)

    return {
        "pergunta"     : pergunta,
        "esperada"     : esperada,
        "usuario"      : usuario,
        "tokens_esp"   : tokens_esp,
        "tokens_usr"   : tokens_usr,
        "similaridade" : round(sim, 4),
        "nota"         : nota,
        "feedback"     : fb,
        "nivel"        : nv,
    }



# ----- EXIBIÇÃO -----

def imprimir_resultado(r, mostrar_tokens=True):
    linha = "=" * 50
    print(f"\n{linha}")
    print(f"  Pergunta : {r['pergunta']}")
    print(f"  Esperada : {r['esperada']}")
    print(f"  Usuário  : {r['usuario']}")
    print(linha)
    if mostrar_tokens:
        print(f"  Stems esperada : {r['tokens_esp']}")
        print(f"  Stems usuário  : {r['tokens_usr']}")
        print(linha)
    print(f"  Similaridade   : {r['similaridade']:.4f}  ({r['similaridade']*100:.1f}%)")
    print(f"  Nota           : {r['nota']} / 100")
    print(f"  Nível          : {r['nivel']}")
    print(f"  Feedback       : {r['feedback']}")
    print(linha)



# ----- CASOS DE TESTE -----

# Conjunto de cenários que cobrem situações esperadas e os limites do sistema.

CASOS_DE_TESTE = [
    {
        "descricao": "Caso 1 — Resposta correta com palavras diferentes (sinônimos)",
        "pergunta" : "O que é fotossíntese?",
        "esperada" : "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar.",
        "usuario"  : "É quando vegetais fabricam energia a partir da luminosidade do sol.",
    },
    {
        "descricao": "Caso 2 — Resposta correta com as mesmas palavras",
        "pergunta" : "O que é fotossíntese?",
        "esperada" : "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar.",
        "usuario"  : "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar.",
    },
    {
        "descricao": "Caso 3 — Resposta errada com palavras parecidas (falso positivo)",
        "pergunta" : "O que é fotossíntese?",
        "esperada" : "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar.",
        "usuario"  : "Fotossíntese é um processo que destrói plantas quando expostas à luz solar.",
    },
    {
        "descricao": "Caso 4 — Resposta completamente errada",
        "pergunta" : "O que é fotossíntese?",
        "esperada" : "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar.",
        "usuario"  : "É um tipo de rocha vulcânica encontrada no oceano.",
    },
    {
        "descricao": "Caso 5 — Resposta parcial (contém parte do conteúdo)",
        "pergunta" : "O que é fotossíntese?",
        "esperada" : "Fotossíntese é o processo pelo qual plantas produzem seu próprio alimento usando luz solar.",
        "usuario"  : "É um processo que envolve plantas e luz.",
    },
    {
        "descricao": "Caso 6 — FALHA ESPERADA: negação semântica não detectada",
        "pergunta" : "Qual é a capital do Brasil?",
        "esperada" : "A capital do Brasil é Brasília.",
        "usuario"  : "A capital do Brasil não é Brasília.",
    },
    {
        "descricao": "Caso 7 — FALHA ESPERADA: sinônimos semânticos sem raiz comum",
        "pergunta" : "Como chamamos a morte de muitas espécies ao mesmo tempo?",
        "esperada" : "Chamamos de extinção em massa.",
        "usuario"  : "É denominado aniquilamento coletivo de espécies.",
    },
]



# ----- MODO INTERATIVO -----

def modo_interativo():
    print("\n" + "=" * 50)
    print("  Sistema de Verificação de Respostas com PLN")
    print("=" * 50)
    print("  (deixe em branco para cancelar)\n")

    pergunta = input("  Pergunta         : ").strip()
    if not pergunta:
        return
    esperada = input("  Resposta esperada: ").strip()
    if not esperada:
        return
    usuario  = input("  Resposta do aluno: ").strip()
    if not usuario:
        return

    resultado = verificar_resposta(pergunta, esperada, usuario)
    imprimir_resultado(resultado)



# ----- EXECUÇÃO -----

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("  Sistema de Verificação de Respostas com PLN")
    print("  Executando casos de teste...")
    print("=" * 50)

    for caso in CASOS_DE_TESTE:
        print(f"\n  >> {caso['descricao']}")
        r = verificar_resposta(caso["pergunta"], caso["esperada"], caso["usuario"])
        imprimir_resultado(r, mostrar_tokens=False)

    print("\n" + "=" * 50)
    print("  Modo interativo — insira sua própria pergunta")
    print("=" * 50)
    modo_interativo()
