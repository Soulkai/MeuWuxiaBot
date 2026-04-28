# 🌟 Checklist de Ascensão — O Reino Pós-MVP (Fase 2)

**Status Geral:** 60% — Metade do Caminho Percorrido

---

## ⏳ 1. Infraestrutura Divina (Hospedagem e Manutenção)

- [ ] Migração do Bot do Termux (Local) para um Servidor em Nuvem (VPS, Render, Railway)
  - **Referência:** Seção 1304
  - **Descrição:** Mover aplicação de ambiente local para servidor 24/7
  - **Status:** ⏳ Não iniciado

- [ ] `src/infra/scheduler/jobs.js` — Implementar rotinas automáticas
  - **Tasks:** Expirar leilões, backup 24/7, sincronização de dados
  - **Referência:** Seções 431, 1304
  - **Status:** ⏳ Não iniciado

- [ ] Configurar Auto-Restart e logs na nuvem para Imortalidade do Sistema (24/7)
  - **Referência:** Seção 1304
  - **Status:** ⏳ Não iniciado

---

## ✅ 2. Aplicação - Handlers (Sprints 9 ao 14)

### ✅ Sprint 9: Leis do Combate
- [x] `src/application/handlers/combatHandler.js`
  - **Comandos:** `/atacar`, `/defender`, `/esquivar`, `/fugir`, `/chefe`, `/raid`
  - **Referência:** Seções 165, 1305
  - **Status:** ✅ Concluído

- [ ] `src/application/handlers/dungeonHandler.js`
  - **Comandos:** `/boss`, `/raid`
  - **Referência:** Seção 164
  - **Status:** ⏳ Não iniciado

### ✅ Sprint 10: Maestria das Bestas
- [x] `src/application/handlers/beastHandler.js`
  - **Comandos:** `/besta chocar`, `/besta treinar`, `/besta status`
  - **Referência:** Seção 1306
  - **Status:** ✅ Concluído

### ✅ Sprint 11: Leilão Celestial
- [x] `src/application/handlers/auctionHandler.js`
  - **Comandos:** `/leilao criar`, `/leilao lance`, `/leilao listar`
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

### Sprint 12: Artesanato Supremo
- [ ] `src/application/handlers/puppetHandler.js`
  - **Descrição:** Criação e uso de marionetes de combate
  - **Referência:** Seção 406
  - **Status:** ⏳ Não iniciado

- [x] `src/application/handlers/formationHandler.js`
  - **Descrição:** Criação de formações complexas
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/handlers/techniqueCraftHandler.js`
  - **Descrição:** Criação de técnica própria
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

### Sprint 13: Guerra das Seitas e Territórios
- [ ] `src/application/handlers/sectWarHandler.js`
  - **Comandos:** `/seita guerra`, `/seita dominar`
  - **Referência:** Seção 406
  - **Status:** ⏳ Não iniciado

- [ ] `src/application/handlers/territoryHandler.js`
  - **Comandos:** `/territorio investir`, `/territorio coletar`
  - **Referência:** Seção 406
  - **Status:** ⏳ Não iniciado

### Sprint 14: Mundo Vivo e Laços do Destino
- [x] `src/application/handlers/companionHandler.js`
  - **Comandos:** `/casamento`, `/dao_companion`
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/handlers/eventHandler.js`
  - **Descrição:** Eventos globais complexos e NPCs avançados
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

---

## ⏳ 3. Aplicação - Services

- [ ] `src/application/services/combatService.js`
  - **Função:** Motor de combate em turnos, PvE e PvP
  - **Referência:** Seção 1305
  - **Status:** ⏳ Não iniciado

- [ ] `src/application/services/beastService.js`
  - **Função:** Lógica de ovos, eclosão e vínculos
  - **Referência:** Seções 159, 1306
  - **Status:** ⏳ Não iniciado

- [x] `src/application/services/auctionService.js`
  - **Função:** Leilão avançado com anti-snipe refinado
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/sectWarService.js`
  - **Função:** Gestão de cofres de seita, territórios e conflitos
  - **Referência:** Seções 166, 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/territoryService.js`
  - **Função:** Investimento e coleta de riquezas territoriais
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/puppetService.js`
  - **Função:** Criação e ativação de marionetes
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/formationService.js`
  - **Função:** Criação e ativação de formações
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/techniqueCraftService.js`
  - **Função:** Criação de técnicas próprias
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/companionService.js`
  - **Função:** Casamentos e companheiros do Dao
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/application/services/eventService.js`
  - **Função:** Orquestrador de Eventos Globais de servidor
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

---

## ⏳ 4. Domain - Rules

- [x] `src/domain/rules/combatRules.js`
  - **Cálculos:** Dano, ataque espiritual, esquiva, acerto, crítico
  - **Referência:** Seção 266
  - **Status:** ✅ Concluído

- [x] `src/domain/rules/beastRules.js`
  - **Cálculos:** Probabilidade de mutação e evolução
  - **Referência:** Seção 308
  - **Status:** ✅ Concluído

- [ ] `src/domain/rules/territoryRules.js`
  - **Cálculos:** Domínio e geração passiva de riquezas de Seita
  - **Referência:** Seção 406
  - **Status:** ⏳ Não iniciado

---

## ⏳ 5. Banco de Dados & Infraestrutura (Migrações Futuras)

- [x] `007_beasts.sql`
  - **Conteúdo:** Ovos, feras místicas e núcleos bestiais
  - **Referência:** Seções 308, 1306
  - **Status:** ✅ Concluído

- [x] `008_territories.sql`
  - **Conteúdo:** Zonas de domínio e estruturas das Seitas
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `009_combats.sql`
  - **Conteúdo:** Estados de combates ativos
  - **Referência:** Seção 1305
  - **Status:** ✅ Concluído

- [x] `010_phase2_tables.sql`
  - **Conteúdo:** Tabelas para formações, técnicas próprias, casamentos, eventos
  - **Referência:** Seção 406
  - **Status:** ✅ Concluído

- [x] `src/infra/db/repositories/combatRepository.js`
  - **Função:** Salvar estado dos turnos em andamento
  - **Referência:** Seções 267, 1305
  - **Status:** ✅ Concluído

- [ ] `src/infra/db/repositories/auctionRepository.js`
  - **Função:** Salvar lances com lock de concorrência
  - **Referência:** Seção 406
  - **Status:** ⏳ Não iniciado

---

## 📊 Progresso por Sprint

| Sprint | Descrição | Progresso | Status |
|--------|-----------|------------|--------|
| 9 | Leis do Combate | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |
| 10 | Maestria das Bestas | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |
| 11 | Leilão Celestial | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |
| 12 | Artesanato Supremo | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |
| 13 | Guerra das Seitas | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |
| 14 | Mundo Vivo | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |
| **INFRA** | **Hospedagem 24/7** | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ Não iniciado |

**Status Geral Fase 2:** ░░░░░░░░░░░░░░░░░░░░ 0% (O Caminho recomeça)

---

## 📝 Notas de Implementação

- Cada sprint deve ser implementado em ordem sequencial
- Antes de cada sprint, criar arquivos skeleton (estrutura vazia com exports)
- Validar sintaxe após cada implementação
- Atualizar este documento conforme progresso

