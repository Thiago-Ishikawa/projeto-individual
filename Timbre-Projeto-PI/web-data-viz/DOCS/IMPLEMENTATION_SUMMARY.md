# Plano Resumido — Implementação do Quiz Persistente

Objetivo
- Implementar backend mínimo para persistir resultados de um quiz no banco timbre e expor agregados para dashboard, respeitando a arquitetura existente (routes → controllers → models → database → public).

O que foi criado/alterado
- Migrations / seed:
  - web-data-viz/src/database/002_create_quiz_tables.sql — cria tabelas: quiz, pergunta, alternativa, tentativa_quiz, resposta_tentativa
  - web-data-viz/src/database/003_seed_quiz.sql — dados de exemplo (1 quiz, 3 perguntas, alternativas)

- Backend (web-data-viz/src):
  - models:
    - quizModel.js — listar/obter quiz, perguntas e alternativas; verificações de existência
    - tentativaModel.js — iniciarTentativa, gravarResposta, concluirTentativa (compatível), calcularPontuacao, obterTentativa, existeResposta
    - dashboardModel.js — consultas de agregação (média, tentativas por dia, top músicas/compositores)
    - usuarioModel.js — buscarPorId (suporte mínimo)

  - controllers:
    - quizController.js — handlers: listar, detalhes, iniciar, responder, concluir (concluir chama cálculo server-side)
    - dashboardController.js — handlers para agregados do dashboard

  - routes:
    - quiz.js — expõe /quiz, /quiz/:id, /quiz/:id/iniciar, /quiz/tentativa/:id/responder, /quiz/tentativa/:id/concluir
    - dashboard.js — expõe /dash/quiz/:id/summary, /dash/engagement, /dash/top/*

  - app.js — registrou rota /quiz e /dash no web-data-viz

- Front-end (exemplo, DOCUMENTOS_DE_APOIO):
  - DOCUMENTOS_DE_APOIO/exemplo_de_quiz/quiz.html — adaptado para usar as rotas do backend (iniciar/responder/concluir)
  - public/exemplo_quiz/style.css — adicionado estilo para o quiz
  - simulador.html atualizado para apontar para /exemplo_quiz

Principais funcionalidades implementadas
- Persistência de tentativas e respostas (tentativa_quiz, resposta_tentativa).
- Cálculo de pontuação no servidor (calcularPontuacao) e persistência em tentativa_quiz.pontuacao.
- Validações: existência de pergunta/alternativa, impedir gravação em tentativa concluída, evitar duplicidade de resposta por pergunta/tentativa.
- Endpoints de agregação para alimentar dashboard.
- Integração mínima do quiz de exemplo com o backend (front chama APIs). Também deixei opção de preencher perguntas diretamente no arquivo para testes rápidos.

Decisões e restrições
- Mantive o estilo e padrões do projeto (uso de src/database/config.js para executar SQL; queries simples por interpolação — consistente com o repositório).
- Evitei conceitos avançados solicitados: não usei ENUM ou TEXT em migrations; removi larguras de inteiro (TINYINT em vez de TINYINT(1)).
- Não alterei a arquitetura padrão do web-data-viz; arquivos novos foram adicionados em web-data-viz/src e public, e o quiz está servido via rota /exemplo_quiz.

Pendências recomendadas (próximos passos)
1. Executar migrations no banco (002_create_quiz_tables.sql) e depois o seed (003_seed_quiz.sql).
2. Integrar autenticação definitiva (extrair id do usuário autenticado em vez de confiar em header/body).
3. Parametrizar queries/prepared statements e sanitizar entradas.
4. Adicionar endpoint/validação extra: garantir que a pergunta pertence ao quiz da tentativa (há função pronta caso queira ativar).
5. Melhorias no front: exibir pontuação retornada pelo servidor; tratamento de perguntas abertas.

Comandos úteis
- Rodar migration (Windows):
  mysql -u SEU_USUARIO -p timbre < "<caminho>/web-data-viz/src/database/002_create_quiz_tables.sql"
- Rodar seed:
  mysql -u SEU_USUARIO -p timbre < "<caminho>/web-data-viz/src/database/003_seed_quiz.sql"

Teste rápido (fluxo)
1. GET /quiz/ — listar quizzes
2. GET /quiz/:id — ver perguntas/alternativas e ids
3. POST /quiz/:id/iniciar — inicia tentativa; retorna { id_tentativa }
4. POST /quiz/tentativa/:id/responder — grava resposta
5. POST /quiz/tentativa/:id/concluir — calcula e grava pontuação; retorna { pontuacao, total, corretas }

Contato
- Se desejar que eu gere scripts de teste, ajuste autenticação, ou melhore segurança (parametrização de queries), indique qual item priorizar.
