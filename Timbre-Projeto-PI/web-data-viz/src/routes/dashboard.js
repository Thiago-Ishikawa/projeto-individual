var express = require("express");
var router = express.Router();
var dashboardController = require("../controllers/dashboardController");

// Resumo por quiz
router.get('/quiz/:id/summary', function (req, res) {
    dashboardController.quizSummary(req, res);
});

// Engajamento (tentativas por dia)
router.get('/engagement', function (req, res) {
    dashboardController.engagement(req, res);
});

// Top músicas
router.get('/top/musicas', function (req, res) {
    dashboardController.topMusicas(req, res);
});

// Top compositores
router.get('/top/compositores', function (req, res) {
    dashboardController.topCompositores(req, res);
});

// Contagem de preferências por item (usado para gerar top compositores favoritos)
router.get('/preferencias', function (req, res) {
    dashboardController.preferencias(req, res);
});

module.exports = router;
