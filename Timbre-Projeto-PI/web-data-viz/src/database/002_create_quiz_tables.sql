-- Migration reduzida para apenas armazenar tentativas e respostas do quiz

CREATE TABLE IF NOT EXISTS tentativa_quiz (
    id_tentativa INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    inicio DATETIME NOT NULL,
    termino DATETIME,
    acertos INT DEFAULT 0,
    erros INT DEFAULT 0,
    total_perguntas INT NOT NULL,
    pontuacao DECIMAL(5,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'EM_ANDAMENTO',

    FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS resposta_quiz (
    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
    fk_tentativa INT NOT NULL,
    numero_pergunta INT NOT NULL,
    resposta_usuario VARCHAR(255) NULL,
    correta TINYINT NULL,
    respondido_em DATETIME NOT NULL,

    FOREIGN KEY (fk_tentativa)
        REFERENCES tentativa_quiz(id_tentativa),

    UNIQUE (fk_tentativa, numero_pergunta)
);
