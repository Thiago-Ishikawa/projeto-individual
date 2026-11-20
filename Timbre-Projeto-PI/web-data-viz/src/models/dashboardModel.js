var database = require("../database/config");

function _quizConcluidasFilter(fk_quiz) {
    // garantir que tentativas sem fk_quiz preenchido (legado/migração) continuam sendo contadas
    var quizId = Number(fk_quiz);
    if (!Number.isFinite(quizId)) quizId = 0;
    return `COALESCE(fk_quiz, ${quizId}) = ${quizId} AND estado = 'CONCLUIDA'`;
}

function mediaPontuacaoPorQuiz(fk_quiz) {
    var where = _quizConcluidasFilter(fk_quiz);
    var instrucao = `SELECT AVG(pontuacao) as media FROM tentativa_quiz WHERE ${where}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function totalTentativasPorQuiz(fk_quiz, dias) {
    var where = _quizConcluidasFilter(fk_quiz);
    if (dias) where += ` AND inicio >= DATE_SUB(NOW(), INTERVAL ${dias} DAY)`;
    var instrucao = `SELECT COUNT(*) as total FROM tentativa_quiz WHERE ${where}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function tentativasPorDia(dias) {
    var instrucao = `SELECT DATE(inicio) as dia, COUNT(*) as total FROM tentativa_quiz WHERE inicio >= DATE_SUB(NOW(), INTERVAL ${dias} DAY) GROUP BY DATE(inicio) ORDER BY DATE(inicio)`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function topMusicas(limit) {
    limit = limit || 5;
    var instrucao = `SELECT m.id_musica, m.titulo, COUNT(a.id_acesso) as acessos FROM acesso_musica a JOIN musica m ON a.fk_musica = m.id_musica GROUP BY m.id_musica ORDER BY acessos DESC LIMIT ${limit}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function topCompositores(limit) {
    limit = limit || 5;
    var instrucao = `SELECT c.id_compositor, c.nome, COUNT(a.id_acesso) as acessos FROM acesso_musica a JOIN musica m ON a.fk_musica = m.id_musica JOIN compositor c ON m.fk_compositor = c.id_compositor GROUP BY c.id_compositor ORDER BY acessos DESC LIMIT ${limit}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function mediaAcertosPorQuiz(fk_quiz) {
    var where = _quizConcluidasFilter(fk_quiz);
    var instrucao = `
        SELECT
            CASE WHEN IFNULL(SUM(total_perguntas), 0) = 0
                 THEN 0
                 ELSE (SUM(acertos) / SUM(total_perguntas)) * 100
            END AS media_acertos,
            SUM(total_perguntas) AS total_perguntas
        FROM tentativa_quiz
        WHERE ${where}
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    mediaPontuacaoPorQuiz,
    totalTentativasPorQuiz,
    tentativasPorDia,
    topMusicas,
    topCompositores,
    mediaAcertosPorQuiz
};
