import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function RepositoryDetails() {
  const { owner, repositoryName } = useParams()
  const [repository, setRepository] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRepository() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repositoryName}`,
        )

        if (!response.ok) {
          throw new Error('Repositório não encontrado.')
        }

        const data = await response.json()
        setRepository(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadRepository()
  }, [owner, repositoryName])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        Carregando repositório...
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <Link className="text-cyan-400 hover:underline" to="/">
          ← Voltar para a busca
        </Link>

        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <section className="mx-auto max-w-2xl">
        <Link className="text-cyan-400 hover:underline" to="/">
          ← Voltar para a busca
        </Link>

        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            Repositório
          </p>

          <h1 className="mt-3 break-words text-4xl font-bold">
            {repository.name}
          </h1>

          <p className="mt-5 text-slate-300">
            {repository.description || 'Este repositório não possui descrição.'}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Estrelas</p>
              <strong className="text-xl">★ {repository.stargazers_count}</strong>
            </div>

            <div className="rounded-lg bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Linguagem principal</p>
              <strong className="text-xl">
                {repository.language || 'Não informada'}
              </strong>
            </div>
          </div>

          <a
            className="mt-8 inline-block rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            href={repository.html_url}
            rel="noreferrer"
            target="_blank"
          >
            Abrir no GitHub ↗
          </a>
        </article>
      </section>
    </main>
  )
}

export default RepositoryDetails