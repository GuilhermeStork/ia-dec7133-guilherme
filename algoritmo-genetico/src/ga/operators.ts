import type { Chromosome, Player } from '../types'
import { fitness } from './fitness'

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

/** Uniform crossover that guarantees exactly 5 'A' and 5 'B' in the offspring. */
export function uniformCrossover(
  p1: Chromosome,
  p2: Chromosome,
  rng: () => number
): Chromosome {
  const child: Array<'A' | 'B' | null> = Array(10).fill(null)

  // Positions where parents agree — inherit directly
  for (let i = 0; i < 10; i++) {
    if (p1[i] === p2[i]) child[i] = p1[i]
  }

  // Count how many A/B slots are still needed
  const fixedA = child.filter(x => x === 'A').length
  const fixedB = child.filter(x => x === 'B').length
  let needA = 5 - fixedA
  let needB = 5 - fixedB

  // Fill remaining positions randomly
  const free = child.map((v, i) => v === null ? i : -1).filter(i => i >= 0)
  const shuffled = shuffle(free, rng)

  for (const idx of shuffled) {
    if (needA > 0 && (needB === 0 || rng() < 0.5)) {
      child[idx] = 'A'
      needA--
    } else {
      child[idx] = 'B'
      needB--
    }
  }

  return child as Chromosome
}

/** Swap mutation: pick two positions with different teams and swap them. */
export function mutate(
  chromosome: Chromosome,
  mutationRate: number,
  rng: () => number
): Chromosome {
  if (rng() > mutationRate) return chromosome

  const result = [...chromosome] as Chromosome
  const alphaIdx = result.map((v, i) => v === 'A' ? i : -1).filter(i => i >= 0)
  const bravoIdx = result.map((v, i) => v === 'B' ? i : -1).filter(i => i >= 0)

  if (alphaIdx.length === 0 || bravoIdx.length === 0) return result

  const ai = alphaIdx[Math.floor(rng() * alphaIdx.length)]
  const bi = bravoIdx[Math.floor(rng() * bravoIdx.length)]

  result[ai] = 'B'
  result[bi] = 'A'
  return result
}

/** Build a valid random chromosome: 5 A's and 5 B's, shuffled. */
export function randomChromosome(rng: () => number): Chromosome {
  return shuffle([...'AAAAABBBBB'].map(c => c as 'A' | 'B'), rng)
}
