import { motion } from 'framer-motion'
import { useGAStore } from '../store/gaStore'
import type { Chromosome, Player } from '../types'

const ROLES = ['awp', 'entry', 'support', 'igl', 'lurker'] as const
const ROLE_LABELS: Record<string, string> = {
  awp: 'AWP', entry: 'Entry', support: 'Support', igl: 'IGL', lurker: 'Lurker',
}

function roleDiff(players: Player[], chrom: Chromosome, role: typeof ROLES[number]) {
  const alpha = players.filter((_, i) => chrom[i] === 'A').reduce((s, p) => s + p[role], 0)
  const bravo = players.filter((_, i) => chrom[i] === 'B').reduce((s, p) => s + p[role], 0)
  return Math.abs(alpha - bravo).toFixed(1)
}

export default function FinalResults() {
  const { status, snapshots, bestChromosome, selectedPlayers, generation, reset } = useGAStore()

  if (status !== 'done' || !bestChromosome || selectedPlayers.length === 0) return null

  const last = snapshots.at(-1)!
  const alphaElo = selectedPlayers.filter((_, i) => bestChromosome[i] === 'A').reduce((s, p) => s + p.elo, 0)
  const bravoElo = selectedPlayers.filter((_, i) => bestChromosome[i] === 'B').reduce((s, p) => s + p.elo, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-cs-card to-cs-dark border border-cs-yellow/40 rounded-xl p-6 flex flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-cs-yellow">Resultado Final</h2>
        <span className="text-xs text-gray-500">{generation} gerações executadas</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Fitness final</div>
          <div className="text-xl font-mono font-bold text-green-400">{last.best.toFixed(4)}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Diferença de Elo</div>
          <div className="text-xl font-mono font-bold text-white">{Math.abs(alphaElo - bravoElo)}</div>
        </div>
        {ROLES.map(r => (
          <div key={r} className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Δ {ROLE_LABELS[r]}</div>
            <div className="text-xl font-mono font-bold text-cs-yellow">{roleDiff(selectedPlayers, bestChromosome, r)}</div>
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="self-end bg-cs-yellow text-black font-bold px-6 py-2 rounded-lg hover:brightness-110 transition"
      >
        Nova Simulação
      </button>
    </motion.div>
  )
}
