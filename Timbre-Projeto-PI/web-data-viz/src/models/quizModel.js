var database = require("../database/config");

function listarQuizzes() {
    var instrucao = `SELECT id_quiz, titulo, descricao, ativo, criado_em FROM quiz WHERE ativo = 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function obterQuizPorId(id) {
    var instrucao = `SELECT id_quiz, titulo, descricao, ativo, criado_em FROM quiz WHERE id_quiz = ${id}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function obterPerguntasPorQuiz(idQuiz) {
    var instrucao = `SELECT id_pergunta, fk_quiz, texto, ordem, tipo FROM pergunta WHERE fk_quiz = ${idQuiz} ORDER BY ordem`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function obterAlternativasPorPergunta(idPergunta) {
    var instrucao = `SELECT id_alternativa, fk_pergunta, texto, ordem FROM alternativa WHERE fk_pergunta = ${idPergunta} ORDER BY ordem`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function existeQuiz(id) {
    var instrucao = `SELECT 1 FROM quiz WHERE id_quiz = ${id} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function existePergunta(id) {
    var instrucao = `SELECT 1 FROM pergunta WHERE id_pergunta = ${id} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function existeAlternativa(id) {
    var instrucao = `SELECT correta FROM alternativa WHERE id_alternativa = ${id} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function perguntaPertenceQuiz(idPergunta, idQuiz) {
    var instrucao = `SELECT 1 FROM pergunta WHERE id_pergunta = ${idPergunta} AND fk_quiz = ${idQuiz} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}


module.exports = {
    listarQuizzes,
    obterQuizPorId,
    obterPerguntasPorQuiz,
    obterAlternativasPorPergunta,
    existeQuiz,
    existePergunta,
    existeAlternativa
};

module.exports = {
    listarQuizzes,
    obterQuizPorId,
    obterPerguntasPorQuiz,
    obterAlternativasPorPergunta
};
