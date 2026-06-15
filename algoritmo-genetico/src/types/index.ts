export interface Player {
  id: number
  nickname: string
  elo: number      // 1000–3000
  awp: number      // 0–10
  entry: number    // 0–10
  support: number  // 0–10
  igl: number      // 0–10
  lurker: number   // 0–10
}

export type Team = 'A' | 'B' | '-'   // '-' = banco (jogador não escalado)

/**
 * Uma posição por jogador do pool completo (50). Valor 'A'/'B' = time escalado,
 * '-' = banco. Restrição: exatamente 5 'A' e 5 'B'; o restante fica no banco.
 * O AG, portanto, escolhe QUEM joga e em qual time.
 */
export type Chromosome = Team[]

export interface GAConfig {
  populationSize: number    // 50–500, default 200
  mutationRate: number      // 0.01–0.5, default 0.05
  maxGenerations: number    // 50–1000, default 300
  speed: number             // ms delay between generations, default 50
  eliteCount: number        // default 5
}

export interface GenerationSnapshot {
  generation: number
  best: number
  avg: number
  worst: number
}

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'done'

export interface GAState {
  status: SimulationStatus
  generation: number
  snapshots: GenerationSnapshot[]
  bestChromosome: Chromosome | null
  players: Player[]          // full pool of 50
  selectedPlayers: Player[]  // pool that the chromosome maps over (the full 50)
  config: GAConfig
}
