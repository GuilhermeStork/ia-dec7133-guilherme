import { useGAStore } from '../store/gaStore'
import type { Chromosome, Player } from '../types'

function attr(v: number) {
  return (
    <span className={`font-mono text-xs ${v >= 7 ? 'text-green-400' : v >= 4 ? 'text-yellow-300' : 'text-red-400'}`}>
      {v.toFixed(1)}
    </span>
  )
}

function TeamCard({
  name, players, chromosome, team, color,
}: {
  name: string; players: Player[]; chromosome: Chromosome; team: 'A' | 'B'; color: string
}) {
  const members = players.filter((_, i) => chromosome[i] === team)
  const totalElo = members.reduce((s, p) => s + p.elo, 0)

  return (
    <div className={`bg-cs-card border rounded-xl p-4 flex flex-col gap-3 flex-1 ${color}`}>
      <div className="flex items-center justify-between">
        <span className={`font-bold text-base ${team === 'A' ? 'text-cs-alpha' : 'text-cs-bravo'}`}>
          {name}
        </span>
        <span className="text-xs text-gray-400 font-mono">Elo total: {totalElo}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-cs-border">
              <th className="text-left py-1 pr-2">Nick</th>
              <th className="text-right px-1">Elo</th>
              <th className="text-right px-1">AWP</th>
              <th className="text-right px-1">Entry</th>
              <th className="text-right px-1">Supp</th>
              <th className="text-right px-1">IGL</th>
              <th className="text-right px-1">Lurk</th>
            </tr>
          </thead>
          <tbody>
            {members.map(p => (
              <tr key={p.id} className="border-b border-cs-border/40 hover:bg-white/5 transition">
                <td className="py-1 pr-2 text-gray-200 truncate max-w-[100px]">{p.nickname}</td>
                <td className="text-right px-1 font-mono text-gray-300">{p.elo}</td>
                <td className="text-right px-1">{attr(p.awp)}</td>
                <td className="text-right px-1">{attr(p.entry)}</td>
                <td className="text-right px-1">{attr(p.support)}</td>
                <td className="text-right px-1">{attr(p.igl)}</td>
                <td className="text-right px-1">{attr(p.lurker)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function TeamsDisplay() {
  const { bestChromosome, selectedPlayers, status } = useGAStore()

  if (!bestChromosome || selectedPlayers.length === 0) {
    return (
      <div className="bg-cs-card border border-cs-border rounded-xl p-5 flex items-center justify-center h-40 text-gray-600 text-sm">
        Times aparecerão aqui durante a simulação
      </div>
    )
  }

  const alphaElo = selectedPlayers.filter((_, i) => bestChromosome[i] === 'A').reduce((s, p) => s + p.elo, 0)
  const bravoElo = selectedPlayers.filter((_, i) => bestChromosome[i] === 'B').reduce((s, p) => s + p.elo, 0)
  const eloDiff = Math.abs(alphaElo - bravoElo)
  const balanced = eloDiff < 200

  return (
    <div className="flex flex-col gap-3">
      {status !== 'idle' && (
        <div className={`text-center text-xs px-3 py-1.5 rounded-lg ${
          balanced ? 'bg-green-900/40 text-green-400 border border-green-700' : 'bg-yellow-900/40 text-yellow-400 border border-yellow-700'
        }`}>
          Diferença de Elo: <strong>{eloDiff}</strong>{balanced ? ' — Times equilibrados!' : ''}
        </div>
      )}
      <div className="flex gap-3 flex-col md:flex-row">
        <TeamCard
          name="Team Alpha" players={selectedPlayers}
          chromosome={bestChromosome} team="A"
          color="border-cs-alpha/40"
        />
        <TeamCard
          name="Team Bravo" players={selectedPlayers}
          chromosome={bestChromosome} team="B"
          color="border-cs-bravo/40"
        />
      </div>
    </div>
  )
}
