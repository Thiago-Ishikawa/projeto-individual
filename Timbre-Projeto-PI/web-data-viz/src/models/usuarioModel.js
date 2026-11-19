var database = require("../database/config")

function buscarPorId(id) {
    var instrucao = `SELECT id_usuario, nome, cpf FROM usuario WHERE id_usuario = ${id} LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

var bcrypt = require('bcryptjs');

function autenticar(email, senha) {
    // buscar usuário pelo email na tabela contato (email está em contato)
    // não referenciar colunas que podem não existir (ex.: fk_empresa).
    // manter SELECT simples que funciona com o esquema atual: buscar usuário via contato
    var instrucao = `SELECT u.id_usuario as id, u.nome, u.senha, u.cpf, c.email FROM usuario u LEFT JOIN contato c ON c.fk_usuario = u.id_usuario WHERE c.email = '${email}' LIMIT 1`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao).then(function (result) {
        // log do resultado bruto para ajudar a depuração da autenticação
        console.log('[DEBUG] usuarioModel.autenticar resultado raw:', result && result.length ? result[0] : result);
        if (!result || result.length === 0) return [];
        var row = result[0];
        // comparar senha com hash armazenado
        try {
            if (bcrypt.compareSync(senha, row.senha)) {
                return [row];
            } else {
                return [];
            }
        } catch (e) {
            console.log('Erro ao comparar senhas:', e);
            return [];
        }
    });
}

function cadastrar(nome, senhaHash, cpf) {
    var instrucao = `INSERT INTO usuario (nome, senha, cpf) VALUES ('${nome}', '${senhaHash}', '${cpf}')`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarContato(email, telefone, fk_usuario) {
    var instrucao = `INSERT INTO contato (telefone, email, fk_usuario) VALUES ('${telefone || ''}', '${email || ''}', ${fk_usuario})`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function contarTotalUsuarios() {
    var instrucao = `SELECT COUNT(*) AS totalUsuarios FROM usuario`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarPorId,
    autenticar,
    cadastrar,
    cadastrarContato,
    contarTotalUsuarios
};
