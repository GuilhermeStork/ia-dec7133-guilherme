import heapq

# Trabalho feito por Guilherme Pereira Teixeira, para a disciplina de Inteligência Artificial.
# O código foi feito com auxílio de IA (Claude Code, Sonnet 4.6) e analisado manualmente.
# Todos os comentários neste arquivo foram escritos à mão.

# A função do código é aplicar o algoritmo estrela em cima de um labirinto pré-criado em forma de array. Os zeros representam espaços navegáveis, e os números um são as "paredes".
# Definimos o canto superior esquerdo como o início, e o canto inferior direito como o fim.

MAPA = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

INICIO = (0, 0)
FIM    = (9, 9)

LINHAS = len(MAPA)
COLUNAS = len(MAPA[0])



# Função que estabelece a heurística (distância de Manhattan) para verificar a distância entre o ponto atual e o objetivo.
# Na fórmula, representa o h.

def heuristica(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


# Função que verifica os vizinhos válidos nas 4 direções. Se está fora do array ou é um obstáculo, o algoritmo sabe que não pode ir para lá.

def vizinhos(pos):
    lin, col = pos
    candidatos = [
        (lin - 1, col),  # cima
        (lin + 1, col),  # baixo
        (lin, col - 1),  # esquerda
        (lin, col + 1),  # direita
    ]
    return [
        (r, c) for r, c in candidatos
        if 0 <= r < LINHAS and 0 <= c < COLUNAS and MAPA[r][c] == 0
    ]


# Algoritmo A*. Ele vai expandindo nós a cada iteração e fazendo a distinção se o caminho é melhor do que o anterior.

def astar(inicio, fim):
    # fila de prioridade: (f, g, posição)
    fila = []
    heapq.heappush(fila, (0, 0, inicio))

    veio_de  = {}          # rastreia o caminho
    custo_g  = {inicio: 0} # custo acumulado do início até cada nó

    while fila:
        _, g, atual = heapq.heappop(fila)

        if atual == fim:
            return reconstruir_caminho(veio_de, fim)

        for viz in vizinhos(atual):
            novo_g = g + 1  # custo uniforme (cada passo = 1)

            if viz not in custo_g or novo_g < custo_g[viz]:
                custo_g[viz] = novo_g
                f = novo_g + heuristica(viz, fim)
                heapq.heappush(fila, (f, novo_g, viz))
                veio_de[viz] = atual

    return None  # sem caminho



# Reconstrói o caminho depois de um percorrimento.

def reconstruir_caminho(veio_de, fim):
    caminho = []
    no = fim
    while no in veio_de:
        caminho.append(no)
        no = veio_de[no]
    caminho.append(no)
    caminho.reverse()
    return caminho



# Impressão visual do mapa com o caminho.

def imprimir_mapa(caminho):
    caminho_set = set(caminho)
    simbolos = {
        "livre":      ".",
        "obstaculo":  "#",
        "caminho":    "*",
        "inicio":     "S",
        "fim":        "E",
    }

    print()
    for lin in range(LINHAS):
        linha_str = ""
        for col in range(COLUNAS):
            pos = (lin, col)
            if pos == INICIO:
                linha_str += simbolos["inicio"]
            elif pos == FIM:
                linha_str += simbolos["fim"]
            elif pos in caminho_set:
                linha_str += simbolos["caminho"]
            elif MAPA[lin][col] == 1:
                linha_str += simbolos["obstaculo"]
            else:
                linha_str += simbolos["livre"]
            linha_str += " "
        print("  " + linha_str)
    print()



# Execução.

if __name__ == "__main__":
    print("=" * 40)
    print("       Algoritmo A* - Busca em Grade")
    print("=" * 40)
    print(f"  Início : {INICIO}")
    print(f"  Fim    : {FIM}")

    caminho = astar(INICIO, FIM)

    if caminho is None:
        print("\n  Nenhum caminho encontrado!")
    else:
        print(f"  Comprimento do caminho: {len(caminho) - 1} passos")
        imprimir_mapa(caminho)
        print("  Legenda:  S=início  E=fim  *=caminho  #=obstáculo  .=livre")
        print()
        print("  Sequência de posições:")
        print(" ", " -> ".join(str(p) for p in caminho))
    print()
