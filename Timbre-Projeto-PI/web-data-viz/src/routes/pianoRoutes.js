const express = require("express");
const router = express.Router();

const pianoController = require("../controllers/pianoController");

// Rota para obter o conteúdo informativo sobre o piano
router.get("/conteudo", pianoController.obterConteudo);

module.exports = router;
