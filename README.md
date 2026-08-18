# GitHub Profile Explorer

Aplicação web em React para buscar usuários do GitHub, visualizar informações do perfil e explorar seus repositórios públicos.

## Funcionalidades

- Busca de usuários pela API pública do GitHub
- Exibição de avatar, nome, bio, e-mail, seguidores e seguindo
- Listagem de repositórios públicos
- Ordenação por mais estrelas, menos estrelas, nome e atualização recente
- Página de detalhes do repositório
- Link externo para o repositório no GitHub
- Estados de carregamento, erro e lista vazia
- Layout responsivo
- Testes automatizados da listagem e ordenação de repositórios

## Tecnologias

- React
- Vite
- React Router DOM
- Context API
- Tailwind CSS
- Vitest
- Testing Library
- GitHub REST API

## Como executar

Clone o repositório:

```bash
git clone URL_DO_SEU_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd github-profile-explorer
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

Acesse o endereço exibido no terminal, normalmente:

```text
http://localhost:5173/
```

## Testes

Para executar os testes automatizados:

```bash
npm run test:run
```

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

## Estr