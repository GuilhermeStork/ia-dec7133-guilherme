import os
import streamlit as st
from groq import Groq
from dotenv import load_dotenv

# Trabalho feito para a disciplina de Inteligência Artificial, por Guilherme Pereira Teixeira e Sam Nascimento Yamaguchi.

# Chatbot educacional com interface Streamlit e integração com a API da Groq (modelo LLaMA 3.3).
# Suporta quatro disciplinas e dois modos: conversa livre e quiz interativo.

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ----- CONFIGURAÇÃO DAS DISCIPLINAS -----

# Cada disciplina tem um ícone, uma cor de destaque e um system prompt
# que instrui o modelo sobre tom, escopo e estilo de resposta.

DISCIPLINAS = {
    "📖 Língua Portuguesa": {
        "cor":   "#2ecc71",
        "model": "llama-3.3-70b-versatile",
        "system_chat": (
            "Você é um professor de Língua Portuguesa do ensino médio, paciente e didático. "
            "Responda sempre em português do Brasil. "
            "Seus tópicos: gramática, ortografia, interpretação de texto, literatura brasileira e portuguesa, redação. "
            "Use linguagem clara, exemplos práticos e respostas curtas (máximo 4 parágrafos). "
            "Quando pertinente, cite autores ou obras literárias. "
            "Se a pergunta fugir de Língua Portuguesa, redirecione gentilmente."
        ),
        "system_quiz": (
            "Você é um professor de Língua Portuguesa aplicando um quiz ao aluno. "
            "Faça UMA pergunta de cada vez sobre: gramática, ortografia, classes de palavras, "
            "literatura brasileira/portuguesa ou interpretação de texto. "
            "Após a resposta do aluno, avalie: diga se está CORRETO ou INCORRETO, "
            "explique brevemente o porquê e pergunte se ele quer continuar. "
            "Quando ele disser 'sim' ou qualquer confirmação, faça uma nova pergunta. "
            "Comece fazendo a primeira pergunta imediatamente, sem introdução."
        ),
    },
    "🌐 Língua Inglesa": {
        "cor":   "#3498db",
        "model": "llama-3.3-70b-versatile",
        "system_chat": (
            "You are a helpful English teacher for Brazilian high school students. "
            "Always respond in BOTH languages: first English, then the Portuguese translation/explanation. "
            "Topics: grammar, vocabulary, verb tenses, idioms, reading comprehension, writing. "
            "Keep answers short, practical, and encouraging. Maximum 4 paragraphs. "
            "If the question is off-topic, politely redirect to English language learning."
        ),
        "system_quiz": (
            "You are an English teacher giving a quiz to a Brazilian student. "
            "Ask ONE question at a time about: verb tenses, vocabulary, grammar, translations, or reading comprehension. "
            "Write the question in English first, then in Portuguese so the student understands. "
            "After their answer, say CORRECT or INCORRECT, explain briefly (in both languages), "
            "and ask if they want to continue. When they confirm, ask a new question. "
            "Start with the first question immediately, no introduction."
        ),
    },
    "🧬 Biologia": {
        "cor":   "#e74c3c",
        "model": "llama-3.3-70b-versatile",
        "system_chat": (
            "Você é um professor de Biologia do ensino médio, apaixonado pela vida e pela ciência. "
            "Responda sempre em português do Brasil. "
            "Seus tópicos: citologia, genética, ecologia, evolução, fisiologia humana, botânica, zoologia, microbiologia. "
            "Use analogias simples para explicar conceitos complexos. "
            "Respostas curtas e objetivas (máximo 4 parágrafos). Cite experimentos ou fenômenos reais quando relevante. "
            "Se a pergunta fugir de Biologia, redirecione gentilmente."
        ),
        "system_quiz": (
            "Você é um professor de Biologia aplicando um quiz ao aluno. "
            "Faça UMA pergunta de cada vez sobre: citologia, genética, ecologia, evolução, fisiologia ou classificação dos seres vivos. "
            "Após a resposta do aluno, avalie: diga CORRETO ou INCORRETO, "
            "explique brevemente o conceito correto e pergunte se ele quer continuar. "
            "Quando ele confirmar, faça uma nova pergunta. "
            "Comece fazendo a primeira pergunta imediatamente, sem introdução."
        ),
    },
    "🏛️ História": {
        "cor":   "#f39c12",
        "model": "llama-3.3-70b-versatile",
        "system_chat": (
            "Você é um professor de História do ensino médio, narrativo e contextual. "
            "Responda sempre em português do Brasil. "
            "Seus tópicos: História do Brasil (colônia, império, república), História Mundial (antiguidade ao século XXI), "
            "revoluções, guerras, movimentos sociais e culturais. "
            "Contextualize os fatos e relacione causas e consequências. "
            "Respostas curtas e claras (máximo 4 parágrafos). "
            "Se a pergunta fugir de História, redirecione gentilmente."
        ),
        "system_quiz": (
            "Você é um professor de História aplicando um quiz ao aluno. "
            "Faça UMA pergunta de cada vez sobre: Brasil colônia/império/república, guerras mundiais, "
            "revoluções, civilizações antigas ou movimentos sociais. "
            "Após a resposta do aluno, avalie: diga CORRETO ou INCORRETO, "
            "explique brevemente o contexto histórico correto e pergunte se ele quer continuar. "
            "Quando ele confirmar, faça uma nova pergunta. "
            "Comece fazendo a primeira pergunta imediatamente, sem introdução."
        ),
    },
}



# ----- ESTADO DA SESSÃO -----

# O Streamlit reroda o script inteiro a cada interação.
# st.session_state persiste dados entre reruns.

def inicializar_estado():
    if "mensagens"     not in st.session_state:
        st.session_state.mensagens = []
    if "disciplina"    not in st.session_state:
        st.session_state.disciplina = list(DISCIPLINAS.keys())[0]
    if "modo"          not in st.session_state:
        st.session_state.modo = "💬 Chat livre"
    if "encerrado"     not in st.session_state:
        st.session_state.encerrado = False



# ----- CHAMADA À API -----

# Envia o histórico completo de mensagens para o modelo e retorna a resposta.
# O system prompt é injetado como primeira mensagem para definir o comportamento.

def chamar_modelo(system_prompt, historico):
    mensagens_api = [{"role": "system", "content": system_prompt}] + historico
    resposta = client.chat.completions.create(
        model=DISCIPLINAS[st.session_state.disciplina]["model"],
        messages=mensagens_api,
        temperature=0.7,
        max_tokens=600,
    )
    return resposta.choices[0].message.content



# ----- INTERFACE -----

def configurar_pagina():
    st.set_page_config(
        page_title="Chatbot Educacional",
        page_icon="🎓",
        layout="wide",
    )


def renderizar_sidebar():
    with st.sidebar:
        st.markdown("## 🎓 Chatbot Educacional")
        st.markdown("---")

        # Seletor de disciplina
        st.markdown("**Disciplina**")
        nova_disciplina = st.radio(
            label="disciplina",
            options=list(DISCIPLINAS.keys()),
            index=list(DISCIPLINAS.keys()).index(st.session_state.disciplina),
            label_visibility="collapsed",
        )

        # Troca de disciplina limpa o histórico
        if nova_disciplina != st.session_state.disciplina:
            st.session_state.disciplina   = nova_disciplina
            st.session_state.mensagens    = []
            st.session_state.encerrado    = False
            st.rerun()

        st.markdown("---")

        # Seletor de modo
        st.markdown("**Modo**")
        novo_modo = st.radio(
            label="modo",
            options=["💬 Chat livre", "🧠 Quiz"],
            index=0 if st.session_state.modo == "💬 Chat livre" else 1,
            label_visibility="collapsed",
        )

        # Troca de modo também limpa o histórico
        if novo_modo != st.session_state.modo:
            st.session_state.modo         = novo_modo
            st.session_state.mensagens    = []
            st.session_state.encerrado    = False
            st.rerun()

        st.markdown("---")

        # Botão para nova conversa
        if st.button("🔄 Nova conversa", use_container_width=True):
            st.session_state.mensagens    = []
            st.session_state.encerrado    = False
            st.rerun()

        st.markdown("---")
        st.caption("Digite **sair** para encerrar a conversa.")
        st.caption("Desenvolvido para a disciplina de Inteligência Artificial — UFSC")


def renderizar_cabecalho():
    disc  = st.session_state.disciplina
    modo  = st.session_state.modo
    cor   = DISCIPLINAS[disc]["cor"]
    titulo = f"{disc}  •  {modo}"
    st.markdown(
        f"<h2 style='color:{cor}; margin-bottom:0'>{titulo}</h2>",
        unsafe_allow_html=True,
    )
    st.markdown("---")


def renderizar_historico():
    for msg in st.session_state.mensagens:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])


def processar_entrada(entrada):
    disc         = st.session_state.disciplina
    modo         = st.session_state.modo
    eh_quiz      = modo == "🧠 Quiz"
    system_key   = "system_quiz" if eh_quiz else "system_chat"
    system_prompt = DISCIPLINAS[disc][system_key]

    # Adiciona mensagem do usuário ao histórico e exibe imediatamente
    st.session_state.mensagens.append({"role": "user", "content": entrada})
    with st.chat_message("user"):
        st.markdown(entrada)

    # Obtém resposta do modelo com indicador de carregamento
    with st.chat_message("assistant"):
        with st.spinner("Pensando..."):
            resposta = chamar_modelo(system_prompt, st.session_state.mensagens)
        st.markdown(resposta)

    st.session_state.mensagens.append({"role": "assistant", "content": resposta})



# ----- MENSAGEM DE BOAS-VINDAS -----

# Exibida apenas quando o histórico está vazio (início ou após nova conversa).

def mensagem_boas_vindas():
    disc    = st.session_state.disciplina
    modo    = st.session_state.modo
    cor     = DISCIPLINAS[disc]["cor"]
    eh_quiz = modo == "🧠 Quiz"

    if eh_quiz:
        texto = (
            f"**Modo Quiz ativado!** Vou te fazer perguntas sobre {disc}. "
            "Responda o melhor que puder — sem pressão! "
            "Clique no campo abaixo e escreva **começar** para iniciar."
        )
    else:
        texto = (
            f"Olá! Sou seu professor virtual de {disc}. "
            "Pode me fazer qualquer pergunta sobre a disciplina. "
            "Digite **sair** quando quiser encerrar."
        )

    st.markdown(
        f"<div style='background:{cor}22; border-left:4px solid {cor}; "
        f"padding:12px 16px; border-radius:4px; margin-bottom:16px'>{texto}</div>",
        unsafe_allow_html=True,
    )



# ----- MAIN -----

def main():
    configurar_pagina()
    inicializar_estado()
    renderizar_sidebar()
    renderizar_cabecalho()

    # Conversa encerrada pelo comando "sair"
    if st.session_state.encerrado:
        st.info("Conversa encerrada. Clique em **🔄 Nova conversa** na barra lateral para recomeçar.")
        return

    # Exibe boas-vindas se não há histórico
    if not st.session_state.mensagens:
        mensagem_boas_vindas()

    renderizar_historico()

    # Campo de entrada fixo na base da página
    entrada = st.chat_input("Digite sua mensagem aqui...")

    if entrada:
        if entrada.strip().lower() == "sair":
            st.session_state.encerrado = True
            st.rerun()
        else:
            processar_entrada(entrada)
            st.rerun()


if __name__ == "__main__":
    main()
