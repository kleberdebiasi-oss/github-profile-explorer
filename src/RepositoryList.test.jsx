import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RepositoryList from './RepositoryList.jsx'
afterEach(cleanup)
const repositories = [
  {
    id: 1,
    name: 'Projeto Popular',
    description: 'Repositório com mais estrelas',
    stargazers_count: 100,
    language: 'JavaScript',
    updated_at: '2026-08-17T10:00:00Z',
    owner: { login: 'usuario-teste' },
  },
  {
    id: 2,
    name: 'Alpha Projeto',
    description: 'Repositório em ordem alfabética',
    stargazers_count: 10,
    language: 'React',
    updated_at: '2026-08-16T10:00:00Z',
    owner: { login: 'usuario-teste' },
  },
]

function renderComponent() {
  render(
    <MemoryRouter>
      <RepositoryList repositories={repositories} />
    </MemoryRouter>,
  )
}

describe('RepositoryList', () => {
  it('ordena os repositórios por estrelas de forma decrescente por padrão', () => {
    renderComponent()

    const repositoryLinks = screen.getAllByRole('link')

    expect(repositoryLinks[0]).toHaveTextContent('Projeto Popular')
    expect(repositoryLinks[1]).toHaveTextContent('Alpha Projeto')
  })

  it('permite ordenar os repositórios por nome', () => {
    renderComponent()

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'name' },
    })

    const repositoryLinks = screen.getAllByRole('link')

    expect(repositoryLinks[0]).toHaveTextContent('Alpha Projeto')
  })
})