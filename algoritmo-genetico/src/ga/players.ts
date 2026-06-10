import type { Player } from '../types'

const PREFIXES = ['xXx', 'pr0', 'n00b', 'l33t', 'ez4', 'Top', 'GG', 'Rush', 'NaVi', 'HvH']
const NAMES = [
  'Sniper', 'Rusher', 'Lurker', 'IGL', 'Support', 'Fragger', 'AWPer',
  'Clutcher', 'Baiter', 'Flicker', 'Tapper', 'Sprayer', 'Smoker',
  'Flasher', 'Boomer', 'Stomper', 'Peeker', 'Waller', 'Cheater', 'Goat',
]
const SUFFIXES = ['_br', '_gg', '420', '47', '_cs', '_tv', 'YT', '_aim', '_pro', '']

function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, rng: () => number): number {
  return Math.round((rng() * (max - min) + min) * 10) / 10
}

export function generatePlayers(count: number, seed?: number): Player[] {
  let s = seed ?? 42
  const rng = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }

  return Array.from({ length: count }, (_, i) => {
    const prefix = PREFIXES[randInt(0, PREFIXES.length - 1, rng)]
    const name = NAMES[randInt(0, NAMES.length - 1, rng)]
    const suffix = SUFFIXES[randInt(0, SUFFIXES.length - 1, rng)]
    return {
      id: i + 1,
      nickname: `${prefix}_${name}${suffix}`,
      elo: randInt(1000, 3000, rng),
      awp: randFloat(0, 10, rng),
      entry: randFloat(0, 10, rng),
      support: randFloat(0, 10, rng),
      igl: randFloat(0, 10, rng),
      lurker: randFloat(0, 10, rng),
    }
  })
}
