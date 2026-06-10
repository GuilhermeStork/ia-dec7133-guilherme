import { useGAStore } from '../store/gaStore'

function Slider({
  label, value, min, max, step, onChange, disabled, format,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; disabled: boolean; format?: (v: number) => string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span className="text-cs-yellow font-mono">{format ? format(value) : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-cs-yellow disabled:opacity-40 cursor-pointer"
      />
    </div>
  )
}

export default function Controls() {
  const { status, config, setConfig, start, pause, resume, reset } = useGAStore()
  const running = status === 'running'
  const paused = status === 'paused'
  const done = status === 'done'
  const disabled = running

  return (
    <div className="bg-cs-card border border-cs-border rounded-xl p-5 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Parâmetros</h2>

      <div className="flex flex-col gap-4">
        <Slider
          label="Tamanho da população"
          value={config.populationSize} min={50} max={500} step={10}
          onChange={v => setConfig({ populationSize: v })} disabled={disabled}
        />
        <Slider
          label="Taxa de mutação"
          value={config.mutationRate} min={0.01} max={0.5} step={0.01}
          onChange={v => setConfig({ mutationRate: v })} disabled={disabled}
          format={v => `${(v * 100).toFixed(0)}%`}
        />
        <Slider
          label="Máx. gerações"
          value={config.maxGenerations} min={50} max={1000} step={50}
          onChange={v => setConfig({ maxGenerations: v })} disabled={disabled}
        />
        <Slider
          label="Velocidade (delay ms)"
          value={config.speed} min={0} max={500} step={10}
          onChange={v => setConfig({ speed: v })} disabled={disabled}
          format={v => v === 0 ? 'máx' : `${v}ms`}
        />
      </div>

      <div className="flex gap-2 pt-1">
        {status === 'idle' || done ? (
          <button
            onClick={start}
            className="flex-1 bg-cs-yellow text-black font-bold py-2 rounded-lg hover:brightness-110 transition"
          >
            {done ? 'Nova Simulação' : 'Iniciar'}
          </button>
        ) : running ? (
          <button
            onClick={pause}
            className="flex-1 bg-yellow-600 text-black font-bold py-2 rounded-lg hover:brightness-110 transition"
          >
            Pausar
          </button>
        ) : paused ? (
          <button
            onClick={resume}
            className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:brightness-110 transition"
          >
            Retomar
          </button>
        ) : null}

        {(running || paused) && (
          <button
            onClick={reset}
            className="px-4 bg-cs-border text-gray-300 font-medium py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  )
}
