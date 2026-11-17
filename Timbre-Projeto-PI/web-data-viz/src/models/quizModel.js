// Quando não há tabelas de quiz no banco, lemos um arquivo estático JSON
// localizado em public/exemplo_quiz/quiz.json. Isso mantém a arquitetura do
// projeto (rotas/controles) sem necessidade de tabelas no banco.
var fs = require('fs');
var path = require('path');

function _carregarQuiz() {
    // subir dois níveis para chegar na pasta raiz do projeto e acessar public/
    var arquivo = path.join(__dirname, '..', '..', 'public', 'exemplo_quiz', 'quiz.json');
    try {
        var conteudo = fs.readFileSync(arquivo, 'utf8');
        return JSON.parse(conteudo);
    } catch (err) {
        console.log('Não foi possível carregar quiz estático:', err.message);
        return null;
    }
}

function listarQuizzes() {
    // retorna um array de quizzes disponíveis (do arquivo estático)
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        if (!q) return resolve([]);
        // o arquivo pode conter um objeto { quiz: {...}, perguntas: [...] }
        var item = q.quiz ? q.quiz : { id_quiz: 1, titulo: q.titulo || 'Quiz Exemplo', descricao: q.descricao || '' };
        resolve([item]);
    });
}

function obterQuizPorId(id) {
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        if (!q) return resolve([]);
        resolve([q.quiz || { id_quiz: 1, titulo: q.titulo || 'Quiz Exemplo', descricao: q.descricao || '' }]);
    });
}

function obterPerguntasPorQuiz(idQuiz) {
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        if (!q) return resolve([]);
        // espera perguntas em q.perguntas
        var perguntas = q.perguntas || [];
        resolve(perguntas);
    });
}

function obterAlternativasPorPergunta(idPergunta) {
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        if (!q) return resolve([]);
        // procurar a pergunta pelo id_pergunta e retornar suas alternativas
        var perguntas = q.perguntas || [];
        for (var i = 0; i < perguntas.length; i++) {
            var p = perguntas[i];
            if (p.id_pergunta == idPergunta || p.numero == idPergunta) {
                return resolve(p.alternativas || []);
            }
        }
        resolve([]);
    });
}

function existeQuiz(id) {
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        resolve(!!q);
    });
}

function existePergunta(id) {
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        if (!q) return resolve([]);
        var found = (q.perguntas || []).some(function (p) { return p.id_pergunta == id || p.numero == id; });
        resolve(found ? [1] : []);
    });
}

function existeAlternativa(id) {
    return new Promise(function (resolve) {
        var q = _carregarQuiz();
        if (!q) return resolve([]);
        var found = false;
        (q.perguntas || []).forEach(function (p) {
            (p.alternativas || []).forEach(function (a) { if (a.id_alternativa == id) found = true; });
        });
        resolve(found ? [{ correta: 1 }] : []);
    });
}

function perguntaPertenceQuiz(idPergunta, idQuiz) {
    return existePergunta(idPergunta);
}


// exportar todas as funções necessárias (evita sobrescrever exports acidentalmente)
module.exports = {
    listarQuizzes,
    obterQuizPorId,
    obterPerguntasPorQuiz,
    obterAlternativasPorPergunta,
    existeQuiz,
    existePergunta,
    existeAlternativa,
};
