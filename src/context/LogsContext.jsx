import { createContext, useCallback, useContext, useState } from 'react'
import { getMatricula, insertLog } from '../services/logs.js'

const LogsContext = createContext()

export function LogsProvider({ children }) {
  const [warning, setWarning] = useState('')
  const [revision, setRevision] = useState(0)

  const fetchGitHub = useCallback(async (url, method, summarize) => {
    if (!getMatricula()) throw new Error('Salve sua matrícula Unoesc no topo da página antes de consultar o GitHub.')
    const response = await fetch(url)
    const data = await response.json()
    try {
      await insertLog(method, response.ok ? summarize(data) : `HTTP ${response.status}: ${data.message || 'Erro'}`)
      setRevision((value) => value + 1)
    } catch {
      setWarning('A consulta ao GitHub foi realizada, mas o log não pôde ser registrado. Verifique sua conexão e tente novamente.')
    }
    if (!response.ok) throw new Error(data.message || 'Não foi possível consultar o GitHub.')
    return data
  }, [])

  return (
    <LogsContext.Provider value={{ fetchGitHub, warning, revision, dismissWarning: () => setWarning('') }}>
      {children}
    </LogsContext.Provider>
  )
}

export function useLogs() {
  return useContext(LogsContext)
}
