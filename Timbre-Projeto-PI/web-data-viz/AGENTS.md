# AGENTS.md

## Visão geral

<!-- Descreva brevemente o projeto: qual é o objetivo da aplicação, qual problema ela resolve e, se necessário, quem são os principais usuários. -->

Contexto do projeto: A música é uma forma de arte universal de expressar um arranjo de sons combinando elementos, mantendo harmonia, melodia e ritmo. Presente em todas as sociedades ela expressa valores culturais e sentimentais. Toda composição musical possui fundamentos pré-estabelecidos que se conectam e fazem sentido para quem escuta. Com base nisso, o Timbre é uma plataforma de músicas voltadas para composições clássicas, que reúne músicas de piano e outros instrumentos musicais. Além de disponibilizar conteúdo informativo e musical, a plataforma permitirá, que os usuários realizem cadastro e informem suas preferências musicais. A partir dessas informações, será possível identificar as composições e os estilos mais adorados pelo público, permitindo visualizar quantas pessoas compartilham interesses semelhantes. O objetivo do projeto é criar um site Web, que consiga cadastrar os usuários no sistema, e que guarde as informações desses usuários em um banco de dados no MySQL, e exibir esses dados em uma dashboard. 

## Tecnologias
<!-- 
Liste as principais tecnologias, frameworks, bibliotecas e serviços utilizados no projeto. -->

Dentre as principais tecnologias utilizadas no projeto está a API web-data-viz que serve para interligar e se comunicar com o site institucional e a aplicação da dashboard para a visualição dos dados extraídos. Utilização do VS Code como ambiente de desenvolvimento de código, utilização do HTML, CSS e JS, e o agente de IA OpenCode. Plataformas como github, trello e excel, também serão utilizados durante o projeto.

## Comandos

<!-- Informe os comandos necessários para trabalhar com o projeto. -->

npm install, npm start para rodar a API, 
git add ., git commit -m "", pit push, git pull para o GitHub

## Arquitetura
<!-- 
Explique como o projeto está organizado e como uma funcionalidade deve ser implementada.
Inclua informações como:
- Estrutura das principais pastas
- Responsabilidade de cada pasta
- Fluxo de uma requisição
- Onde criar novos arquivos
- Como os diretórios se relacionam -->

Organize o projeto web-data-viz seguindo a arquitetura: routers, controllers, models.
Edite os arquivos index.html, cadastro.html e login.html, mantendo a estrutura padrão do HTML (DOCTYPE, html, head e body). Implemente a interface e suas funcionalidades, separando as responsabilidades conforme a arquitetura:

- public: páginas HTML, estilos CSS e scripts JavaScript do frontend.
- routes: definição das rotas da aplicação.
- controllers: tratamento das requisições e respostas.
- models: consultas e operações relacionadas aos dados dos usuários.
- database: conexão com o banco de dados MySQL.
- app.js: configuração e inicialização do servidor.
- package.json: dependências e scripts do projeto.
- .env: variáveis de ambiente e credenciais de configuração, sem expô-las no código-fonte.

Utilize Node.js e Express no backend, conectando-o ao MySQL. Garanta que o cadastro e o login utilizem as rotas, controllers e models, com validação dos dados e armazenamento seguro das senhas por meio de hash.

## Padrões de desenvolvimento

<!-- Exemplos:
- Utilizar const por padrão e let apenas quando houver necessidade de reatribuição
- Padrão de nomenclatura para arquivos, funções e variáveis
- Padrão de commits, se aplicável -->

- Criar as variáveis com nomes de fácil entendimento, e declará-las utilizando o let para valores que podem mudar e const para valores imutáveis.
- Crie arquivos com uma nomenclatura clara, exemplo: cadastro.html, login.html, main.js
- Sempre aplique os commits antes de qualquer alteração na aplicação

## Cuidados e restrições

<!-- Liste aquilo que o agente não deve fazer ou que exige atenção antes de realizar alterações. -->

- Nunca altere a estrutura raiz do diretório web-data-viz
- Sempre me informe antes de realizar qualquer alteração
- Evite criar linhas de códigos muito extensas e de alta complexidade
- Mantenha uma boa organização do conteúdo dos arquivos
- Ao criar estrutura de pastas, mantenha uma estrutura organizada


## Regra geral: 
Antes de implementar uma alteração, siga as tecnologias, arquitetura, convenções e restrições descritas neste documento. Caso alguma informação esteja ausente, analise o código existente e siga os padrões já adotados no projeto.
