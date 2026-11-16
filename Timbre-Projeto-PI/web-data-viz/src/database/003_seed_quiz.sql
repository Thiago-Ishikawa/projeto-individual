-- Seed: cria um quiz de exemplo com perguntas e alternativas
-- Execute este arquivo após criar as tabelas (002_create_quiz_tables.sql)

INSERT INTO quiz (titulo, descricao, ativo, criado_em) VALUES
('Quiz Exemplo Timbre', 'Quiz de demonstração para testar integração backend/frontend', 1, NOW());
SET @quiz_id = LAST_INSERT_ID();

INSERT INTO pergunta (fk_quiz, texto, ordem, tipo) VALUES
(@quiz_id, 'Quem compôs a Nona Sinfonia?', 1, 'unica'),
(@quiz_id, 'Quantas teclas tem um piano acústico padrão?', 2, 'unica'),
(@quiz_id, 'Qual estilo musical você prefere?', 3, 'aberta');

-- capturar ids das perguntas (assume execução sequencial)
SET @pergunta1 = (SELECT id_pergunta FROM pergunta WHERE fk_quiz = @quiz_id ORDER BY id_pergunta LIMIT 1);
SET @pergunta2 = (SELECT id_pergunta FROM pergunta WHERE fk_quiz = @quiz_id ORDER BY id_pergunta LIMIT 1 OFFSET 1);
SET @pergunta3 = (SELECT id_pergunta FROM pergunta WHERE fk_quiz = @quiz_id ORDER BY id_pergunta LIMIT 1 OFFSET 2);

-- alternativas pergunta 1
INSERT INTO alternativa (fk_pergunta, texto, correta, ordem) VALUES
(@pergunta1, 'Ludwig van Beethoven', 1, 1),
(@pergunta1, 'Wolfgang Amadeus Mozart', 0, 2),
(@pergunta1, 'Johann Sebastian Bach', 0, 3),
(@pergunta1, 'Frédéric Chopin', 0, 4);

-- alternativas pergunta 2
INSERT INTO alternativa (fk_pergunta, texto, correta, ordem) VALUES
(@pergunta2, '55', 0, 1),
(@pergunta2, '88', 1, 2),
(@pergunta2, '85', 0, 3),
(@pergunta2, '72', 0, 4);

-- pergunta 3 é aberta: não inserir alternativas

-- nota: se ocorrer erro de FOREIGN KEY, verifique se as tabelas foram criadas e o banco selecionado
