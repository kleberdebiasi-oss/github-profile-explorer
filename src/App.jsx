function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <section className="mx-auto max-w-2xl">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400 uppercase">
          GitHub Profile Explorer
        </p>

        <h1 className="text-4xl font-bold sm:text-5xl">
          Encontre perfis e repositórios no GitHub
        </h1>

        <p className="mt-4 text-slate-400">
          Busque um usuário para visualizar seu perfil e seus repositórios públicos.
        </p>

        <div className="mt-8 flex gap-3">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400"
            placeholder="Digite um usuário do GitHub"
          />
          <button className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
            Buscar
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
