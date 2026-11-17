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

    // espera total_perguntas no body (front envia a quantidade de perguntas do quiz)
    var total_perguntas = req.body.total_perguntas || req.body.totalPerguntas || null;
    if (!total_perguntas) return res.status(400).send('total_perguntas é obrigatório');

    tentativaModel.iniciarTentativa(fk_usuario, total_perguntas).then(function (resultado) {
        res.json({ id_tentativa: resultado.insertId });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function responder(req, res) {
    var id_tentativa = req.params.id;
    // agora trabalhamos com numero_pergunta e resposta_usuario
    // aceitar tanto os nomes antigos (fk_pergunta, fk_alternativa) quanto os novos
    var numero_pergunta = req.body.numero_pergunta || req.body.numeroPergunta || req.body.fk_pergunta || null;
    var resposta_usuario = req.body.resposta_usuario || req.body.resposta || null;
    var fk_alternativa = (typeof req.body.fk_alternativa !== 'undefined') ? req.body.fk_alternativa : null;
    var correta = (typeof req.body.correta !== 'undefined') ? req.body.correta : null;

    if (!numero_pergunta) return res.status(400).send('numero_pergunta é obrigatório');

    // validações simples: tentativa existe e não está concluída; evita duplicidade de resposta
    tentativaModel.obterTentativa(id_tentativa).then(function (trows) {
        if (!trows || trows.length === 0) return res.status(404).send('Tentativa não encontrada');
        var tent = trows[0];
        if (tent.estado === 'CONCLUIDA' || tent.estado === 'concluida') return res.status(400).send('Tentativa já concluída');

        // se veio fk_alternativa (front antigo), tratar como resposta_usuario e tentar inferir 'correta'
        (fk_alternativa !== null ? Promise.resolve().then(function(){
            resposta_usuario = fk_alternativa;
            // se não foi informado correta, tentar obter do quiz estático
            if (correta === null) return quizModel.existeAlternativa(fk_alternativa).then(function(arows){
                if (arows && arows.length>0) correta = arows[0].correta;
                return;
            });
            return;
        }) : Promise.resolve()).then(function(){
            return tentativaModel.existeResposta(id_tentativa, numero_pergunta);
        }).then(function (resEx) {
            if (resEx && resEx.length > 0) return res.status(400).send('Resposta para esta pergunta já registrada');
            // gravar resposta
            tentativaModel.gravarResposta(id_tentativa, numero_pergunta, resposta_usuario, correta).then(function (resultado) {
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
