import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, ResponsiveContainer } from 'recharts'
import { useGAStore } from '../store/gaStore'
import type { Chromosome, Player } from '../types'

const ROLES = ['awp', 'entry', 'support', 'igl', 'lurker'] as const
const ROLE_LABELS: Record<string, string> = {
  awp: 'AWP', entry: 'Entry', support: 'Support', igl: 'IGL', lurker: 'Lurker',
}

function teamAvg(players: Player[], chromosome: Chromosome, team: 'A' | 'B') {
  const members = players.filter((_, i) => chromosome[i] === team)
  return Object.fromEntries(
    ROLES.map(r => [r, members.reduce((s, p) => s + p[r], 0) / members.length])
  )
}

export default function ProfileRadar() {
  const { bestChromosome, selectedPlayers } = useGAStore()

  if (!bestChromosome || selectedPlayers.length === 0) {
    return (
      <div className="bg-cs-card border border-cs-border rounded-xl p-5 flex items-center justify-center h-48 text-gray-600 text-sm">
        Radar aparecerá durante a simulação
      </div>
    )
  }

  const alpha = teamAvg(selectedPlayers, bestChromosome, 'A')
  const bravo = teamAvg(selectedPlayers, bestChromosome, 'B')

  const data = ROLES.map(r => ({
    role: ROLE_LABELS[r],
    Alpha: Number(alpha[r].toFixed(2)),
    Bravo: Number(bravo[r].toFixed(2)),
  }))

  return (
    <div className="bg-cs-card border border-cs-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
        Perfil dos Times
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="#1E2530" />
          <PolarAngleAxis dataKey="role" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Radar name="Alpha" dataKey="Alpha" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} isAnimationActive={false} />
          <Radar name="Bravo" dataKey="Bravo" stroke="#F97316" fill="#F97316" fillOpacity={0.25} isAnimationActive={false} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
