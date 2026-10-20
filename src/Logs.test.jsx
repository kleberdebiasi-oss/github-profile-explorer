import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LogsProvider, useLogs } from './context/LogsContext.jsx'
import LogsPanel from './LogsPanel.jsx'
import { insertLog, listLogs, deleteLog } from './services/logs.js'

function response(data, ok = true, status = 200) {
  return { ok, status, text: async () => JSON.stringify(data), json: async () => data }
}

beforeEach(() => { localStorage.clear(); localStorage.setItem('unoesc-matricula', '123456') })

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('API de logs', () => {
  it('usa matrícula e codifica os parâmetros sem alterar o caminho da API', async () => {
    const fetch = vi.fn().mockResolvedValue(response({ erro: true, msg: '1 log foi inserido.' }))
    vi.stubGlobal('fetch', fetch)
    await insertLog('Detalhar repositório', 'owner/repo #1')
    expect(fetch.mock.calls[0][0]).toBe('https://www.piway.com.br/unoesc/api/inserir/log/123456/GitHub/Detalhar%20reposit%C3%B3rio/owner%2Frepo%20%231')
  })

  it('rejeita lista inválida e exclusão não confirmada', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ msg: 'Matrícula inválida' })))
    await expect(listLogs()).rejects.toThrow('lista de logs válida')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ msg: 'Nenhum log foi excluído.' })))
    await expect(deleteLog(12)).rejects.toThrow('não confirmou')
  })
})

function Query() {
  const { fetchGitHub } = useLogs()
  const [result, setResult] = useState('')
  return <><button onClick={async () => {
    try {
      const data = await fetchGitHub('https://api.github.com/users/test', 'Buscar perfil', (user) => user.login)
      setResult(data.login)
    } catch { setResult('Falha no GitHub') }
  }}>Consultar</button><p>{result}</p></>
}

describe('Registro após retorno do GitHub', () => {
  it('registra os dados recebidos antes de concluir a consulta', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(response({ login: 'test' }))
      .mockResolvedValueOnce(response({ msg: '1 log foi inserido.' }))
    vi.stubGlobal('fetch', fetch)
    render(<LogsProvider><Query /></LogsProvider>)
    fireEvent.click(screen.getByText('Consultar'))
    await screen.findByText('test')
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch.mock.calls[1][0]).toContain('/inserir/log/123456/GitHub/Buscar%20perfil/test')
  })

  it('mantém o resultado e mostra aviso quando só o registro falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(response({ login: 'test' }))
      .mockRejectedValueOnce(new Error('Offline')))
    render(<LogsProvider><Query /><LogsPanel /></LogsProvider>)
    fireEvent.click(screen.getByText('Consultar'))
    await screen.findByText('test')
    expect(screen.getByRole('alert')).toHaveTextContent('log não pôde ser registrado')
  })

  it('também registra respostas de erro do GitHub', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(response({ message: 'Not Found' }, false, 404))
      .mockResolvedValueOnce(response({ msg: '1 log foi inserido.' }))
    vi.stubGlobal('fetch', fetch)
    render(<LogsProvider><Query /></LogsProvider>)
    fireEvent.click(screen.getByText('Consultar'))
    await screen.findByText('Falha no GitHub')
    expect(fetch.mock.calls[1][0]).toContain(encodeURIComponent('HTTP 404: Not Found'))
  })
})

describe('Painel de logs', () => {
  const log = { idlog: 42, api: 'GitHub', metodo: 'Buscar perfil', resultado: 'Perfil encontrado: test', log: '2026-10-20 20:00:00' }

  it('lista logs e exclui apenas o registro selecionado', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(response([log]))
      .mockResolvedValueOnce(response({ erro: true, msg: '1 logs foram excluídos.' }))
      .mockResolvedValueOnce(response([]))
    vi.stubGlobal('fetch', fetch)
    render(<LogsProvider><LogsPanel /></LogsProvider>)
    fireEvent.click(screen.getByText('Ver logs de consultas'))
    await screen.findByText(log.resultado)
    fireEvent.click(screen.getByRole('button', { name: 'Excluir log 42' }))
    await screen.findByText('Nenhum log registrado.')
    expect(fetch.mock.calls[1][0]).toBe('https://www.piway.com.br/unoesc/api/excluir/log/42/aluno/123456')
  })

  it('preserva o registro e exibe erro se a exclusão falhar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(response([log]))
      .mockRejectedValueOnce(new Error('Sem conexão')))
    render(<LogsProvider><LogsPanel /></LogsProvider>)
    fireEvent.click(screen.getByText('Ver logs de consultas'))
    await screen.findByText(log.resultado)
    fireEvent.click(screen.getByRole('button', { name: 'Excluir log 42' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Sem conexão'))
    expect(screen.getByText(log.resultado)).toBeInTheDocument()
  })
})
