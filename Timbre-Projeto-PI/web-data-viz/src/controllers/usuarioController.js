var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    // debug mínimo para confirmar que a rota recebeu os dados
    console.log('[DEBUG] /usuarios/autenticar recebido body:', { emailServer: email, senhaServer: senha ? '***' : senha });

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        // Se usuario tiver empresaId, buscar aquários; senão retornar sem aquários
                        var empresaId = resultadoAutenticar[0].empresaId;
                        if (empresaId !== undefined && empresaId !== null) {
                            aquarioModel.buscarAquariosPorEmpresa(empresaId)
                                .then((resultadoAquarios) => {
                                    if (resultadoAquarios && resultadoAquarios.length > 0) {
                                        res.json({
                                            id: resultadoAutenticar[0].id,
                                            email: resultadoAutenticar[0].email,
                                            nome: resultadoAutenticar[0].nome,
                                            senha: resultadoAutenticar[0].senha,
                                            cpf: resultadoAutenticar[0].cpf,
                                            aquarios: resultadoAquarios
                                        });
                                    } else {
                                        // sucesso, sem aquarios
                                        res.json({
                                            id: resultadoAutenticar[0].id,
                                            email: resultadoAutenticar[0].email,
                                            nome: resultadoAutenticar[0].nome,
                                            senha: resultadoAutenticar[0].senha,
                                            cpf: resultadoAutenticar[0].cpf,
                                            aquarios: []
                                        });
                                    }
                                }).catch(function(erro){
                                    console.log('Erro ao buscar aquarios: ', erro);
                                    // responder apenas com usuário, sem aquarios em caso de falha na busca
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        cpf: resultadoAutenticar[0].cpf,
                                        aquarios: []
                                    });
                                });
                        } else {
                            // sem empresa vinculada: retornar usuário e lista vazia de aquarios
                            res.json({
                                id: resultadoAutenticar[0].id,
                                email: resultadoAutenticar[0].email,
                                nome: resultadoAutenticar[0].nome,
                                senha: resultadoAutenticar[0].senha,
                                cpf: resultadoAutenticar[0].cpf,
                                aquarios: []
                            });
                        }
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

var bcrypt = require('bcryptjs');

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var telefone = req.body.telefoneServer;
    var fkEmpresa = req.body.idEmpresaVincularServer; // mantido, mas não usado por tabela atual

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
     }else if (cpf == undefined) {
        res.status(400).send("Seu cpf está undefined!");
     } else {

        // Hash da senha antes de salvar (melhor prática)
        var salt = bcrypt.genSaltSync(10);
        var senhaHash = bcrypt.hashSync(senha, salt);

        // 1) Inserir na tabela usuario
        usuarioModel.cadastrar(nome, senhaHash, cpf)
            .then(function (resultadoInserirUsuario) {
                // resultadoInserirUsuario.insertId contém o id do usuário (id_usuario)
                var idUsuario = resultadoInserirUsuario.insertId;

                // 2) Se o frontend enviou email, inserir na tabela contato
                if (email) {
                    return usuarioModel.cadastrarContato(email, telefone, idUsuario)
                        .then(function () {
                            // responder sucesso apenas após inserir contato
                            res.json({ mensagem: 'Cadastro e contato criados com sucesso' });
                        });
                } else {
                    // sem email, respondemos apenas com sucesso de usuário
                    res.json({ mensagem: 'Cadastro realizado com sucesso'});
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function totalUsuarios(req, res) {
    usuarioModel.contarTotalUsuarios()
        .then(function(resultado){
            var total = (resultado && resultado[0]) ? Number(resultado[0].totalUsuarios) : 0;
            if(!Number.isFinite(total)) total = 0;
            res.json({ totalUsuarios: total });
        }).catch(function(erro){
            console.log('Erro ao contar usuários:', erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    totalUsuarios
}
