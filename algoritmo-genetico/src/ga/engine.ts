import type { Chromosome, GAConfig, GenerationSnapshot, Player } from '../types'
import { fitness } from './fitness'
import { mutate, randomChromosome, tournamentSelect, uniformCrossover } from './operators'

export function makeRng(seed = Date.now()): () => number {
  let s = seed & 0xffffffff
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export function initPopulation(config: GAConfig, rng: () => number): Chromosome[] {
  return Array.from({ length: config.populationSize }, () => randomChromosome(rng))
}

export function evalPopulation(
  population: Chromosome[],
  players: Player[]
): { scored: Array<{ chrom: Chromosome; score: number }>; snapshot: Omit<GenerationSnapshot, 'generation'> } {
  const scored = population.map(chrom => ({ chrom, score: fitness(chrom, players) }))
  scored.sort((a, b) => b.score - a.score)

  const scores = scored.map(s => s.score)
  const best = scores[0]
  const worst = scores[scores.length - 1]
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length

  return { scored, snapshot: { best, avg, worst } }
}

export function nextGeneration(
  population: Chromosome[],
  players: Player[],
  config: GAConfig,
  rng: () => number
): Chromosome[] {
  const { scored } = evalPopulation(population, players)

  // Elitism: carry top individuals unchanged
  const elite = scored.slice(0, config.eliteCount).map(s => s.chrom)

  const newPop: Chromosome[] = [...elite]
  const tournamentK = Math.max(2, Math.floor(population.length * 0.1))

  while (newPop.length < config.populationSize) {
    const p1 = tournamentSelect(population, players, tournamentK, rng)
    const p2 = tournamentSelect(population, players, tournamentK, rng)
    const child = uniformCrossover(p1, p2, rng)
    newPop.push(mutate(child, config.mutationRate, rng))
  }

  return newPop
}
