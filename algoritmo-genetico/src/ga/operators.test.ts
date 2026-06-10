import { describe, it, expect } from 'vitest'
import { tournamentSelect, uniformCrossover, mutate, randomChromosome } from './operators'
import type { Chromosome, Player } from '../types'

const seededRng = (seed = 42) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function makePlayer(id: number): Player {
  return { id, nickname: `p${id}`, elo: 2000, awp: 5, entry: 5, support: 5, igl: 5, lurker: 5 }
}

const players = Array.from({ length: 10 }, (_, i) => makePlayer(i + 1))
const balanced: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']

function countTeams(c: Chromosome) {
  return { A: c.filter(x => x === 'A').length, B: c.filter(x => x === 'B').length }
}

describe('randomChromosome', () => {
  it('always has exactly 5 A and 5 B', () => {
    const rng = seededRng()
    for (let i = 0; i < 50; i++) {
      const c = randomChromosome(rng)
      expect(c).toHaveLength(10)
      expect(countTeams(c)).toEqual({ A: 5, B: 5 })
    }
  })
})

describe('tournamentSelect', () => {
  it('returns a valid chromosome from the population', () => {
    const pop = Array.from({ length: 20 }, () => randomChromosome(seededRng()))
    const selected = tournamentSelect(pop, players, 3, seededRng())
    expect(pop).toContainEqual(selected)
  })
})

describe('uniformCrossover', () => {
  it('offspring always has exactly 5 A and 5 B', () => {
    const rng = seededRng()
    const p1: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    const p2: Chromosome = ['B', 'B', 'B', 'B', 'B', 'A', 'A', 'A', 'A', 'A']
    for (let i = 0; i < 100; i++) {
      const child = uniformCrossover(p1, p2, rng)
      expect(child).toHaveLength(10)
      expect(countTeams(child)).toEqual({ A: 5, B: 5 })
    }
  })

  it('preserves positions where both parents agree', () => {
    const p1: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    const p2: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    const child = uniformCrossover(p1, p2, seededRng())
    expect(child).toEqual(p1)
  })
})

describe('mutate', () => {
  it('result always has exactly 5 A and 5 B', () => {
    const rng = seededRng()
    for (let i = 0; i < 100; i++) {
      const result = mutate(balanced, 1.0, rng)
      expect(countTeams(result)).toEqual({ A: 5, B: 5 })
    }
  })

  it('skips mutation when rate is 0', () => {
    const rng = seededRng()
    const result = mutate(balanced, 0, rng)
    expect(result).toEqual(balanced)
  })

  it('always mutates when rate is 1', () => {
    const rng = () => 0.5
    const result = mutate(balanced, 1, rng)
    expect(result).not.toEqual(balanced)
    expect(countTeams(result)).toEqual({ A: 5, B: 5 })
  })
})
