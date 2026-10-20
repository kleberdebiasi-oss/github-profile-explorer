import { useEffect, useRef, useState } from 'react'
import { useLogs } from './context/LogsContext.jsx'
import { deleteLog, listLogs, getMatricula, saveMatricula } from './services/logs.js'

export default function LogsPanel() {
  const { warning, revision, dismissWarning } = useLogs()
  const [open, setOpen] = useState(false)
  const [matricula, setMatricula] = useState(getMatricula)
  const [configured, setConfigured] = useState(() => Boolean(getMatricula()))
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const requestId = useRef(0)

  useEffect(() => {
    if (!open || !configured) return
    const current = ++requestId.current
    let active = true
    setLoading(true)
    setError('')
    listLogs().then((data) => {
      if (active && current === requestId.current) setLogs(data)
    }).catch((failure) => {
      if (active && current === requestId.current) setError(failure.message)
    }).finally(() => {
      if (active && current === requestId.current) setLoading(false)
    })
    return () => { active = false }
  }, [open, revision, refresh, configured])

  async function handleDelete(id) {
    setDeleting(id)
    setError('')
    try {
      await deleteLog(id)
      setLogs((previous) => previous.filter((log) => log.idlog !== id))
      setRefresh((value) => value + 1)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setDeleting(null)
    }
  }

  const buttonClass = 'rounded-lg border border-slate-600 px-4 py-2 text-sm hover:border-cyan-400 disabled:opacity-50'
  return (
    <aside className="border-b border-slate-800 bg-slate-950 px-4 py-5 text-slate-100">
      <div className="mx-auto max-w-2xl">
        {!configured && <form className="mb-4 flex flex-wrap items-end gap-3" onSubmit={(event) => {
          event.preventDefault()
          try {
            saveMatricula(matricula)
            setConfigured(true)
            setError('')
            dismissWarning()
          } catch (failure) { setError(failure.message) }
        }}>
          <label className="text-sm">Matrícula Unoesc para registrar suas consultas
            <input className="mt-2 block rounded-lg border border-slate-600 bg-slate-900 px-3 py-2" inputMode="numeric" pattern="[0-9]+" required value={matricula} onChange={(event) => setMatricula(event.target.value)} />
          </label>
          <button className={buttonClass}>Salvar matrícula</button>
        </form>}
        {!configured && error && <p role="alert" className="mb-3 text-red-300">{error}</p>}
        <button className={buttonClass} type="button" aria-expanded={open} aria-controls="api-logs" onClick={() => setOpen(!open)}>
          {open ? 'Ocultar logs' : 'Ver logs de consultas'}
        </button>
        {warning && <div role="alert" className="mt-4 rounded-lg border border-amber-500 p-3 text-amber-200">
          <p>{warning}</p>
          <button className="mt-2 underline" onClick={dismissWarning}>Fechar aviso</button>
        </div>}
        {open && !configured && <p className="mt-3">Salve sua matrícula para visualizar os logs.</p>}
        {open && configured && <section id="api-logs" aria-labelledby="logs-heading" className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="logs-heading" className="text-xl font-bold">Histórico de consultas</h2>
            <button className={buttonClass} disabled={loading || deleting !== null} onClick={() => setRefresh((value) => value + 1)}>Atualizar logs</button>
          </div>
          {error && <p role="alert" className="mt-3 text-red-300">{error}</p>}
          {loading ? <p role="status" className="mt-3">Carregando logs...</p> : !error && logs.length === 0 ? <p className="mt-3 text-slate-400">Nenhum log registrado.</p> : null}
          {!loading && <ul className="mt-4 space-y-3">
            {logs.map((log) => <li key={log.idlog} className="rounded-lg border border-slate-700 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 break-words">
                  <h3 className="font-semibold text-cyan-300">{log.api} · {log.metodo}</h3>
                  <p className="mt-2 whitespace-pre-wrap">{log.resultado}</p>
                  <p className="mt-2 text-sm text-slate-400">{log.log} · Log #{log.idlog}</p>
                </div>
                <button className={`${buttonClass} text-red-300`} disabled={deleting !== null} onClick={() => handleDelete(log.idlog)} aria-label={`Excluir log ${log.idlog}`}>
                  {deleting === log.idlog ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </li>)}
          </ul>}
        </section>}
      </div>
    </aside>
  )
}
