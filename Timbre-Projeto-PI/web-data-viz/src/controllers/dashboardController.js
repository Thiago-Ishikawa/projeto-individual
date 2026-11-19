var dashboardModel = require("../models/dashboardModel");
var preferenciaModel = require("../models/preferenciaModel");

function quizSummary(req, res) {
    var fk_quiz = req.params.id;
    Promise.all([
        dashboardModel.mediaPontuacaoPorQuiz(fk_quiz),
        dashboardModel.totalTentativasPorQuiz(fk_quiz, req.query.dias || null),
        dashboardModel.mediaAcertosPorQuiz(fk_quiz)
    ]).then(function (results) {
        var media = results[0] && results[0][0] ? results[0][0].media : null;
        var total = results[1] && results[1][0] ? results[1][0].total : 0;
        var mediaAcertosRaw = results[2] && results[2][0] ? results[2][0] : null;
        var mediaAcertos = null;
        if (mediaAcertosRaw && mediaAcertosRaw.media_total && mediaAcertosRaw.media_total > 0) {
            mediaAcertos = (Number(mediaAcertosRaw.media_acertos) / Number(mediaAcertosRaw.media_total)) * 100;
        } else if (mediaAcertosRaw && mediaAcertosRaw.media_acertos !== null) {
            mediaAcertos = Number(mediaAcertosRaw.media_acertos);
        }
        res.json({ fk_quiz: fk_quiz, mediaPontuacao: media, totalTentativas: total, mediaAcertos: mediaAcertos });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function engagement(req, res) {
    var dias = req.query.dias || 30;
    dashboardModel.tentativasPorDia(dias).then(function (result) {
        res.json(result);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function topMusicas(req, res) {
    var limit = req.query.limit || 5;
    dashboardModel.topMusicas(limit).then(function (result) {
        res.json(result);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function topCompositores(req, res) {
    var limit = req.query.limit || 5;
    dashboardModel.topCompositores(limit).then(function (result) {
        res.json(result);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function preferencias(req, res) {
    // retornar tanto a lista de preferências com contagem por item quanto o total de usuários
    Promise.all([
        preferenciaModel.contarPorPreferencia(),
        preferenciaModel.contarTotalUsuariosComPreferencias()
    ]).then(function(results){
        var items = results[0] || [];
        var totalRow = (results[1] && results[1][0]) ? results[1][0] : { totalUsuarios: 0 };
        var totalUsuarios = Number(totalRow.totalUsuarios) || 0;
        res.json({ items: items, totalUsuarios: totalUsuarios });
    }).catch(function(erro){
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    quizSummary,
    engagement,
    topMusicas,
    topCompositores,
    preferencias
};
