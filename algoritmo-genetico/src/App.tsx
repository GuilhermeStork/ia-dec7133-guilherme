import Controls from './components/Controls'
import EducationalSection from './components/EducationalSection'
import EvolutionChart from './components/EvolutionChart'
import FinalResults from './components/FinalResults'
import PlayerPool from './components/PlayerPool'
import ProfileRadar from './components/ProfileRadar'
import StatsPanel from './components/StatsPanel'
import TeamsDisplay from './components/TeamsDisplay'

export default function App() {
  return (
    <div className="min-h-screen bg-cs-dark text-gray-100">
      {/* Header */}
      <header className="border-b border-cs-border px-6 py-4 sticky top-0 bg-cs-dark/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-cs-yellow tracking-tight">
              CS2 Matchmaking <span className="text-gray-400 font-normal">×</span> Algoritmo Genético
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Disciplina de Inteligência Artificial — UFSC
            </p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">
            5v5 · Population-based optimization
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Row 1: Controls + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <Controls />
          <div className="flex flex-col gap-4">
            <StatsPanel />
            <EvolutionChart />
          </div>
        </div>

        {/* Final results (only when done) */}
        <FinalResults />

        {/* Row 2: Teams + Radar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
          <TeamsDisplay />
          <ProfileRadar />
        </div>

        {/* Row 3: Player pool (collapsible) */}
        <PlayerPool />

        {/* Row 4: Educational section */}
        <EducationalSection />
      </main>

      <footer className="border-t border-cs-border py-4 text-center text-xs text-gray-600">
        Implementação própria do AG — sem bibliotecas de otimização
      </footer>
    </div>
  )
}
