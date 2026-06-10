import { motion } from 'framer-motion'
import { useGAStore } from '../store/gaStore'

const concepts = [
  {
    id: 'chromosome',
    title: 'Cromossomo',
    icon: '🧬',
    visual: `[ A  A  A  A  A  B  B  B  B  B ]
  0  1  2  3  4  5  6  7  8  9
  ↑ Team Alpha          ↑ Team Bravo`,
    description:
      'Cada solução é representada por um cromossomo: um array de 10 posições, onde cada posição corresponde a um jogador e o valor (A ou B) indica a qual equipe ele pertence. A restrição é que exatamente 5 jogadores vão para cada time.',
  },
  {
    id: 'fitness',
    title: 'Função Fitness',
    icon: '📊',
    visual: `fitness = 1 - penalty

penalty = 0.5 × Δelo_norm
        + 0.5 × média(Δpapéis_norm)

Δelo_norm   = |eloA - eloB| / 10000
Δpapéis_norm = |attrA - attrB| / 50`,
    description:
      'O fitness mede o equilíbrio entre os times. Quanto mais próximos os elos totais e os atributos de papel (AWP, Entry, Support, IGL, Lurker), maior o fitness — máximo de 1.0 para times perfeitamente iguais. A normalização evita que o Elo domine os papéis.',
  },
  {
    id: 'selection',
    title: 'Seleção por Torneio',
    icon: '🏆',
    visual: `População: [ind1, ind2, ... ind200]
         ↓
  Sortear k=20 aleatórios
         ↓
  Escolher o melhor dos 20
         ↓
  Repetir para o 2º pai`,
    description:
      'Na seleção por torneio, k indivíduos são escolhidos aleatoriamente da população e o melhor é selecionado como pai. Isso mantém pressão seletiva controlável: k maior = mais pressão (elitismo). Usamos k ≈ 10% da população.',
  },
  {
    id: 'crossover',
    title: 'Crossover Uniforme',
    icon: '✂️',
    visual: `Pai 1: [ A  A  A  A  A  B  B  B  B  B ]
Pai 2: [ B  B  A  A  B  A  A  B  A  B ]
                ↓
Filho: [ A  B  A  A  B  A  B  B  A  B ]
                         ← 5 A's, 5 B's garantidos`,
    description:
      'Cada posição do filho herda o valor de um pai aleatório. Posições onde os pais concordam são herdadas diretamente. As demais são preenchidas aleatoriamente garantindo sempre 5 jogadores por time — a restrição do problema nunca é violada.',
  },
  {
    id: 'mutation',
    title: 'Mutação por Troca',
    icon: '🔀',
    visual: `Antes: [ A  A  A  A  A  B  B  B  B  B ]
                          ↑swap↑
Depois: [ A  A  A  B  A  B  B  B  A  B ]
         ← troca 1 A com 1 B aleatório`,
    description:
      'Com probabilidade igual à taxa de mutação, um jogador do Time A e um do Time B trocam de time. Isso mantém a restrição (5×5) e introduz diversidade genética, evitando que o algoritmo fique preso em ótimos locais.',
  },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function EducationalSection() {
  const { generation, status } = useGAStore()

  // Highlight which operator was most recently "active" based on generation parity
  const activeOp = status === 'idle' || status === 'done'
    ? null
    : (['selection', 'crossover', 'mutation'] as const)[generation % 3]

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Como funciona o Algoritmo Genético
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {concepts.map(c => (
          <motion.div
            key={c.id}
            variants={fadeUp}
            className={`bg-cs-card border rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 ${
              activeOp === c.id
                ? 'border-cs-yellow shadow-[0_0_12px_rgba(240,165,0,0.3)]'
                : 'border-cs-border'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{c.icon}</span>
              <h3 className="font-bold text-gray-100">{c.title}</h3>
              {activeOp === c.id && (
                <span className="ml-auto text-[10px] bg-cs-yellow text-black px-2 py-0.5 rounded-full font-bold animate-pulse">
                  ATIVO
                </span>
              )}
            </div>
            <pre className="bg-black/40 rounded-lg p-3 text-[11px] text-green-300 font-mono whitespace-pre overflow-x-auto leading-relaxed">
              {c.visual}
            </pre>
            <p className="text-xs text-gray-400 leading-relaxed">{c.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
