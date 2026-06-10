import { describe, it, expect } from 'vitest'
import type { Player, Chromosome, GAConfig, GAState, GenerationSnapshot } from './index'

describe('Types', () => {
  it('Player has all required fields', () => {
    const player: Player = {
      id: 1,
      nickname: 'xXx_Sniper_xXx',
      elo: 1500,
      awp: 8,
      entry: 3,
      support: 5,
      igl: 2,
      lurker: 6,
    }
    expect(player.elo).toBeGreaterThanOrEqual(1000)
    expect(player.elo).toBeLessThanOrEqual(3000)
    expect(player.awp).toBeGreaterThanOrEqual(0)
    expect(player.awp).toBeLessThanOrEqual(10)
  })

  it('Chromosome is an array of Team assignments', () => {
    const chromosome: Chromosome = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']
    const alphaCount = chromosome.filter(t => t === 'A').length
    const bravoCount = chromosome.filter(t => t === 'B').length
    expect(chromosome).toHaveLength(10)
    expect(alphaCount).toBe(5)
    expect(bravoCount).toBe(5)
  })

  it('GAConfig has correct default-range fields', () => {
    const config: GAConfig = {
      populationSize: 200,
      mutationRate: 0.05,
      maxGenerations: 300,
      speed: 50,
      eliteCount: 5,
    }
    expect(config.populationSize).toBeGreaterThanOrEqual(50)
    expect(config.mutationRate).toBeGreaterThan(0)
    expect(config.eliteCount).toBeGreaterThan(0)
  })

  it('GenerationSnapshot has generation + fitness metrics', () => {
    const snap: GenerationSnapshot = { generation: 1, best: 0.9, avg: 0.7, worst: 0.4 }
    expect(snap.best).toBeGreaterThanOrEqual(snap.avg)
    expect(snap.avg).toBeGreaterThanOrEqual(snap.worst)
  })

  it('GAState has status and collections', () => {
    const state: GAState = {
      status: 'idle',
      generation: 0,
      snapshots: [],
      bestChromosome: null,
      players: [],
      selectedPlayers: [],
      config: {
        populationSize: 200,
        mutationRate: 0.05,
        maxGenerations: 300,
        speed: 50,
        eliteCount: 5,
      },
    }
    expect(state.status).toBe('idle')
    expect(state.snapshots).toBeInstanceOf(Array)
  })
})
