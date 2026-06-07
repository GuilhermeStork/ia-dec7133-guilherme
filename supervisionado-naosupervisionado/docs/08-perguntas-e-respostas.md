# 08 — Perguntas Prováveis da Banca

Respostas diretas para as perguntas mais comuns em apresentações sobre este tema.

---

## Sobre o tema geral

**P: Qual a diferença entre supervisionado e não-supervisionado?**

> No supervisionado, o algoritmo aprende a partir de dados que já têm respostas corretas (rótulos). No não-supervisionado, não há rótulos — o algoritmo descobre a estrutura dos dados sozinho. No nosso projeto, o K-Means descobre os grupos sem saber quais perfis existem; a Árvore de Decisão aprende a classificar usando os grupos que o K-Means encontrou.

---

**P: Por que usar os dois algoritmos juntos?**

> Cada um resolve uma parte diferente do problema. O K-Means serve para a fase de descoberta — quando não sabemos quantos perfis existem. Depois de identificados e rotulados os perfis, a Árvore de Decisão aprende a classificar novos clientes de forma rápida e explicável, sem precisar rodar o K-Means novamente.

---

**P: Os dados são reais?**

> Não, são simulados com NumPy. Em projetos acadêmicos é prática comum quando não há acesso a dados reais. Os dados foram construídos para refletir padrões realistas de comportamento de clientes usando o modelo RFM, que é amplamente utilizado em marketing.

---

## Sobre o K-Means

**P: Por que você escolheu K=3?**

> Usamos o Método do Cotovelo: testamos K de 1 a 9 e plotamos a inércia para cada valor. O gráfico mostra uma queda acentuada até K=3 e depois estabiliza. O "cotovelo" no K=3 indica que adicionar mais clusters não traz ganho relevante de qualidade.

---

**P: O K-Means sempre dá o mesmo resultado?**

> Não necessariamente. Os centróides iniciais são escolhidos aleatoriamente, e isso pode levar a resultados diferentes. Para garantir reprodutibilidade, usamos `random_state=42`, que fixa a semente do gerador de números aleatórios.

---

**P: Por que você normalizou os dados antes do K-Means?**

> O K-Means calcula distâncias entre pontos. Se as variáveis têm escalas muito diferentes — como recência (1–365 dias) e frequência (1–30 compras) — a variável com maior amplitude domina o cálculo e distorce os grupos. A normalização (StandardScaler) coloca todas as variáveis na mesma escala, com média 0 e desvio padrão 1.

---

**P: Quem deu os nomes VIP, Ocasional e Inativo para os clusters?**

> O K-Means não nomeia os grupos — ele só atribui números (cluster 0, 1, 2). Nós interpretamos os nomes depois, analisando as médias de cada variável em cada cluster. O cluster com maior gasto médio e maior frequência foi chamado de VIP; o intermediário, de Ocasional; o com menor gasto e maior recência, de Inativo.

---

## Sobre a Árvore de Decisão

**P: O que é Gini Impurity?**

> É a métrica que a Árvore de Decisão usa para escolher onde fazer cada divisão. Gini mede a "mistura" de classes em um nó: Gini=0 significa que todos os exemplos daquele nó são da mesma classe (puro); Gini=0,5 significa máxima mistura. O algoritmo sempre escolhe o corte que mais reduz a impureza.

---

**P: Por que a acurácia foi 100%? Isso é suspeito?**

> Com dados reais, 100% seria um sinal de overfitting. No nosso caso, os dados foram gerados artificialmente com perfis bem separados (os intervalos de RFM de cada perfil não se sobrepõem significativamente), então a árvore consegue aprender fronteiras perfeitas. É um resultado esperado para dados simulados com essa característica.

---

**P: O que é overfitting?**

> Overfitting é quando o modelo "decora" os dados de treino em vez de aprender padrões generalizáveis. Ele vai bem no treino mas mal em dados novos. É como um aluno que memoriza as respostas em vez de entender o conteúdo — vai bem na prova que já viu, mas mal em uma nova. Por isso dividimos os dados em treino e teste: para verificar se o modelo generaliza.

---

**P: O que é o parâmetro max_depth=4?**

> É a profundidade máxima da árvore — quantas perguntas ela pode fazer em sequência. Sem esse limite, a árvore cresceria até classificar cada cliente individualmente, o que seria overfitting. Com max_depth=4, limitamos a complexidade e forçamos o modelo a aprender regras mais gerais.

---

## Sobre o projeto como um todo

**P: Qual seria a aplicação prática disso?**

> Uma loja poderia usar esse modelo para criar campanhas direcionadas: oferecer programa de fidelidade para clientes VIP, cupons de desconto para clientes Ocasionais incentivar compras mais frequentes, e campanhas de reativação para clientes Inativos. O modelo também poderia ser integrado ao sistema de cadastro: quando um cliente novo realiza a primeira compra, já é automaticamente classificado.

---

**P: Quais seriam os próximos passos se fosse um projeto real?**

> 1. Usar dados reais de um sistema de vendas
> 2. Avaliar com métricas mais robustas (Silhouette Score para K-Means, validação cruzada para a árvore)
> 3. Testar outros algoritmos (Random Forest, DBSCAN) e comparar
> 4. Monitorar o modelo ao longo do tempo, pois o comportamento de clientes muda
> 5. Integrar com sistema de CRM para ações automáticas por perfil
