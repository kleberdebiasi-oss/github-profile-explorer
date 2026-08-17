import { createContext, useContext, useState } from 'react'

const GitHubContext = createContext()

export function GitHubProvider({ children }) {
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

      const [userResponse, repositoriesResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${normalizedUsername}`),
        fetch(
          `https://api.github.com/users/${normalizedUsername}/repos?per_page=100`,
        ),
      ])

      if (!userResponse.ok) {
        throw new Error('Usuário não encontrado.')
      }

      if (!repositoriesResponse.ok) {
        throw new Error('Não foi possível carregar os repositórios.')
      }

      const userData = await userResponse.json()
      const repositoriesData = await repositoriesResponse.json()

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