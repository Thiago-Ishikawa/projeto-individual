var database = require("../database/config");

function mediaPontuacaoPorQuiz(fk_quiz) {
    var instrucao = `SELECT AVG(pontuacao) as media FROM tentativa_quiz WHERE fk_quiz = ${fk_quiz} AND estado = 'concluida'`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function totalTentativasPorQuiz(fk_quiz, dias) {
    var where = `fk_quiz = ${fk_quiz}`;
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
    var instrucao = `SELECT AVG(acertos) as media_acertos, AVG(total_perguntas) as media_total FROM tentativa_quiz WHERE fk_quiz = ${fk_quiz} AND estado = 'CONCLUIDA'`;
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
