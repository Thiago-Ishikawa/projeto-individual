var database = require("../database/config");

// Garantir que a coluna total_perguntas exista (correção simples caso a migration
// não tenha sido aplicada no banco). Tentativa não é crítica se falhar (ex.: coluna
// já existe) — apenas ignoramos o erro.
database.executar("ALTER TABLE tentativa_quiz ADD COLUMN total_perguntas INT NOT NULL DEFAULT 0").catch(function (err) {
    // silenciosamente ignorar erros (como "Column already exists") para não
    // interromper a inicialização; log para diagnóstico leve.
    console.log("ALTER TABLE tentativa_quiz: ", err && err.code ? err.code : err);
});
// garantir fk_quiz existe (nullable para compatibilidade retroativa)
database.executar("ALTER TABLE tentativa_quiz ADD COLUMN fk_quiz INT NULL").catch(function (err) {
    // ignorar erro se coluna já existir
    if (err && err.code && (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_CANT_ADD_COLUMN')) {
        console.log('fk_quiz já existe ou não pode ser adicionada:', err.code);
    } else {
        console.log('ALTER TABLE tentativa_quiz (fk_quiz):', err && err.code ? err.code : err);
    }
});

function iniciarTentativa(fk_usuario, total_perguntas, fk_quiz) {
    // total_perguntas e fk_quiz devem ser informados pelo front-end ao iniciar a tentativa
    var fkQuizValue = (typeof fk_quiz === 'number' || !isNaN(Number(fk_quiz))) ? Number(fk_quiz) : null;
    var instrucao = `INSERT INTO tentativa_quiz (fk_usuario, fk_quiz, inicio, total_perguntas, estado, acertos, erros, pontuacao) VALUES (${fk_usuario}, ${fkQuizValue === null ? 'NULL' : fkQuizValue}, NOW(), ${total_perguntas}, 'EM_ANDAMENTO', 0, 0, 0)`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function gravarResposta(fk_tentativa, numero_pergunta, resposta_usuario, correta) {
    // correta deve ser 1 ou 0 quando conhecida; para respostas abertas pode ser NULL
    var instrucao = `INSERT INTO resposta_quiz (fk_tentativa, numero_pergunta, resposta_usuario, correta, respondido_em) VALUES (${fk_tentativa}, ${numero_pergunta}, ${resposta_usuario === null ? 'NULL' : "'"+resposta_usuario+"'"}, ${correta === null ? 'NULL' : correta}, NOW())`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function existeResposta(fk_tentativa, numero_pergunta) {
    var instrucao = `SELECT 1 FROM resposta_quiz WHERE fk_tentativa = ${fk_tentativa} AND numero_pergunta = ${numero_pergunta} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function concluirTentativa(id_tentativa, acertos, erros, pontuacao) {
    var instrucao = `UPDATE tentativa_quiz SET termino = NOW(), acertos = ${acertos}, erros = ${erros}, pontuacao = ${pontuacao}, estado = 'CONCLUIDA' WHERE id_tentativa = ${id_tentativa}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function calcularPontuacao(id_tentativa) {
    // calcula acertos/erros a partir da tabela resposta_quiz
    var instrucao = `SELECT COUNT(*) as total_respostas, SUM(CASE WHEN correta = 1 THEN 1 ELSE 0 END) as corretas FROM resposta_quiz WHERE fk_tentativa = ${id_tentativa}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao).then(function (rows) {
        var total_respostas = (rows && rows[0]) ? rows[0].total_respostas : 0;
        var corretas = (rows && rows[0] && rows[0].corretas) ? rows[0].corretas : 0;

        // obter total_perguntas da tentativa
        var instr2 = `SELECT total_perguntas FROM tentativa_quiz WHERE id_tentativa = ${id_tentativa} LIMIT 1`;
        return database.executar(instr2).then(function (trows) {
            var total_perguntas = (trows && trows[0]) ? trows[0].total_perguntas : total_respostas;
            var erros = total_respostas - corretas;
            var pontuacao = 0;
            if (total_perguntas > 0) pontuacao = (corretas / total_perguntas) * 100;
            pontuacao = Math.round(pontuacao * 100) / 100;

            return concluirTentativa(id_tentativa, corretas, erros, pontuacao).then(function () {
                return { pontuacao: pontuacao, total: total_perguntas, corretas: corretas, erros: erros };
            });
        });
    });
}

function obterTentativa(id_tentativa) {
    var instrucao = `SELECT id_tentativa, fk_usuario, inicio, termino, acertos, erros, total_perguntas, pontuacao, estado FROM tentativa_quiz WHERE id_tentativa = ${id_tentativa} LIMIT 1`;
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
