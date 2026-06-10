import type { Chromosome, Player } from '../types'

const ROLE_ATTRS = ['awp', 'entry', 'support', 'igl', 'lurker'] as const
type RoleAttr = typeof ROLE_ATTRS[number]

function teamStats(chromosome: Chromosome, players: Player[], team: 'A' | 'B') {
  const members = players.filter((_, i) => chromosome[i] === team)
  const elo = members.reduce((s, p) => s + p.elo, 0)
  const roles = Object.fromEntries(
    ROLE_ATTRS.map(attr => [attr, members.reduce((s, p) => s + p[attr], 0)])
  ) as Record<RoleAttr, number>
  return { elo, roles }
}

export function fitness(chromosome: Chromosome, players: Player[]): number {
  const alpha = teamStats(chromosome, players, 'A')
  const bravo = teamStats(chromosome, players, 'B')

  // Normalize elo diff: max possible diff ~5 * 2000 = 10000
  const eloDiff = Math.abs(alpha.elo - bravo.elo) / 10000

  // Normalize role diffs: each attr max diff = 5 * 10 = 50
  const roleDiff = ROLE_ATTRS.reduce((sum, attr) => {
    return sum + Math.abs(alpha.roles[attr] - bravo.roles[attr]) / 50
  }, 0) / ROLE_ATTRS.length

  // Equal weight between elo and role balance
  const penalty = 0.5 * eloDiff + 0.5 * roleDiff

  return Math.max(0, 1 - penalty)
}
