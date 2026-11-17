CREATE DATABASE timbre;

USE timbre;

CREATE TABLE usuario (
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(50) NOT NULL,
senha VARCHAR(255) NOT NULL,
cpf CHAR(11) NOT NULL UNIQUE
);

CREATE TABLE contato (
id_contato INT PRIMARY KEY AUTO_INCREMENT,
telefone CHAR(11) NOT NULL,
email VARCHAR(255) NOT NULL,
fk_usuario INT,
CONSTRAINT fk_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE preferencia (
id_preferencia INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
descricao VARCHAR(255)
);

CREATE TABLE usuario_preferencia (
id_usuario_preferencia INT PRIMARY KEY AUTO_INCREMENT,
fk_preferencia_usuario INT,
CONSTRAINT fk_preferencia_usuario FOREIGN KEY (fk_preferencia_usuario) REFERENCES usuario(id_usuario),
fk_preferencia INT,
CONSTRAINT fk_preferencia FOREIGN KEY (fk_preferencia) REFERENCES preferencia(id_preferencia),
data_registro DATE
);

CREATE TABLE compositor (
id_compositor INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(150) NOT NULL,
nacionalidade VARCHAR(80),
ano_nascimento DATE
);

CREATE TABLE musica (
id_musica INT PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR(100) NOT NULL,
descricao VARCHAR(255),
duracao TIME,
ano_composicao YEAR,
fk_compositor INT,
CONSTRAINT fk_compositor FOREIGN KEY (fk_compositor) REFERENCES compositor(id_compositor)
);

-- 1. ARMAZENAR AS TENTATIVAS DO QUIZ

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

-- 2. ARMAZENAR AS RESPOSTAS DO USUARIO

CREATE TABLE IF NOT EXISTS resposta_quiz (
    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
    fk_tentativa INT NOT NULL,
    numero_pergunta INT NOT NULL,
    resposta_usuario VARCHAR(255) NOT NULL,
    correta TINYINT NOT NULL,
    respondido_em DATETIME NOT NULL,

    FOREIGN KEY (fk_tentativa)
    REFERENCES tentativa_quiz(id_tentativa),

    UNIQUE (fk_tentativa, numero_pergunta)
);