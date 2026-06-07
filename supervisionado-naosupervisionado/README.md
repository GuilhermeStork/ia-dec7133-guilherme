# Segmentação de Clientes com IA

Trabalho acadêmico demonstrando dois paradigmas de aprendizado de máquina aplicados ao mesmo problema de negócio.

| Paradigma | Algoritmo | Pergunta respondida |
|-----------|-----------|---------------------|
| **Não-supervisionado** | K-Means | Quais perfis de clientes existem? |
| **Supervisionado** | Árvore de Decisão | Dado um novo cliente, qual é seu perfil? |

---

## Pré-requisitos

- Python 3.9 ou superior
- Terminal (macOS/Linux) ou PowerShell (Windows)

---

## Instalação

### 1. Clone ou baixe o projeto

```bash
git clone <url-do-repositorio>
cd supervisionado-naosupervisionado
```

### 2. Crie o ambiente virtual

```bash
python3 -m venv .venv
```

### 3. Ative o ambiente virtual

**macOS / Linux:**
```bash
source .venv/bin/activate
```

**Windows:**
```bash
.venv\Scripts\activate
```

> Você saberá que está ativo quando o terminal mostrar `(.venv)` no início da linha.

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

---

## Como rodar

```bash
jupyter notebook segmentacao_clientes.ipynb
```

O navegador abrirá automaticamente em `http://localhost:8888` com o notebook.

### Executando as células

- **Rodar uma célula:** `Shift + Enter`
- **Rodar tudo de uma vez:** menu `Kernel` → `Restart & Run All`

---

## Estrutura do projeto

```
supervisionado-naosupervisionado/
├── segmentacao_clientes.ipynb   # notebook principal
├── requirements.txt             # dependências
├── .gitignore
└── guia-de-estudo/              # material de apoio para a apresentação
    ├── README.md
    ├── 01-machine-learning.md
    ├── 02-supervisionado-vs-nao-supervisionado.md
    ├── 03-modelo-rfm.md
    ├── 04-kmeans.md
    ├── 05-arvore-de-decisao.md
    ├── 06-pre-processamento.md
    ├── 07-avaliacao.md
    └── 08-perguntas-e-respostas.md
```

---

## Desativar o ambiente virtual

Quando terminar:

```bash
deactivate
```

---

## Dependências

| Biblioteca | Versão mínima | Uso |
|------------|---------------|-----|
| numpy | 1.21 | Geração de dados |
| pandas | 1.3 | Manipulação de tabelas |
| scikit-learn | 1.0 | K-Means, Árvore de Decisão, métricas |
| matplotlib | 3.4 | Gráficos |
| seaborn | 0.11 | Estilo dos gráficos |
| jupyter | 1.0 | Execução do notebook |
