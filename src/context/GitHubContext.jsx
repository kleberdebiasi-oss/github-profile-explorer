import { createContext, useContext, useState } from 'react'
import { useLogs } from './LogsContext.jsx'

const GitHubContext = createContext()

export function GitHubProvider({ children }) {
  const { fetchGitHub } = useLogs()
  const [user, setUser] = useState(null)
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function searchUser(username) {
    const normalizedUsername = username.trim()

    if (!normalizedUsername) {
      setError('Digite um nome de usuário para realizar a busca.')
      setUser(null)
      setRepositories([])
      return
    }

    try {
      setLoading(true)
      setError('')
      setUser(null)
      setRepositories([])

      const encodedUsername = encodeURIComponent(normalizedUsername)
      const [userData, repositoriesData] = await Promise.all([
        fetchGitHub(`https://api.github.com/users/${encodedUsername}`, 'Buscar perfil', (data) => `Perfil encontrado: ${data.login}`),
        fetchGitHub(
          `https://api.github.com/users/${encodedUsername}/repos?type=owner&sort=updated&direction=desc&per_page=100`,
          'Listar repositórios',
          (data) => `${data.length} repositório(s) de ${normalizedUsername}`,
        ),
      ])

      setUser(userData)
      setRepositories(repositoriesData)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GitHubContext.Provider
      value={{ user, repositories, loading, error, searchUser }}
    >
      {children}
    </GitHubContext.Provider>
  )
}

export function useGitHub() {
  return useContext(GitHubContext)
}
