/**
 * Sprint 9 e Infraestrutura: Scheduler de Jobs
 * Rotinas automáticas (expirar leilões, backup 24/7, etc)
 * 
 * Referência: Seções 431, 1304
 */

// Importar bibliotecas de scheduler
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const db = require('../db/connection');
const auctionRepo = require('../db/repositories/auctionRepository');
const territoryRules = require('../../domain/rules/territoryRules');

const JOBS = {
    // Job: Expirar Leilões a cada 5 minutos
    EXPIRE_AUCTIONS: {
        schedule: '*/5 * * * *',  // A cada 5 minutos
        handler: async () => {
            console.log('[SCHEDULER] Verificando leilões expirados...');
            try {
                // Seleciona e resolve leilões expirados em `auction_listings`
                const expiredAuctions = await new Promise((res, rej) => db.all(`SELECT id FROM auction_listings WHERE status != 'completed' AND ends_at <= datetime('now')`, [], (err, rows) => err ? rej(err) : res(rows)));
                for (const a of expiredAuctions) {
                    try {
                        await auctionRepo.resolveAuction(a.id);
                        console.log(`[SCHEDULER] Leilão ${a.id} resolvido.`);
                    } catch (inner) {
                        console.error(`[SCHEDULER] Erro ao resolver leilão ${a.id}:`, inner.message);
                    }
                }

                // Seleciona e resolve market listings expirados (compras com prazo)
                const expiredMarkets = await new Promise((res, rej) => db.all(`SELECT id FROM market_listings WHERE status = 'active' AND expires_at <= datetime('now')`, [], (err, rows) => err ? rej(err) : res(rows)));
                for (const m of expiredMarkets) {
                    try {
                        await auctionRepo.resolveAuction(m.id);
                        console.log(`[SCHEDULER] Market listing ${m.id} resolvido.`);
                    } catch (inner) {
                        console.error(`[SCHEDULER] Erro ao resolver market listing ${m.id}:`, inner.message);
                    }
                }
            } catch (e) {
                console.error('[SCHEDULER] Erro ao expirar leilões:', e.message);
            }
        }
    },

    // Job: Backup do banco de dados a cada 6 horas
    DATABASE_BACKUP: {
        schedule: '0 */6 * * *',  // A cada 6 horas
        handler: async () => {
            console.log('[SCHEDULER] Realizando backup do banco de dados...');
            try {
                const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../data/game.sqlite');
                const backupDir = path.resolve(__dirname, '../../data/backups');
                if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
                const backupPath = path.join(backupDir, `game.sqlite.bak.${Date.now()}`);
                fs.copyFileSync(dbPath, backupPath);
                console.log('[SCHEDULER] Backup criado em', backupPath);
            } catch (e) {
                console.error('[SCHEDULER] Erro ao fazer backup:', e.message);
            }
        }
    },

    // Job: Gerar riqueza passiva de territórios a cada hora
    TERRITORY_PASSIVE_WEALTH: {
        schedule: '0 * * * *',  // A cada hora
        handler: async () => {
            console.log('[SCHEDULER] Gerando riqueza passiva dos territórios...');
            try {
                const dominions = await new Promise((res, rej) => db.all(`SELECT territory_id, sect_id, level, development_score FROM territory_dominions WHERE sect_id IS NOT NULL`, [], (err, rows) => err ? rej(err) : res(rows)));
                for (const dom of dominions) {
                    const wealth = territoryRules.calculatePassiveWealth(dom.level, dom.development_score || 0);
                    if (!dom.sect_id) continue;
                    await new Promise((res, rej) => db.run(`UPDATE sect_treasuries SET gold = gold + ? WHERE sect_id = ?`, [wealth, dom.sect_id], function (err) { if (err) rej(err); else res(this); }));
                    await new Promise((res, rej) => db.run(`INSERT INTO sect_wealth_logs (sect_id, transaction_type, amount_gold, details) VALUES (?, 'territory_passive', ?, ?)`, [dom.sect_id, wealth, `Territory ${dom.territory_id} passive income`], function (err) { if (err) rej(err); else res(this); }));
                }
                console.log('[SCHEDULER] Riqueza passiva distribuída.');
            } catch (e) {
                console.error('[SCHEDULER] Erro ao gerar riqueza passiva:', e.message);
            }
        }
    },

    // Job: Sincronizar leilões em todos os servidores
    SYNC_AUCTIONS: {
        schedule: '*/10 * * * *',  // A cada 10 minutos
        handler: async () => {
            console.log('[SCHEDULER] Sincronizando leilões...');
            try {
                // Placeholder: recarrega leilões ativos no cache (se existir)
                const active = await auctionRepo.loadActiveAuctions();
                console.log(`[SCHEDULER] Leilões ativos: ${active.length}`);
            } catch (e) {
                console.error('[SCHEDULER] Erro ao sincronizar leilões:', e.message);
            }
        }
    },

    // Job: Limpar logs antigos a cada 24 horas
    CLEANUP_LOGS: {
        schedule: '0 0 * * *',  // Meia-noite
        handler: async () => {
            console.log('[SCHEDULER] Limpando logs antigos...');
            try {
                await new Promise((res, rej) => db.run(`DELETE FROM game_logs WHERE created_at <= datetime('now', '-30 days')`, [], function (err) { if (err) rej(err); else res(this); }));
                console.log('[SCHEDULER] Logs antigos removidos.');
            } catch (e) {
                console.error('[SCHEDULER] Erro ao limpar logs:', e.message);
            }
        }
    }
};

async function initializeScheduler() {
    console.log('🕐 [SCHEDULER] Inicializando rotinas automáticas...');
    for (const key of Object.keys(JOBS)) {
        const job = JOBS[key];
        try {
            cron.schedule(job.schedule, job.handler);
            console.log(`[SCHEDULER] Agendado job ${key} -> ${job.schedule}`);
        } catch (e) {
            console.error(`[SCHEDULER] Falha ao agendar job ${key}:`, e.message);
        }
    }

    console.log('✅ [SCHEDULER] Todas as rotinas foram iniciadas');
}

module.exports = {
    JOBS,
    initializeScheduler
};
