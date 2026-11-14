var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

router.get("/", function (req, res) {
    quizController.listar(req, res);
});

router.get("/:id", function (req, res) {
    quizController.detalhes(req, res);
});

router.post("/:id/iniciar", function (req, res) {
    quizController.iniciar(req, res);
});

router.post("/tentativa/:id/responder", function (req, res) {
    quizController.responder(req, res);
});

router.post("/tentativa/:id/concluir", function (req, res) {
    quizController.concluir(req, res);
});

module.exports = router;
