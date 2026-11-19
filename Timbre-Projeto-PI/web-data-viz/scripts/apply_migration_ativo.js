// Script para aplicar a migração que adiciona a coluna `ativo` em usuario_preferencia
// Carrega variáveis de ambiente de .env.dev e usa a função executar do projeto
require('dotenv').config({ path: '.env.dev' });
const database = require('../src/database/config');

async function run() {
    try {
        console.log('Iniciando migração: adicionar coluna ativo em usuario_preferencia');
        const alter = `ALTER TABLE usuario_preferencia ADD COLUMN ativo TINYINT(1) NOT NULL DEFAULT 1`;
        await database.executar(alter);
        console.log('Coluna `ativo` adicionada com sucesso.');
    } catch (err) {
        // erro caso a coluna já exista ou outro problema
        const msg = String(err && (err.sqlMessage || err.message || err));
        if (/duplicate column name/i.test(msg) || /duplicat/i.test(msg) || /ER_DUP_FIELDNAME/.test(msg) || msg.indexOf('Duplicate column name') !== -1) {
            console.log('Coluna `ativo` já existe. Pulando alteração.');
        } else {
            console.error('Falha ao aplicar ALTER TABLE:', err);
            process.exit(1);
        }
    }

    try {
        console.log('Atualizando registros existentes para ativo = 1 quando aplicável');
        await database.executar(`UPDATE usuario_preferencia SET ativo = 1 WHERE ativo IS NULL OR ativo = ''`);
        console.log('Registros atualizados.');
    } catch (err) {
        console.warn('Não foi possível atualizar todos os registros (talvez já estejam corretos):', err && err.sqlMessage ? err.sqlMessage : err);
    }

    console.log('Migração concluída.');
    process.exit(0);
}

run();
