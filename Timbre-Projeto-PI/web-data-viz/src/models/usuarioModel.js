var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email, cpf, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, senha, cpf) {
    console.log("ACESSEI O USUARIO MODEL -> cadastrar usuario:", nome, cpf);

    var instrucaoSql = `
        INSERT INTO usuario (nome, senha, cpf) VALUES ('${nome}', '${senha}', '${cpf}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarContato(email, telefone, fkUsuario) {
    console.log("ACESSEI O USUARIO MODEL -> cadastrar contato:", email, telefone, fkUsuario);

    var tel = telefone == undefined || telefone == null ? '' : telefone;

    var instrucaoSql = `
        INSERT INTO contato (telefone, email, fk_usuario) VALUES ('${tel}', '${email}', ${fkUsuario});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarContato
};
