import { useGAStore } from '../store/gaStore'

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-cs-card border border-cs-border rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-mono font-bold ${color}`}>{value}</span>
    </div>
  )
}

export default function StatsPanel() {
  const { generation, snapshots, status, config } = useGAStore()
  const last = snapshots.at(-1)
  const fmt = (v: number | undefined) => v != null ? v.toFixed(4) : '–'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Geração"
        value={status === 'idle' ? '–' : `${generation} / ${config.maxGenerations}`}
        color="text-white"
      />
      <StatCard label="Melhor fitness" value={fmt(last?.best)} color="text-green-400" />
      <StatCard label="Fitness médio" value={fmt(last?.avg)} color="text-cs-yellow" />
      <StatCard label="Pior fitness" value={fmt(last?.worst)} color="text-red-400" />
    </div>
  )
}
