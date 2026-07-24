import { Header } from './components/layout/Header'

function App() {
  return (
    <>
      <Header />

      <main id="inicio" className="min-h-[180vh] bg-pieta-ivory">
        {/* Área temporária vazia para validar a transição do header durante o scroll.
            Será substituída quando o hero for implementado. */}
        <div className="h-[180vh]" aria-hidden="true" />
      </main>
    </>
  )
}

export default App
