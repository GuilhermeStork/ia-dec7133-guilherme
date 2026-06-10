import { describe, it, expect } from 'vitest'
import { initPopulation, evalPopulation, nextGeneration, makeRng } from './engine'
import { generatePlayers } from './players'
import type { GAConfig } from '../types'

const config: GAConfig = {
  populationSize: 50,
  mutationRate: 0.1,
  maxGenerations: 100,
  speed: 0,
  eliteCount: 5,
}

const players = generatePlayers(50).slice(0, 10)

describe('initPopulation', () => {
  it('creates correct population size', () => {
    const pop = initPopulation(config, makeRng(1))
    expect(pop).toHaveLength(config.populationSize)
  })

  it('every chromosome has exactly 5 A and 5 B', () => {
    const pop = initPopulation(config, makeRng(1))
    pop.forEach(c => {
      expect(c.filter(x => x === 'A').length).toBe(5)
      expect(c.filter(x => x === 'B').length).toBe(5)
    })
  })
})

describe('evalPopulation', () => {
  it('returns sorted scored array and snapshot', () => {
    const pop = initPopulation(config, makeRng(1))
    const { scored, snapshot } = evalPopulation(pop, players)
    expect(scored).toHaveLength(config.populationSize)
    expect(snapshot.best).toBeGreaterThanOrEqual(snapshot.avg)
    expect(snapshot.avg).toBeGreaterThanOrEqual(snapshot.worst)
  })
})

describe('nextGeneration', () => {
  it('preserves population size', () => {
    const rng = makeRng(42)
    const pop = initPopulation(config, rng)
    const next = nextGeneration(pop, players, config, rng)
    expect(next).toHaveLength(config.populationSize)
  })

  it('all chromosomes in next gen are valid (5A + 5B)', () => {
    const rng = makeRng(42)
    const pop = initPopulation(config, rng)
    const next = nextGeneration(pop, players, config, rng)
    next.forEach(c => {
      expect(c.filter(x => x === 'A').length).toBe(5)
      expect(c.filter(x => x === 'B').length).toBe(5)
    })
  })

  it('best fitness improves or stays equal over 20 generations', () => {
    const rng = makeRng(99)
    let pop = initPopulation(config, rng)
    const initialBest = evalPopulation(pop, players).snapshot.best

    for (let i = 0; i < 20; i++) {
      pop = nextGeneration(pop, players, config, rng)
    }

    const finalBest = evalPopulation(pop, players).snapshot.best
    expect(finalBest).toBeGreaterThanOrEqual(initialBest)
  })
})
