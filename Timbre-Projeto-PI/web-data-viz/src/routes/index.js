var express = require("express");
var router = express.Router();
var path = require('path');

router.get("/", function (req, res) {
    res.render("index");
});

// Serve exemplo de quiz armazenado em DOCUMENTOS_DE_APOIO para não alterar estrutura pública
router.get('/exemplo_quiz', function (req, res) {
    var file = path.join(__dirname, '..', '..', 'DOCUMENTOS_DE_APOIO', 'exemplo_de_quiz', 'quiz.html');
    res.sendFile(file);
});

module.exports = router;
