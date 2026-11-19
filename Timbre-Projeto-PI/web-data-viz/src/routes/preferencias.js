var express = require('express');
var router = express.Router();
var prefController = require('../controllers/preferenciaController');

router.get('/', function(req,res){ prefController.listar(req,res); });
router.get('/usuario/:id', function(req,res){ prefController.listarPorUsuario(req,res); });
router.post('/usuario/:id', function(req,res){ prefController.salvarParaUsuario(req,res); });

module.exports = router;
