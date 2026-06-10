import { describe, it, expect } from 'vitest'
import { fitness } from './fitness'
import type { Chromosome, Player } from '../types'

function makePlayer(id: number, elo: number, roles: number): Player {
  return { id, nickname: `p${id}`, elo, awp: roles, entry: roles, support: roles, igl: roles, lurker: roles }
}

describe('fitness', () => {
  it('returns 1 for perfectly balanced teams', () => {
    const players = [
      makePlayer(1, 2000, 5), makePlayer(2, 2000, 5),
      makePlayer(3, 2000, 5), makePlayer(4, 2000, 5),
      makePlayer(5, 2000, 5), makePlayer(6, 2000, 5),
      makePlayer(7, 2000, 5), makePlayer(8, 2000, 5),
      makePlayer(9, 2000, 5), makePlayer(10, 2000, 5),
    ]
    const chrom: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    expect(fitness(chrom, players)).toBeCloseTo(1, 5)
  })

  it('returns value between 0 and 1', () => {
    const players = Array.from({ length: 10 }, (_, i) =>
      makePlayer(i + 1, 1000 + i * 200, i)
    )
    const chrom: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    const f = fitness(chrom, players)
    expect(f).toBeGreaterThanOrEqual(0)
    expect(f).toBeLessThanOrEqual(1)
  })

  it('balanced split scores higher than unbalanced', () => {
    const players = [
      makePlayer(1, 3000, 10), makePlayer(2, 3000, 10),
      makePlayer(3, 3000, 10), makePlayer(4, 3000, 10),
      makePlayer(5, 3000, 10), makePlayer(6, 1000, 0),
      makePlayer(7, 1000, 0), makePlayer(8, 1000, 0),
      makePlayer(9, 1000, 0), makePlayer(10, 1000, 0),
    ]
    // balanced: 2 high + 3 low vs 3 high + 2 low  (not perfect but better than all-high vs all-low)
    const balanced: Chromosome =   ['A', 'A', 'B', 'B', 'B', 'A', 'A', 'A', 'B', 'B']
    const unbalanced: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    expect(fitness(balanced, players)).toBeGreaterThan(fitness(unbalanced, players))
  })
})
