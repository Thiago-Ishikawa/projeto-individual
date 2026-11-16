const conteudoPiano = {

    titulo: "O Piano",

    historia: "O piano surgiu no início do século XVIII, na Itália, a partir do trabalho de Bartolomeo Cristofori. Seu mecanismo permitiu controlar a intensidade do som conforme a força aplicada às teclas, ampliando as possibilidades de expressão musical.",

    curiosidades: [

        {
            titulo: "Alcance de notas",

            descricao: "O piano acústico moderno geralmente possui 88 teclas, distribuídas em 7 oitavas e uma terça menor."
        },

        {
            titulo: "Versatilidade",

            descricao: "Está presente na música clássica, no jazz, no pop, no rock e em trilhas sonoras."
        },

        {
            titulo: "Coordenação",

            descricao: "Tocar piano envolve atenção, memória, leitura musical e coordenação entre as mãos."
        }

    ],

    tipos: [

        {
            nome: "Piano de cauda",

            descricao: "Possui cordas e estrutura dispostas horizontalmente, com grande projeção sonora."
        },

        {
            nome: "Piano vertical",

            descricao: "Tem estrutura vertical e ocupa menos espaço, sendo comum em residências e escolas."
        },

        {
            nome: "Piano digital",

            descricao: "Reproduz sons eletronicamente e oferece recursos como controle de volume e fones."
        }

    ]

};

// Função responsável por retornar o conteúdo
function obterConteudo(req, res) {

    return res.status(200).json(conteudoPiano);

}

module.exports = { obterConteudo };
