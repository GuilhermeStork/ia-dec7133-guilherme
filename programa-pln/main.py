import streamlit as st
from logic import verificar_resposta, CASOS_DE_TESTE

# ----- CONFIGURAÇÃO DA PÁGINA -----
st.set_page_config(page_title="Verificador PLN", layout="centered")
st.title("Sistema de Verificação de Respostas com PLN")
st.caption("Pré-processamento · TF-IDF · Similaridade do Cosseno")

# Duas abas: uso interativo e execução dos casos de teste do trabalho
tab_interativo, tab_testes = st.tabs(["Modo Interativo", "Casos de Teste"])

# ----- ABA INTERATIVA -----
with tab_interativo:
    # Formulário agrupa os campos e só dispara o processamento ao clicar em "Verificar"
    with st.form("verificar"):
        pergunta = st.text_input("Pergunta")
        esperada = st.text_area("Resposta esperada (gabarito)", height=80)
        usuario  = st.text_area("Resposta do aluno", height=80)
        submitted = st.form_submit_button("Verificar")

    if submitted:
        if not pergunta or not esperada or not usuario:
            st.warning("Preencha todos os campos.")
        else:
            r = verificar_resposta(pergunta, esperada, usuario)

            # Cor do nível de acordo com a faixa de desempenho
            cor = {"Excelente": "green", "Bom": "blue", "Regular": "orange", "Insuficiente": "red"}[r["nivel"]]
            st.markdown(f"### Nota: **{r['nota']} / 100** &nbsp; <span style='color:{cor}'>{r['nivel']}</span>", unsafe_allow_html=True)
            st.metric("Similaridade do cosseno", f"{r['similaridade']:.4f}", f"{r['similaridade']*100:.1f}%")
            st.info(f"Feedback: **{r['feedback']}**")

            # Tokens após pré-processamento (limpeza + remoção de stopwords + stemming)
            with st.expander("Ver stems gerados"):
                col1, col2 = st.columns(2)
                col1.write("**Gabarito**")
                col1.write(r["tokens_esp"])
                col2.write("**Aluno**")
                col2.write(r["tokens_usr"])

# ----- ABA DE CASOS DE TESTE -----
with tab_testes:
    st.markdown("Executa os 7 casos de teste pré-definidos do trabalho.")
    if st.button("Rodar todos os casos"):
        for caso in CASOS_DE_TESTE:
            r = verificar_resposta(caso["pergunta"], caso["esperada"], caso["usuario"])
            # Cada caso fica em um expander com o título mostrando nota e nível
            with st.expander(f"{caso['descricao']}  —  {r['nota']}/100 · {r['nivel']}"):
                st.write(f"**Pergunta:** {r['pergunta']}")
                st.write(f"**Esperada:** {r['esperada']}")
                st.write(f"**Usuário:** {r['usuario']}")
                st.metric("Similaridade", f"{r['similaridade']:.4f}")
                st.write(f"Nota: **{r['nota']}** · Nível: **{r['nivel']}** · Feedback: **{r['feedback']}**")
