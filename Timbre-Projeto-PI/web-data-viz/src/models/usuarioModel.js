var database = require("../database/config")

function buscarPorId(id) {
    var instrucao = `SELECT id_usuario, nome, cpf FROM usuario WHERE id_usuario = ${id} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarPorId
};
