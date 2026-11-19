Plano de Implementação — Preferências → Dashboard
Data: 2026-11-18
Autor: OpenCode (IA assistente)

Resumo
-------
Este documento descreve um plano mínimo e reversível para garantir que as preferências dos usuários (gravadas em banco) sejam corretamente agregadas e exibidas na Dashboard como distribuição por estilos musicais e compositor favorito. O plano respeita a arquitetura existente (routes → controllers → models → public), as restrições definidas em DOCS/AGENTS.md e evita mudanças invasivas.

Contexto e Problema
--------------------
- A aplicação já armazena preferências em tabela preferencia e ligação em usuario_preferencia.
- O comportamento atual de gravação (modelo salvarParaUsuario) apaga os registros anteriores do usuário (DELETE) e insere os novos — isto faz com que o histórico seja substituído e a agregação no dashboard não some corretamente quando o objetivo for tratar cada submissão como um novo registro ou preservar histórico.
- Em mudanças anteriores, a categoria "Outros" foi removida do front-end; o cliente pediu que essa categoria não fosse apagada e que os quatro/ cinco estilos sejam apresentados separadamente com suas cores.

Objetivo
--------
1. Permitir que o sistema registre submissões de preferência sem perder histórico útil; ao mesmo tempo, manter uma forma clara de indicar o estado "ativo" das preferências atuais do usuário.
2. Atualizar a agregação usada pelo dashboard para refletir corretamente quantos usuários preferem cada estilo (cada usuário deve contar uma vez por preferência ativa).
3. Reintroduzir/garantir a visualização das categorias de estilo como fatias separadas (Clássica, Romântica, Barroca, Contemporânea e Outros quando aplicável) com cores próprias.
4. Manter alterações pequenas, localizadas e reversíveis, sem alterar a raiz da arquitetura.

Premissas e Restrições
----------------------
- Não alterar a estrutura de pastas do projeto.
- Evitar endpoints novos a não ser estritamente necessário.
- Manter ações do frontend leves e usar o endpoint /dash/preferencias já existente quando possível.
- Evitar exposição de segredos em logs ou arquivos criados.

Visão geral da solução (alto nível)
----------------------------------
1. Base de dados: adicionar coluna "ativo" (TINYINT) em usuario_preferencia para marcar quais registros representam o estado atual do usuário; manter registros antigos para histórico.
2. Modelos: alterar salvarParaUsuario para desativar registros ativos anteriores e inserir novos registros com ativo=1 (sem DELETE em massa). Deduplicar preferências no server-side antes do insert.
3. Queries: alterar contarPorPreferencia para filtrar ativo=1 e usar COUNT(DISTINCT fk_preferencia_usuario) para evitar duplicação por usuário.
4. Controller: manter a mesma rota POST /preferencias/usuario/:id; após salvar, emitir evento socket.io 'prefs:updated' para dashboards ativos (io já está disponível em app.js).
5. Frontend dashboard: carregar /dash/preferencias e mapear preferências para gêneros (matching com sinônimos); exibir separadamente Clássica, Romântica, Barroca, Contemporânea e Outros (quando apropriado). Atualizar KPI do estilo preferido.
6. Testes e verificação: passos manuais e casos de teste para garantir que múltiplas submissões de um mesmo usuário não gerem duplicatas na contagem final exibida.

Detalhamento técnico (passos mínimos)
----------------------------------

Passo A — Migração mínima no banco
1) Adicionar coluna ativo:
   ALTER TABLE usuario_preferencia ADD COLUMN ativo TINYINT(1) NOT NULL DEFAULT 1;
2) (Opcional) Marcar existentes como ativos por padrão:
   UPDATE usuario_preferencia SET ativo = 1;

Observação: este passo é reversível (ALTER TABLE DROP COLUMN ativo) mas exija cautela em produção: faça backup antes.

Passo B — Model (src/models/preferenciaModel.js)
1) Modificar salvarParaUsuario:
   - Em vez de DELETE, executar UPDATE usuario_preferencia SET ativo = 0 WHERE fk_preferencia_usuario = ${idUsuario} AND ativo = 1;
   - Dedupe o array de preferências no servidor (Array.from(new Set(...))).
   - Inserir novos registros com ativo = 1: INSERT INTO usuario_preferencia (fk_preferencia_usuario, fk_preferencia, data_registro, ativo) VALUES (..., NOW(), 1);
2) Modificar listarPorUsuario para filtrar up.ativo = 1.
3) Modificar contarPorPreferencia (ou criar) com SQL:
   SELECT p.id_preferencia, p.nome, p.descricao,
          COUNT(DISTINCT up.fk_preferencia_usuario) AS total
   FROM preferencia p
   LEFT JOIN usuario_preferencia up
     ON up.fk_preferencia = p.id_preferencia AND up.ativo = 1
   GROUP BY p.id_preferencia, p.nome, p.descricao
   ORDER BY total DESC;

Motivo: COUNT(DISTINCT ...) garante que cada usuário conte no máximo uma vez por preferência mesmo que haja eventos históricos.

Passo C — Controller (src/controllers/preferenciaController.js)
1) Manter interface POST /preferencias/usuario/:id.
2) Após sucesso no model, emitir evento socket: var io = req.app.get('io'); if(io) io.emit('prefs:updated', { usuario: id });

Passo D — Frontend (public/dashboard.html)
1) Reintroduzir 'Outros' no array de gêneros (opcional, se preferir manter 5 fatias). Caso contrário, manter 4 estilos separados e mapear não-correspondentes para 'Outros' se desejado.
2) Ao carregar /dash/preferencias, usar a query retornada (que já considera up.ativo = 1) e computar distribuição por gênero. Certificar que o mapping por sinônimos cobrirá variações (ex.: "músicas clássicas e instrumentais" → Clássica).
3) Exibir KPI com o estilo preferido (nome + %).
4) Ouvir evento socket 'prefs:updated' para recarregar as estatísticas automaticamente.

Passo E — Testes (manual)
1) Base: backup do banco.
2) Inserir/atualizar preferências para um usuário A: POST com [1,2]. Verificar:
   - Tabela usuario_preferencia: registros anteriores marcados ativo=0, novos com ativo=1.
   - GET /preferencias/usuario/A retorna preferências ativas.
3) Inserir para usuário B e verificar a contagem agregada por COUNT(DISTINCT) no endpoint /dash/preferencias.
4) Abrir dashboard em duas abas; alterar preferências em uma; confirmar atualização automática na outra.

Rollback
--------
- Reverter alterações no model: restaurar salvarParaUsuario original (usar git para reverter).
- Reverter migration: ALTER TABLE usuario_preferencia DROP COLUMN ativo; (após avaliar impacto).

Índices e performance (recomendado)
---------------------------------
Criar índices para leitura rápida nas consultas do dashboard:
  CREATE INDEX ix_usuario_pref_user_ativo ON usuario_preferencia(fk_preferencia_usuario, ativo);
  CREATE INDEX ix_usuario_pref_pref_ativo ON usuario_preferencia(fk_preferencia, ativo);

Riscos e mitigação
------------------
- Crescimento da tabela usuario_preferencia (histórico): mitigação por housekeeping (rotina de arquivamento/remoção de histórico antigos) e monitoramento.
- Contagem errada por duplicados: COUNT(DISTINCT) e marcação de ativo mitigam.
- Mudança em produção sem backup: não aplicar sem backup e sem testes em staging.

Critérios de aceitação
----------------------
- Ao salvar preferências o banco preserva registros antigos (ativo=0) e cria novos com ativo=1.
- O endpoint /dash/preferencias retorna a contagem de usuários por preferência sem duplicação (cada usuário conta uma vez por preferência).
- Dashboard exibe separadamente Clássica, Romântica, Barroca, Contemporânea (e 'Outros' se acordado) com suas cores e indica o estilo preferido.
- Atualização em tempo real por socket funciona: salvar em /preferencias/usuario/:id dispara atualização na dashboard.

Estimativa e próximos passos
---------------------------
- Tempo estimado: 1.5–3 horas para aplicar migração e mudanças no model/controller e testes em ambiente local; +0.5–1h para ajustar frontend e validar.
- Próximo passo sugerido: autorize a aplicação do SQL de migração em ambiente de desenvolvimento (fazer backup), depois aplicar as mudanças no model e controller; por fim ajustar o front-end e validar os testes acima.
