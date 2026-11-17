var express = require("express");
var router = express.Router();
var path = require('path');

router.get("/", function (req, res) {
    res.render("index");
});

// Serve exemplo de quiz a partir da pasta pública 'public/exemplo_quiz'
router.get('/exemplo_quiz', function (req, res) {
    var file = path.join(__dirname, '..', '..', 'public', 'exemplo_quiz', 'quiz.html');
    res.sendFile(file);
});

module.exports = router;
