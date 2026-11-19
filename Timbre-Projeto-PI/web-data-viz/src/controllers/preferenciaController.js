var preferenciaModel = require('../models/preferenciaModel');

function listar(req, res) {
    preferenciaModel.listar().then(function(result){
        res.json(result);
    }).catch(function(erro){
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarPorUsuario(req, res) {
    var id = req.params.id;
    preferenciaModel.listarPorUsuario(id).then(function(result){
        res.json(result);
    }).catch(function(erro){
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function salvarParaUsuario(req, res) {
    var id = req.params.id;
    console.log('[DEBUG] POST /preferencias/usuario/' + id + ' body:', req.body);
    var preferencias = req.body.preferencias || [];
    preferenciaModel.salvarParaUsuario(id, preferencias).then(function(result){
        // quando o array vier vazio, o comportamento é apagar as preferências do usuário
        // notificar clientes via socket.io que as preferências foram atualizadas
        try{
            var io = req.app && req.app.get && req.app.get('io');
            if(io) io.emit('prefs:updated', { usuario: id });
        }catch(e){ /* ignore emission errors */ }
        if (!Array.isArray(preferencias) || preferencias.length === 0) {
            return res.json({ mensagem: 'Preferências removidas com sucesso.' });
        }
        return res.json({ mensagem: 'Preferências salvas com sucesso.' });
    }).catch(function(erro){
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listar,
    listarPorUsuario,
    salvarParaUsuario
};
