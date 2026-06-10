import { create } from 'zustand'
import { generatePlayers } from '../ga/players'
import type { Chromosome, GAConfig, GAState, GenerationSnapshot, Player } from '../types'
import type { WorkerOutMessage } from '../workers/ga.worker'

const DEFAULT_CONFIG: GAConfig = {
  populationSize: 200,
  mutationRate: 0.05,
  maxGenerations: 300,
  speed: 30,
  eliteCount: 5,
}

interface GAStore extends GAState {
  config: GAConfig
  setConfig: (partial: Partial<GAConfig>) => void
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

let worker: Worker | null = null

function createWorker(): Worker {
  return new Worker(new URL('../workers/ga.worker.ts', import.meta.url), { type: 'module' })
}

export const useGAStore = create<GAStore>((set, get) => ({
  status: 'idle',
  generation: 0,
  snapshots: [],
  bestChromosome: null,
  players: generatePlayers(50),
  selectedPlayers: [],
  config: DEFAULT_CONFIG,

  setConfig: (partial) => set(s => ({ config: { ...s.config, ...partial } })),

  start: () => {
    if (worker) { worker.terminate(); worker = null }

    worker = createWorker()
    const config = get().config
    const seed = Date.now()

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data
      if (msg.type === 'GENERATION') {
        set(s => ({
          generation: msg.snapshot.generation,
          snapshots: [...s.snapshots, msg.snapshot],
          bestChromosome: msg.best,
          selectedPlayers: msg.players,
        }))
      } else if (msg.type === 'DONE') {
        set(s => ({
          status: 'done',
          generation: msg.snapshot.generation,
          snapshots: [...s.snapshots, msg.snapshot],
          bestChromosome: msg.best,
          selectedPlayers: msg.players,
        }))
        worker?.terminate()
        worker = null
      }
    }

    set({ status: 'running', generation: 0, snapshots: [], bestChromosome: null, selectedPlayers: [] })
    worker.postMessage({ type: 'START', config, seed })
  },

  pause: () => {
    worker?.postMessage({ type: 'PAUSE' })
    set({ status: 'paused' })
  },

  resume: () => {
    if (!worker || get().status !== 'paused') return
    worker.postMessage({ type: 'UNPAUSE' })
    set({ status: 'running' })
  },

  reset: () => {
    worker?.postMessage({ type: 'STOP' })
    worker?.terminate()
    worker = null
    set({
      status: 'idle',
      generation: 0,
      snapshots: [],
      bestChromosome: null,
      selectedPlayers: [],
      players: generatePlayers(50),
    })
  },
}))

export type { GenerationSnapshot, Chromosome, Player, GAConfig }
