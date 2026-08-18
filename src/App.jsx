import { useState } from 'react'
import { useGitHub } from './context/GitHubContext.jsx'
import RepositoryList from './RepositoryList.jsx'
import heroImage from './assets/hero.png'
function App() {
  const [username, setUsername] = useState('')
  const { user, repositories, loading, error, searchUser } = useGitHub()

  function handleSearch(event) {
    event.preventDefault()
    searchUser(username)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <section className="relative mx-auto max-w-2xl">
  <img
    className="pointer-events-none absolute -right-10 -top-8 hidden w-44 opacity-75 sm:block"
    src={heroImage}
    alt=""
  />
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400 uppercase">
          GitHub Profile Explorer
        </p>

        <h1 className="max-w-md text-4xl font-bold sm:text-5xl">
          Encontre perfis e repositórios no GitHub
        </h1>

        <p className="mt-4 text-slate-400">
          Busque um usuário para visualizar seu perfil e seus repositórios públicos.
        </p>

        <form className="mt-8 flex gap-3" onSubmit={handleSearch}>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400"
            placeholder="Digite um usuário do GitHub"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <button
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && (
          <p className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </p>
        )}

        {user && (
          <article className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <img
                className="h-20 w-20 rounded-full border-2 border-cyan-400"
                src={user.avatar_url}
                alt={`Avatar de ${user.login}`}
              />

              <div>
                <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
                <a
                  className="text-cyan-400 hover:underline"
                  href={user.html_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  @{user.login}
                </a>
              </div>
            </div>

            <p className="mt-5 text-slate-300">
              {user.bio || 'Este usuário não possui bio disponível.'}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-3">
                <p className="text-sm text-slate-400">Seguidores</p>
                <strong className="text-xl">{user.followers}</strong>
              </div>

              <div className="rounded-lg bg-slate-800 p-3">
                <p className="text-sm text-slate-400">Seguindo</p>
                <strong className="text-xl">{user.following}</strong>
              </div>

              <div className="rounded-lg bg-slate-800 p-3">
                <p className="text-sm text-slate-400">E-mail</p>
                <strong className="break-all text-sm">
                  {user.email || 'Não disponível'}
                </strong>
              </div>
            </div>
          </article>
        )}

        {user && <RepositoryList repositories={repositories} />}
      </section>

      <footer className="mt-16 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
        <p>
          Desenvolvido por{' '}
          <a
            className="text-cyan-400 hover:underline"
            href="https://github.com/kleberdebiasi-oss"
            rel="noreferrer"
            target="_blank"
          >
            Kleber De Biasi
          </a>
        </p>

        <p className="mt-2">
          Dados fornecidos pela API pública do GitHub · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}

export default App
