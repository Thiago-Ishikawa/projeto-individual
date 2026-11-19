var database = require('../database/config');

function listar() {
    var instrucao = `SELECT id_preferencia, nome, descricao FROM preferencia`;
    console.log('Executando a instrução SQL: \n' + instrucao);
    return database.executar(instrucao).then(function(rows){
        if (rows && rows.length > 0) return rows;
        // se não houver preferências cadastradas, tentar popular a partir da tabela compositor
        console.log('Nenhuma preferencia encontrada; populando a partir de compositor (fallback).');
        return database.executar(`SELECT id_compositor, nome FROM compositor`).then(function(comps){
            if (!comps || comps.length === 0) return [];
            // inserir cada compositor como preferencia
            var values = comps.map(function(c){ return `('${c.nome.replace(/'/g, "''")}', 'Compositor gerado')`; }).join(',');
            var insert = `INSERT INTO preferencia (nome, descricao) VALUES ${values}`;
            console.log('Executando a instrução SQL (inserir preferencias): \n' + insert);
            return database.executar(insert).then(function(){
                // recolher as preferências recém criadas
                return database.executar(instrucao);
            });
        });
    });
}

function listarPorUsuario(idUsuario) {
    // listar apenas preferências ativas do usuário
    var instrucao = `SELECT p.id_preferencia FROM preferencia p JOIN usuario_preferencia up ON up.fk_preferencia = p.id_preferencia WHERE up.fk_preferencia_usuario = ${idUsuario} AND up.ativo = 1`;
    console.log('Executando a instrução SQL: \n' + instrucao);
    return database.executar(instrucao);
}

function salvarParaUsuario(idUsuario, preferenciasArray) {
    // em vez de apagar o histórico, marcar registros anteriores como inativos
    var updateOld = `UPDATE usuario_preferencia SET ativo = 0 WHERE fk_preferencia_usuario = ${idUsuario} AND ativo = 1`;
    console.log('Executando a instrução SQL: \n' + updateOld);
    return database.executar(updateOld).then(function(){
        if (!Array.isArray(preferenciasArray) || preferenciasArray.length === 0) return Promise.resolve({ affectedRows: 0 });
        // deduplicar e validar ids
        var uniq = Array.from(new Set(preferenciasArray.map(function(x){ return Number(x); }).filter(function(n){ return Number.isFinite(n) && n > 0; })));
        if (uniq.length === 0) return Promise.resolve({ affectedRows: 0 });
        var values = uniq.map(function(pid){ return `(${idUsuario}, ${pid}, NOW(), 1)`; }).join(',');
        var insertInstr = `INSERT INTO usuario_preferencia (fk_preferencia_usuario, fk_preferencia, data_registro, ativo) VALUES ${values}`;
        console.log('Executando a instrução SQL: \n' + insertInstr);
        return database.executar(insertInstr);
    });
}

function contarPorPreferencia() {
    // contar o número de usuários distintos por preferência (cada usuário conta uma vez)
    var instrucao = `
        SELECT p.id_preferencia, p.nome, p.descricao, COUNT(DISTINCT up.fk_preferencia_usuario) AS total
        FROM preferencia p
        LEFT JOIN usuario_preferencia up ON up.fk_preferencia = p.id_preferencia AND up.ativo = 1
        GROUP BY p.id_preferencia, p.nome, p.descricao
        ORDER BY total DESC
    `;
    console.log('Executando a instrução SQL: \n' + instrucao);
    return database.executar(instrucao);
}

function contarTotalUsuariosComPreferencias() {
    var instrucao = `SELECT COUNT(DISTINCT fk_preferencia_usuario) AS totalUsuarios FROM usuario_preferencia WHERE ativo = 1`;
    console.log('Executando a instrução SQL: \n' + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listar,
    listarPorUsuario,
    salvarParaUsuario,
    contarPorPreferencia,
    contarTotalUsuariosComPreferencias
};
