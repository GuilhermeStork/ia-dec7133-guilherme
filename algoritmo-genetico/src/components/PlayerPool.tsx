import { useState } from 'react'
import { useGAStore } from '../store/gaStore'

export default function PlayerPool() {
  const { players, selectedPlayers } = useGAStore()
  const [open, setOpen] = useState(false)
  const selectedIds = new Set(selectedPlayers.map(p => p.id))

  return (
    <div className="bg-cs-card border border-cs-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
      >
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Pool de Jogadores ({players.length})
        </h2>
        <span className="text-gray-500 text-xs">{open ? '▲ Ocultar' : '▼ Mostrar'}</span>
      </button>

      {open && (
        <div className="overflow-x-auto border-t border-cs-border">
          <table className="w-full text-xs">
            <thead className="bg-cs-dark">
              <tr className="text-gray-500">
                <th className="text-left px-4 py-2">Nick</th>
                <th className="text-right px-2 py-2">Elo</th>
                <th className="text-right px-2 py-2">AWP</th>
                <th className="text-right px-2 py-2">Entry</th>
                <th className="text-right px-2 py-2">Supp</th>
                <th className="text-right px-2 py-2">IGL</th>
                <th className="text-right px-2 py-2">Lurk</th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr
                  key={p.id}
                  className={`border-b border-cs-border/30 transition ${
                    selectedIds.has(p.id) ? 'bg-cs-yellow/10' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="px-4 py-1.5 text-gray-200 flex items-center gap-2">
                    {selectedIds.has(p.id) && <span className="text-cs-yellow text-[10px]">●</span>}
                    {p.nickname}
                  </td>
                  <td className="text-right px-2 font-mono text-gray-300">{p.elo}</td>
                  <td className="text-right px-2 font-mono text-gray-400">{p.awp.toFixed(1)}</td>
                  <td className="text-right px-2 font-mono text-gray-400">{p.entry.toFixed(1)}</td>
                  <td className="text-right px-2 font-mono text-gray-400">{p.support.toFixed(1)}</td>
                  <td className="text-right px-2 font-mono text-gray-400">{p.igl.toFixed(1)}</td>
                  <td className="text-right px-2 font-mono text-gray-400">{p.lurker.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
