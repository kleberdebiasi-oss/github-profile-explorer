import { useState } from 'react'
import { Link } from 'react-router-dom'

function RepositoryList({ repositories }) {
  const [sortBy, setSortBy] = useState('stars-desc')

  const sortedRepositories = [...repositories].sort((firstRepository, secondRepository) => {
    if (sortBy === 'stars-asc') {
      return firstRepository.stargazers_count - secondRepository.stargazers_count
    }

    if (sortBy === 'name') {
      return firstRepository.name.localeCompare(secondRepository.name)
    }

    if (sortBy === 'updated') {
      return new Date(secondRepository.updated_at) - new Date(firstRepository.updated_at)
    }

    return secondRepository.stargazers_count - firstRepository.stargazers_count
  })

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Repositórios públicos</h2>
          <p className="mt-1 text-slate-400">
            {repositories.length} repositório(s) encontrado(s)
          </p>
        </div>

        <label className="text-sm text-slate-300">
          Ordenar por
          <select
            className="ml-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="stars-desc">Mais estrelas</option>
            <option value="stars-asc">Menos estrelas</option>
            <option value="name">Nome (A-Z)</option>
            <option value="updated">Atualização recente</option>
          </select>
        </label>
      </div>

      {repositories.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4 text-slate-400">
          Este usuário não possui repositórios públicos.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {sortedRepositories.map((repository) => (
            <Link
              className="block rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-400"
              key={repository.id}
              to={`/repos/${repository.owner.login}/${repository.name}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-cyan-400">{repository.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {repository.description || 'Sem descrição disponível.'}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-sm">
                  ★ {repository.stargazers_count}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>{repository.language || 'Linguagem não informada'}</span>
                <span>
                  Atualizado em{' '}
                  {new Date(repository.updated_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default RepositoryList
