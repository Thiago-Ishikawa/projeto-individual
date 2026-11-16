-- Migration: criar tabelas de quiz, pergunta, alternativa, tentativa e resposta (mínimo)

CREATE TABLE IF NOT EXISTS quiz (
  id_quiz INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descricao VARCHAR(255),
  ativo TINYINT NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS pergunta (
  id_pergunta INT PRIMARY KEY AUTO_INCREMENT,
  fk_quiz INT NOT NULL,
  texto VARCHAR(500) NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  tipo VARCHAR(20) NOT NULL,
  FOREIGN KEY (fk_quiz) REFERENCES quiz(id_quiz)
);

CREATE TABLE IF NOT EXISTS alternativa (
  id_alternativa INT PRIMARY KEY AUTO_INCREMENT,
  fk_pergunta INT NOT NULL,
  texto VARCHAR(255) NOT NULL,
  correta TINYINT NOT NULL DEFAULT 0,
  ordem INT NOT NULL DEFAULT 0,
  FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id_pergunta)
);

CREATE TABLE IF NOT EXISTS tentativa_quiz (
  id_tentativa INT PRIMARY KEY AUTO_INCREMENT,
  fk_usuario INT NOT NULL,
  fk_quiz INT NOT NULL,
  inicio DATETIME NOT NULL,
  termino DATETIME NULL,
  pontuacao DECIMAL(5,2) NULL,
  estado VARCHAR(20) NOT NULL,
  FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (fk_quiz) REFERENCES quiz(id_quiz)
);

CREATE TABLE IF NOT EXISTS resposta_tentativa (
  id_resposta INT PRIMARY KEY AUTO_INCREMENT,
  fk_tentativa INT NOT NULL,
  fk_pergunta INT NOT NULL,
  fk_alternativa INT NULL,
  resposta_texto VARCHAR(255) NULL,
  correta INT NULL,
  respondido_em DATETIME NOT NULL,
  FOREIGN KEY (fk_tentativa) REFERENCES tentativa_quiz(id_tentativa),
  FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id_pergunta)
);
