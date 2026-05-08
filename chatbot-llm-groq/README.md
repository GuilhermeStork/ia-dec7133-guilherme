# Chatbot Educacional UFSC

Chatbot educacional desenvolvido por Guilherme Pereira Teixeira e Sam Nascimento Yamaguchi, com interface Streamlit e integração com a API da Groq (modelo LLaMA 3.3). Suporta quatro disciplinas e dois modos: conversa livre e quiz interativo.

## Como rodar localmente


### 1. Crie e ative um ambiente virtual (opcional)

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Verifique a chave de API

No .env deve ter a chave de API da Groq, exclusiva para uso da equipe e da professora. Fica deste jeito:

```
GROQ_API_KEY=schave_aqui
```

### 5. Rode a aplicação

```bash
streamlit run chatbot_educacional.py
```

A aplicação abrirá automaticamente em `http://localhost:8501`.
