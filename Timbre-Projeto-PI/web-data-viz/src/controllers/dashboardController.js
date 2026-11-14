var dashboardModel = require("../models/dashboardModel");

function quizSummary(req, res) {
    var fk_quiz = req.params.id;
    Promise.all([
        dashboardModel.mediaPontuacaoPorQuiz(fk_quiz),
        dashboardModel.totalTentativasPorQuiz(fk_quiz, req.query.dias || null)
    ]).then(function (results) {
        var media = results[0] && results[0][0] ? results[0][0].media : null;
        var total = results[1] && results[1][0] ? results[1][0].total : 0;
        res.json({ fk_quiz: fk_quiz, mediaPontuacao: media, totalTentativas: total });
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

module.exports = {
    quizSummary,
    engagement,
    topMusicas,
    topCompositores
};
