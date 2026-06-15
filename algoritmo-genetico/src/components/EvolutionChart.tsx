import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useGAStore } from '../store/gaStore'

export default function EvolutionChart() {
  const { snapshots } = useGAStore()

  // Downsample for performance: show at most 300 points
  const data = snapshots.length > 300
    ? snapshots.filter((_, i) => i % Math.ceil(snapshots.length / 300) === 0)
    : snapshots

  return (
    <div className="bg-cs-card border border-cs-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
        Evolução do Fitness
      </h2>
      {snapshots.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
          Aguardando simulação…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" />
            <XAxis
              dataKey="generation"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              label={{ value: 'Geração', position: 'insideBottomRight', offset: -8, fill: '#6B7280', fontSize: 11 }}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickFormatter={v => v.toFixed(3)}
              width={48}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#12161C', border: '1px solid #1E2530', borderRadius: 8 }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(v: number) => v.toFixed(4)}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
            <Line
              type="monotone" dataKey="best" name="Melhor"
              stroke="#4ADE80" strokeWidth={2} dot={false} isAnimationActive={false}
            />
            <Line
              type="monotone" dataKey="avg" name="Média"
              stroke="#F0A500" strokeWidth={2} dot={false} isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
