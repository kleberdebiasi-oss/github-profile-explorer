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
- Registro automático de cada resposta do GitHub na API de logs da Unoesc
- Painel para visualizar, atualizar e excluir logs individualmente

## Avaliação A1.2 — Parte 2

Antes de buscar um usuário, informe e salve sua matrícula Unoesc no topo da página. Ela fica armazenada apenas no navegador usado e é enviada à API do trabalho para identificar seus registros. A integração utiliza as rotas da [documentação da API de logs](https://www.piway.com.br/unoesc/api/doc.html).

Cada consulta de perfil, listagem de repositórios e detalhe de repositório registra seu retorno (inclusive respostas de erro HTTP). Falhas no serviço de logs geram um aviso sem impedir a exibição dos dados do GitHub. O botão **Ver logs de consultas**, disponível em todas as páginas, permite listar, atualizar e excluir cada registro. A listagem é atualizada quando novos logs são registrados. As operações da própria API de logs não geram novos logs.

Para verificar manualmente: busque um usuário, abra um repositório, confira os três registros no painel e exclua um deles. Reabra o painel para confirmar a exclusão no servidor.

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
git clone https://github.com/kleberdebiasi-oss/github-profile-explorer.git
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
