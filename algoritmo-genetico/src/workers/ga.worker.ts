import { evalPopulation, initPopulation, makeRng, nextGeneration } from '../ga/engine'
import { generatePlayers } from '../ga/players'
import type { Chromosome, GAConfig, GenerationSnapshot, Player } from '../types'

export type WorkerInMessage =
  | { type: 'START'; config: GAConfig; seed: number }
  | { type: 'UNPAUSE' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }

export type WorkerOutMessage =
  | { type: 'GENERATION'; snapshot: GenerationSnapshot; best: Chromosome; players: Player[] }
  | { type: 'DONE'; snapshot: GenerationSnapshot; best: Chromosome; players: Player[]; generations: number }

let paused = false
let stopped = false

self.onmessage = async (e: MessageEvent<WorkerInMessage>) => {
  const msg = e.data

  if (msg.type === 'PAUSE') { paused = true; return }
  if (msg.type === 'UNPAUSE') { paused = false; return }
  if (msg.type === 'STOP') { stopped = true; paused = false; return }

  if (msg.type === 'START') {
    paused = false
    stopped = false

    const config = msg.config
    const rng = makeRng(msg.type === 'START' ? msg.seed : Date.now())

    let players: Player[]
    let population: Chromosome[]
    let gen: number

    // The GA operates over the full pool: each chromosome chooses which 10
    // players are fielded (5 per team) and benches the other 40.
    players = generatePlayers(50, msg.seed)
    population = initPopulation(config, rng, players.length)
    gen = 0

    while (!stopped && gen < config.maxGenerations) {
      while (paused && !stopped) {
        await new Promise(r => setTimeout(r, 50))
      }
      if (stopped) break

      population = nextGeneration(population, players, config, rng)
      gen++

      const { scored, snapshot } = evalPopulation(population, players)
      const genSnap: GenerationSnapshot = { generation: gen, ...snapshot }

      const outMsg: WorkerOutMessage = {
        type: gen >= config.maxGenerations ? 'DONE' : 'GENERATION',
        snapshot: genSnap,
        best: scored[0].chrom,
        players,
        ...(gen >= config.maxGenerations ? { generations: gen } : {}),
      } as WorkerOutMessage

      self.postMessage(outMsg)

      if (config.speed > 0) {
        await new Promise(r => setTimeout(r, config.speed))
      }
    }
  }
}
