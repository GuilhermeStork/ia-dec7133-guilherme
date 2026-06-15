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
  it('has exactly 5 A, 5 B and benches the rest of the pool', () => {
    const rng = seededRng()
    for (let i = 0; i < 50; i++) {
      const c = randomChromosome(rng, 50)
      expect(c).toHaveLength(50)
      expect(countTeams(c)).toEqual({ A: 5, B: 5 })
      expect(c.filter(x => x === '-').length).toBe(40)
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

  it('keeps 5 A, 5 B and 40 benched over a 50-player pool', () => {
    const rng = seededRng()
    const p1 = randomChromosome(seededRng(1), 50)
    const p2 = randomChromosome(seededRng(2), 50)
    for (let i = 0; i < 100; i++) {
      const child = uniformCrossover(p1, p2, rng)
      expect(child).toHaveLength(50)
      expect(countTeams(child)).toEqual({ A: 5, B: 5 })
      expect(child.filter(x => x === '-').length).toBe(40)
    }
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

  it('keeps 5A/5B/40 bench invariant on a 50-player pool', () => {
    const rng = seededRng(3)
    let c = randomChromosome(seededRng(5), 50)
    for (let i = 0; i < 200; i++) {
      c = mutate(c, 1.0, rng)
      expect(countTeams(c)).toEqual({ A: 5, B: 5 })
      expect(c.filter(x => x === '-').length).toBe(40)
    }
  })

  it('can substitute a benched player into the lineup', () => {
    // Force the substitution branch: rng() > rate is false (rate 1),
    // then rng() >= 0.5 picks substitution over rebalance.
    const seq = [0.0, 0.9, 0.0, 0.0]
    let i = 0
    const rng = () => seq[i++ % seq.length]
    const c = randomChromosome(seededRng(11), 50)
    const before = new Set(c.map((v, idx) => (v !== '-' ? idx : -1)).filter(x => x >= 0))
    const after = mutate(c, 1.0, rng)
    const lineup = new Set(after.map((v, idx) => (v !== '-' ? idx : -1)).filter(x => x >= 0))
    // The set of fielded players changed (someone went to the bench, someone came in)
    expect([...lineup].some(idx => !before.has(idx))).toBe(true)
  })
})
