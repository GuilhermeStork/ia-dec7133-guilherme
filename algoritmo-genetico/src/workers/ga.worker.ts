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

    const allPlayers = generatePlayers(50, msg.seed)
    // Pick 10 random players for this run
    const shuffled = [...allPlayers].sort(() => rng() - 0.5)
    players = shuffled.slice(0, 10)
    population = initPopulation(config, rng)
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
