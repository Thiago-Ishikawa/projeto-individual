var database = require("../database/config");

function iniciarTentativa(fk_usuario, fk_quiz) {
    var instrucao = `INSERT INTO tentativa_quiz (fk_usuario, fk_quiz, inicio, estado) VALUES (${fk_usuario}, ${fk_quiz}, NOW(), 'em_andamento')`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function gravarResposta(fk_tentativa, fk_pergunta, fk_alternativa, resposta_texto, correta) {
    var instrucao = `INSERT INTO resposta_tentativa (fk_tentativa, fk_pergunta, fk_alternativa, resposta_texto, correta, respondido_em) VALUES (${fk_tentativa}, ${fk_pergunta}, ${fk_alternativa === null ? 'NULL' : fk_alternativa}, ${resposta_texto === null ? 'NULL' : "'"+resposta_texto+"'"}, ${correta === null ? 'NULL' : correta}, NOW())`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function existeResposta(fk_tentativa, fk_pergunta) {
    var instrucao = `SELECT 1 FROM resposta_tentativa WHERE fk_tentativa = ${fk_tentativa} AND fk_pergunta = ${fk_pergunta} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function concluirTentativa(id_tentativa, termino, pontuacao) {
    var instrucao = `UPDATE tentativa_quiz SET termino = ${termino ? "NOW()" : 'NULL'}, pontuacao = ${pontuacao === null ? 'NULL' : pontuacao}, estado = 'concluida' WHERE id_tentativa = ${id_tentativa}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function calcularPontuacao(id_tentativa) {
    var instrucao = `SELECT rt.fk_pergunta, rt.fk_alternativa, a.correta FROM resposta_tentativa rt LEFT JOIN alternativa a ON rt.fk_alternativa = a.id_alternativa WHERE rt.fk_tentativa = ${id_tentativa}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao).then(function (rows) {
        if (!rows || rows.length === 0) {
            return { pontuacao: 0, total: 0, corretas: 0 };
        }

        var mapaQuestoes = {};
        rows.forEach(function (r) {
            var q = r.fk_pergunta;
            if (!mapaQuestoes[q]) mapaQuestoes[q] = { correta: false };
            if (r.correta === 1) mapaQuestoes[q].correta = true;
        });

        var total = Object.keys(mapaQuestoes).length;
        var corretas = 0;
        for (var k in mapaQuestoes) if (mapaQuestoes[k].correta) corretas++;

        var pontuacao = 0;
        if (total > 0) pontuacao = (corretas / total) * 100;
        pontuacao = Math.round(pontuacao * 100) / 100;

        var upd = `UPDATE tentativa_quiz SET termino = NOW(), pontuacao = ${pontuacao}, estado = 'concluida' WHERE id_tentativa = ${id_tentativa}`;
        console.log("Executando a instrução SQL: \n" + upd);
        return database.executar(upd).then(function () {
            return { pontuacao: pontuacao, total: total, corretas: corretas };
        });
    });
}

function obterTentativa(id_tentativa) {
    var instrucao = `SELECT id_tentativa, fk_usuario, fk_quiz, inicio, termino, pontuacao, estado FROM tentativa_quiz WHERE id_tentativa = ${id_tentativa} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    iniciarTentativa,
    gravarResposta,
    concluirTentativa,
    calcularPontuacao,
    obterTentativa
};

module.exports = {
    iniciarTentativa,
    gravarResposta,
    concluirTentativa,
    calcularPontuacao
};
