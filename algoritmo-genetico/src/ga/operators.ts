import type { Chromosome, Player, Team } from '../types'
import { fitness } from './fitness'

/** Jogadores por time. O pool tem muitos mais; o restante fica no banco ('-'). */
export const TEAM_SIZE = 5

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Tournament selection: pick k random individuals, return the best. */
export function tournamentSelect(
  population: Chromosome[],
  players: Player[],
  k: number,
  rng: () => number
): Chromosome {
  const candidates = shuffle(population, rng).slice(0, k)
  return candidates.reduce((best, c) =>
    fitness(c, players) >= fitness(best, players) ? c : best
  )
}

/**
 * Uniform crossover preservando exatamente 5 'A' e 5 'B' (o resto vai pro banco).
 * Posições onde os pais concordam são herdadas; as demais são preenchidas
 * respeitando as cotas de cada time.
 */
export function uniformCrossover(
  p1: Chromosome,
  p2: Chromosome,
  rng: () => number
): Chromosome {
  const n = p1.length
  const child: Array<Team | null> = Array(n).fill(null)

  // Positions where parents agree — inherit directly
  for (let i = 0; i < n; i++) {
    if (p1[i] === p2[i]) child[i] = p1[i]
  }

  // How many A/B slots are still needed after the agreed inheritances
  let needA = TEAM_SIZE - child.filter(x => x === 'A').length
  let needB = TEAM_SIZE - child.filter(x => x === 'B').length

  // Fill remaining positions: assign the A/B quotas, bench the rest
  const free = shuffle(
    child.map((v, i) => (v === null ? i : -1)).filter(i => i >= 0),
    rng
  )

  for (const idx of free) {
    if (needA > 0 && (needB === 0 || rng() < 0.5)) {
      child[idx] = 'A'
      needA--
    } else if (needB > 0) {
      child[idx] = 'B'
      needB--
    } else {
      child[idx] = '-'
    }
  }

  return child as Chromosome
}

/**
 * Swap mutation com duas variantes (50/50):
 * - Reequilíbrio: troca um jogador do time A por um do time B.
 * - Substituição: troca um jogador escalado por um do banco (muda QUEM joga).
 * Ambas preservam a restrição de 5 'A' e 5 'B'.
 */
export function mutate(
  chromosome: Chromosome,
  mutationRate: number,
  rng: () => number
): Chromosome {
  if (rng() > mutationRate) return chromosome

  const result = [...chromosome] as Chromosome
  const idxOf = (t: Team) => result.map((v, i) => (v === t ? i : -1)).filter(i => i >= 0)
  const pick = (arr: number[]) => arr[Math.floor(rng() * arr.length)]

  const aIdx = idxOf('A')
  const bIdx = idxOf('B')
  const benchIdx = idxOf('-')

  if (benchIdx.length === 0 || rng() < 0.5) {
    // Reequilíbrio: troca um A com um B
    if (aIdx.length === 0 || bIdx.length === 0) return result
    const ai = pick(aIdx)
    const bi = pick(bIdx)
    result[ai] = 'B'
    result[bi] = 'A'
  } else {
    // Substituição: um escalado vai pro banco e um do banco entra no lugar
    const selIdx = [...aIdx, ...bIdx]
    if (selIdx.length === 0) return result
    const si = pick(selIdx)
    const benchI = pick(benchIdx)
    result[benchI] = result[si]
    result[si] = '-'
  }

  return result
}

/** Build a valid random chromosome: 5 A's, 5 B's, rest benched, over the pool. */
export function randomChromosome(rng: () => number, poolSize = 50): Chromosome {
  const arr: Team[] = Array(poolSize).fill('-')
  const positions = shuffle(
    Array.from({ length: poolSize }, (_, i) => i),
    rng
  ).slice(0, TEAM_SIZE * 2)
  positions.forEach((pos, k) => {
    arr[pos] = k < TEAM_SIZE ? 'A' : 'B'
  })
  return arr
}
