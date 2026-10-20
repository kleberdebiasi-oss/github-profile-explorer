const BASE_URL = 'https://www.piway.com.br/unoesc/api'
export function getMatricula() {
  return localStorage.getItem('unoesc-matricula') || ''
}

export function saveMatricula(value) {
  const matricula = value.trim()
  if (!/^\d+$/.test(matricula)) throw new Error('Informe uma matrícula válida, somente com números.')
  localStorage.setItem('unoesc-matricula', matricula)
}

function studentId() {
  const matricula = getMatricula()
  if (!matricula) throw new Error('Informe sua matrícula no painel de logs.')
  return matricula
}

async function request(path) {
  const response = await fetch(`${BASE_URL}/${path}`, { cache: 'no-store' })
  const text = await response.text()
  if (!response.ok) throw new Error('Não foi possível acessar a API de logs.')
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function messageFrom(data) {
  return typeof data === 'string' ? data : JSON.stringify(data)
}

export async function insertLog(method, result) {
  const parts = [studentId(), 'GitHub', method, result].map(encodeURIComponent)
  const data = await request(`inserir/log/${parts.join('/')}`)
  if (!/1 log foi inserido/i.test(messageFrom(data))) {
    throw new Error('A API não confirmou o registro do log.')
  }
}

export async function listLogs() {
  const data = await request(`logs/${studentId()}`)
  if (!Array.isArray(data)) throw new Error('A API não retornou uma lista de logs válida.')
  return data
}

export async function deleteLog(id) {
  const data = await request(`excluir/log/${encodeURIComponent(id)}/aluno/${studentId()}`)
  if (!/\b1 logs? (?:foi|foram) exclu[ií]dos?\b/i.test(messageFrom(data))) {
    throw new Error('A API não confirmou a exclusão do log. Atualize a lista e tente novamente.')
  }
}
