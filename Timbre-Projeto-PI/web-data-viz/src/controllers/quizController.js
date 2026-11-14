var quizModel = require("../models/quizModel");
var tentativaModel = require("../models/tentativaModel");

function listar(req, res) {
    quizModel.listarQuizzes().then(function (result) {
        res.json(result);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

async function detalhes(req, res) {
    var id = req.params.id;
    try {
        const quiz = await quizModel.obterQuizPorId(id);
        if (!quiz || quiz.length === 0) return res.status(404).send('Quiz não encontrado');

        const perguntas = await quizModel.obterPerguntasPorQuiz(id);
        for (let i = 0; i < perguntas.length; i++) {
            const alternativas = await quizModel.obterAlternativasPorPergunta(perguntas[i].id_pergunta);
            perguntas[i].alternativas = alternativas;
        }

        res.json({ quiz: quiz[0], perguntas: perguntas });
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    }
}

function iniciar(req, res) {
    var fk_quiz = req.params.id;
    // extrair id do usuário de fontes já usadas no projeto (compatível com front-end atual):
    // 1) body.fk_usuario (prática atual), 2) header 'x-user-id', 3) body.ID_USUARIO / body.idUsuario
    var fk_usuario = req.body.fk_usuario || req.headers['x-user-id'] || req.body.ID_USUARIO || req.body.idUsuario || null;
    if (!fk_usuario) return res.status(400).send('fk_usuario é obrigatório');

    tentativaModel.iniciarTentativa(fk_usuario, fk_quiz).then(function (resultado) {
        res.json({ id_tentativa: resultado.insertId });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function responder(req, res) {
    var id_tentativa = req.params.id;
    var fk_pergunta = req.body.fk_pergunta;
    var fk_alternativa = req.body.fk_alternativa || null;
    var resposta_texto = req.body.resposta_texto || null;
    var correta = req.body.correta || null;

    if (!fk_pergunta) return res.status(400).send('fk_pergunta é obrigatório');

    // validações: tentativa existe e não está concluída; pergunta e alternativa existem
    tentativaModel.obterTentativa(id_tentativa).then(function (trows) {
        if (!trows || trows.length === 0) return res.status(404).send('Tentativa não encontrada');
        var tent = trows[0];
        if (tent.estado === 'concluida') return res.status(400).send('Tentativa já concluída');

        // validar pergunta
        quizModel.existePergunta(fk_pergunta).then(function (prows) {
            if (!prows || prows.length === 0) return res.status(404).send('Pergunta não encontrada');

            if (fk_alternativa !== null) {
                quizModel.existeAlternativa(fk_alternativa).then(function (arows) {
                    if (!arows || arows.length === 0) return res.status(404).send('Alternativa não encontrada');
                    // evitar duplicidade de resposta para mesma pergunta na mesma tentativa
                    tentativaModel.existeResposta(id_tentativa, fk_pergunta).then(function (resEx) {
                        if (resEx && resEx.length > 0) return res.status(400).send('Resposta para esta pergunta já registrada');
                        // gravar resposta
                        tentativaModel.gravarResposta(id_tentativa, fk_pergunta, fk_alternativa, resposta_texto, correta).then(function (resultado) {
                            res.json(resultado);
                        }).catch(function (erro) {
                            console.log(erro);
                            res.status(500).json(erro.sqlMessage);
                        });
                    }).catch(function (erro) {
                        console.log(erro);
                        res.status(500).json(erro.sqlMessage);
                    });
                }).catch(function (erro) {
                    console.log(erro);
                    res.status(500).json(erro.sqlMessage);
                });
            } else {
                // resposta aberta
                tentativaModel.existeResposta(id_tentativa, fk_pergunta).then(function (resEx) {
                    if (resEx && resEx.length > 0) return res.status(400).send('Resposta para esta pergunta já registrada');
                    tentativaModel.gravarResposta(id_tentativa, fk_pergunta, null, resposta_texto, correta).then(function (resultado) {
                        res.json(resultado);
                    }).catch(function (erro) {
                        console.log(erro);
                        res.status(500).json(erro.sqlMessage);
                    });
                }).catch(function (erro) {
                    console.log(erro);
                    res.status(500).json(erro.sqlMessage);
                });
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function concluir(req, res) {
    var id_tentativa = req.params.id;
    tentativaModel.calcularPontuacao(id_tentativa).then(function (resultado) {
        res.json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listar,
    detalhes,
    iniciar,
    responder,
    concluir
};
