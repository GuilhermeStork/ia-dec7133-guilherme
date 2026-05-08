# Trabalho feito para a disciplina de Inteligência Artificial, por Guilherme Pereira Teixeira e Sam Nascimento Yamaguchi.

# A função do código é aplicar o algoritmo MinMax em cima de um Jogo da Velha (Tic-Tac-Toe).
# O computador joga como 'X' (maximizador) e o humano joga como 'O' (minimizador).
# O algoritmo explora toda a árvore de jogo para escolher sempre o movimento ótimo.

VAZIO  = "."
IA     = "X"
HUMANO = "O"



# Retorna True se algum jogador venceu em linha, coluna ou diagonal.

def verificar_vencedor(tabuleiro, jogador):
    linhas = tabuleiro
    colunas = [[tabuleiro[l][c] for l in range(3)] for c in range(3)]
    diagonais = [
        [tabuleiro[i][i]     for i in range(3)],
        [tabuleiro[i][2 - i] for i in range(3)],
    ]
    for grupo in linhas + colunas + diagonais:
        if all(cel == jogador for cel in grupo):
            return True
    return False



# Retorna True se o tabuleiro não tem mais casas vazias.

def tabuleiro_cheio(tabuleiro):
    return all(tabuleiro[l][c] != VAZIO for l in range(3) for c in range(3))



# Avalia o estado terminal: +10 para vitória da IA, -10 para vitória do humano, 0 para empate.

def avaliar(tabuleiro):
    if verificar_vencedor(tabuleiro, IA):
        return 10
    if verificar_vencedor(tabuleiro, HUMANO):
        return -10
    return 0



# Algoritmo MinMax. Alterna entre maximizar (vez da IA) e minimizar (vez do humano),
# percorrendo toda a árvore de estados até encontrar os terminais.

def minmax(tabuleiro, profundidade, eh_maximizador):
    pontuacao = avaliar(tabuleiro)

    # Estado terminal: alguém ganhou ou tabuleiro cheio
    if pontuacao != 0:
        return pontuacao
    if tabuleiro_cheio(tabuleiro):
        return 0

    if eh_maximizador:
        melhor = -1000
        for l in range(3):
            for c in range(3):
                if tabuleiro[l][c] == VAZIO:
                    tabuleiro[l][c] = IA
                    melhor = max(melhor, minmax(tabuleiro, profundidade + 1, False))
                    tabuleiro[l][c] = VAZIO
        return melhor
    else:
        melhor = 1000
        for l in range(3):
            for c in range(3):
                if tabuleiro[l][c] == VAZIO:
                    tabuleiro[l][c] = HUMANO
                    melhor = min(melhor, minmax(tabuleiro, profundidade + 1, True))
                    tabuleiro[l][c] = VAZIO
        return melhor



# Determina o melhor movimento possível para a IA avaliando cada casa vazia com MinMax.

def melhor_jogada(tabuleiro):
    melhor_val = -1000
    movimento  = (-1, -1)

    for l in range(3):
        for c in range(3):
            if tabuleiro[l][c] == VAZIO:
                tabuleiro[l][c] = IA
                val = minmax(tabuleiro, 0, False)
                tabuleiro[l][c] = VAZIO

                if val > melhor_val:
                    melhor_val = val
                    movimento  = (l, c)

    return movimento



# Impressão visual do tabuleiro com índices de posição para o humano usar.

def imprimir_tabuleiro(tabuleiro):
    print()
    print("    0   1   2")
    print("  +---+---+---+")
    for l in range(3):
        linha = f"{l} |"
        for c in range(3):
            cel = tabuleiro[l][c]
            linha += f" {cel} |"
        print(linha)
        print("  +---+---+---+")
    print()



# Loop principal do jogo. Alterna entre a jogada do humano e a jogada da IA.

def jogar():
    tabuleiro = [[VAZIO] * 3 for _ in range(3)]

    print("=" * 40)
    print("     Algoritmo MinMax – Jogo da Velha")
    print("=" * 40)
    print(f"  Você joga com '{HUMANO}'.  IA joga com '{IA}'.")
    print("  Para jogar, informe linha e coluna (0-2).")
    print("  A IA sempre jogará de forma ótima.")

    # Sorteia quem começa (IA começa se quiser testar, humano começa por padrão)
    vez = HUMANO

    while True:
        imprimir_tabuleiro(tabuleiro)

        if vez == HUMANO:
            print("  Sua vez!")
            try:
                l = int(input("  Linha  (0-2): "))
                c = int(input("  Coluna (0-2): "))
            except ValueError:
                print("  Entrada inválida. Tente novamente.")
                continue

            if not (0 <= l <= 2 and 0 <= c <= 2):
                print("  Posição fora do tabuleiro. Tente novamente.")
                continue
            if tabuleiro[l][c] != VAZIO:
                print("  Posição ocupada. Tente novamente.")
                continue

            tabuleiro[l][c] = HUMANO
            vez = IA

        else:
            print("  Vez da IA...")
            l, c = melhor_jogada(tabuleiro)
            tabuleiro[l][c] = IA
            print(f"  IA jogou em ({l}, {c})")
            vez = HUMANO

        # Verifica resultado após cada jogada
        if verificar_vencedor(tabuleiro, IA):
            imprimir_tabuleiro(tabuleiro)
            print("  A IA venceu! (Como esperado — MinMax é imbatível.)")
            break
        if verificar_vencedor(tabuleiro, HUMANO):
            imprimir_tabuleiro(tabuleiro)
            print("  Você venceu! (Impressionante — deve haver um bug...)")
            break
        if tabuleiro_cheio(tabuleiro):
            imprimir_tabuleiro(tabuleiro)
            print("  Empate!")
            break



# Execução.

if __name__ == "__main__":
    jogar()
