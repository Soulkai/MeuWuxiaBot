markdown
# 🐉 Chasing Immortality - WhatsApp Wuxia RPG Bot

![Version](https://img.shields.io/badge/Version-1.0.0_MVP-gold)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue)
![whatsapp-web.js](https://img.shields.io/badge/whatsapp--web.js-Integration-25D366)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📜 Sobre o Projeto

**Chasing Immortality** é um jogo RPG textual multiplayer assíncrono projetado para rodar diretamente no WhatsApp. Inspirado na rica mitologia *Wuxia* e *Xianxia*, o projeto permite que jogadores comuns iniciem sua jornada como mortais e busquem a ascensão aos céus através do cultivo de energia, artes marciais e exploração de um vasto mundo.

Construído com uma arquitetura de monólito modular, o bot é executado localmente via Node.js e utiliza o WhatsApp como interface através da leitura de um QR Code. O sistema possui um banco de dados relacional robusto (SQLite) para garantir a persistência de personagens, inventários, economia, presença de jogadores em tempo real e soberania de Seitas.

---

## ✨ Características Principais

O universo de *Chasing Immortality* foi projetado com sistemas profundos de progressão, onde cada ação possui custos, gargalos e riscos.

* **Criação de Personagem Única (RNG):** Todo cultivador recebe estatísticas geradas dinamicamente, incluindo Raças (Humano, Bestial, Dracônico, etc.), Clãs de Origem, Talentos e Raízes Espirituais.
* **O Caminho do Cultivo:** Progressão dividida em 3 trilhas distintas (Cultivo Corporal, Espiritual e da Alma). Cada trilha conta com 9 Grandes Reinos, contendo 9 subníveis cada.
* **Sistema de Tribulação e Gargalos:** Para avançar de reino, o cultivador deve tentar "romper" o seu limite, enfrentando taxas decrescentes de sucesso e risco de perda de XP ou desvio de cultivo.
* **Geografia Massiva e Presença:** Um mundo expansivo com 155 locais físicos para viajar. O sistema de exploração detecta em tempo real outros jogadores na mesma área, permitindo encontros dinâmicos.
* **Mercado Global e Economia:** Sistema financeiro estruturado em Ouro Mortal, Pérolas Espirituais e Cristais Dao. Jogadores podem comprar na loja do sistema ou listar seus próprios artefatos no mercado global.
* **Profissões e Crafting:** Mais de 150 receitas distribuídas em profissões (Mestre das Pílulas, Mestre de Forja, Mestre de Marionetes, etc.) para criar equipamentos vitais.
* **Sistema Social e Seitas:** Envio de mensagens in-game ("telepatia"), transferência de itens entre jogadores e um sistema completo de fundação e gestão de guildas (Seitas).

---

## 🛠️ Tecnologias Utilizadas

* **Node.js:** Ambiente de execução principal.
* **whatsapp-web.js:** Biblioteca base para simular o cliente do WhatsApp Web e interceptar/responder mensagens.
* **Puppeteer:** Ferramenta de automação de navegador utilizada para gerenciamento da sessão.
* **SQLite3:** Banco de dados relacional leve e poderoso para persistência completa do estado do mundo.

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
* Node.js (versão LTS recomendada).
* Um terminal (Prompt de Comando, PowerShell, ou Termux para Android).
* Um número de WhatsApp ativo para servir como o Bot.

### 1. Clonando e Instalando Dependências
Clone este repositório e instale as bibliotecas necessárias:
```bash
git clone [https://github.com/SeuUsuario/MeuWuxiaBot.git](https://github.com/SeuUsuario/MeuWuxiaBot.git)
cd MeuWuxiaBot
npm install
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e configure as premissas do sistema:
```env
PREFIX=/
DB_PATH=./data/game.sqlite
SESSION_DIR=./.wwebjs_auth
```

### 3. Materialização do Banco de Dados (Migrations e Seeds)
Antes de ligar o bot pela primeira vez, execute os rituais de injeção de dados no banco:

```bash
node src/infra/db/runMigrations.js     # 1. Tabelas Base
node src/infra/db/runSeeds.js          # 2. Raças, Clãs e Talentos
node src/infra/db/runTechniques.js     # 3. Manuais de Cultivo e Artes
node src/infra/db/runItems.js          # 4. Catálogo de Itens do Mundo
node src/infra/db/runRecipes.js        # 5. Compêndio de 150 Receitas
node src/infra/db/runShop.js           # 6. Loja Oficial e Moedas
node src/infra/db/runWorldExpansion.js # 7. Matriz de 155 Áreas de Exploração
```

### 4. Despertando o Sistema
Inicie o servidor local do bot:
```bash
npm start
```
Escaneie o QR Code no terminal com o seu WhatsApp (Aparelhos Conectados) e o bot estará online!

---

## 📜 Lista de Comandos Oficiais

### 👤 Cultivo e Personagem
* `/registrar [Nome] [M/F]` - Cria seu cultivador rolando origem, talento e raça.
* `/perfil` | `/status` | `/atributos` | `/inventario` - Consultas de personagem.
* `/livros` | `/compreender [ID]` | `/aprender [ID]` | `/equipartecnica [ID]` - Sistema de maestria e epifania de técnicas.
* `/cultivar` | `/treinar` | `/meditar` - Absorve energia para ganhar XP em trilhas específicas.
* `/romper [corpo|espirito|alma]` - Tenta superar o gargalo celestial ao atingir o nível 9/9.

### 🗺️ Exploração e Mundo
* `/area` - Lista detalhes do local e detecta outros jogadores na mesma região.
* `/lista area` - Lista cidades e rotas de viagem acessíveis da sua posição.
* `/viajar [ID]` - Move-se fisicamente pelo continente.
* `/explorar` - Realiza buscas por drops, monstros e encontros sociais (consome fadiga).

### ⚒️ Artesanato e Profissões
* `/profissao escolher [profissão]` - Escolhe sua vocação (ex: pill_master, forge_master).
* `/refinar [ID_Receita]` | `/forjar [ID_Receita]` - Cria itens consumindo materiais.

### ⚖️ Economia e Comércio Global
* `/loja` | `/comprar [ID] [Qtd]` - Lojinha oficial do sistema.
* `/vender [ID] [Qtd]` - Vende itens comuns ao sistema por Ouro.
* `/mercado` - Abre o painel de anúncios (Casa de Leilões dos Jogadores).
* `/mercado vender [ID] [Preço] [Qtd] [Moeda]` - Anuncia seu item para todo o servidor.
* `/mercado comprar [ID_Anuncio] [Qtd]` - Compra um item de outro jogador.

### 👥 Social e Seitas (Guildas)
* `/conversar [Nome] [Mensagem]` - Envia uma mensagem telepática via DM do bot.
* `/transferir [Nome] [ID] [Qtd]` - Entrega itens do seu inventário a outro jogador.
* `/seita criar [Nome]` - Paga 1000 de Ouro para fundar uma potência marcial.
* `/seita info` | `/seita membros` | `/seita lista` | `/seita entrar [ID]` - Gestão de guildas.

---

## 📊 Progresso de Desenvolvimento (Roadmap)

✅ **MVP v1.0.0 TOTALMENTE CONCLUÍDO!**

```text
Documentação:   ████████████████████ 100%
Banco de Dados: ████████████████████ 100%
Config/Utils:   ████████████████████ 100%
Transport:      ████████████████████ 100%
Comandos/UX:    ████████████████████ 100%
Content(Seeds): ████████████████████ 100% 
Handlers:       ████████████████████ 100%
Services:       ████████████████████ 100%

TOTAL DO MVP:   ████████████████████ 100% COMPLETO
```

### Próximos Passos Pós-MVP
* **Fase Beta:** Iniciar testes massivos de estresse e balanceamento econômico.
* **Expansão de Combate:** Implementação do motor de combates em turnos contra Feras (PvE) e entre Jogadores (PvP) com uso de itens e habilidades em tempo real.
* **Guerras de Seita:** Batalhas por domínio de `regions` e cofres de guilda.

---

## ⚖️ Licença

Desenvolvido com o *Dao* no coração por Mestre Fundador.
Este projeto é de código aberto sob a licença **MIT**. Sinta-se livre para ramificar, forjar novas técnicas e contribuir para o crescimento contínuo desta Seita.

