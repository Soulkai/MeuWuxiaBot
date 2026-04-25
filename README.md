markdown
# 🐉 Chasing Immortality - WhatsApp Wuxia RPG Bot

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue)
![whatsapp-web.js](https://img.shields.io/badge/whatsapp--web.js-Integration-25D366)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📜 Sobre o Projeto

**Chasing Immortality** é um jogo RPG textual multiplayer assíncrono projetado para rodar diretamente no WhatsApp. Inspirado na rica mitologia *Wuxia* e *Xianxia*, o projeto permite que jogadores comuns iniciem sua jornada como mortais e busquem a ascensão aos céus através do cultivo de energia, artes marciais e exploração de um vasto mundo.

Construído com uma arquitetura de monólito modular, o bot é executado localmente via Node.js e utiliza o WhatsApp como interface através da leitura de um QR Code. O sistema possui um banco de dados relacional robusto (SQLite) para garantir a persistência de personagens, inventários, economia e um mercado global entre os jogadores.

---

## ✨ Características Principais

O universo de *Chasing Immortality* foi projetado com sistemas profundos de progressão, onde cada ação possui custos, gargalos e riscos.

* **Criação de Personagem Única (RNG):** Todo cultivador recebe estatísticas geradas dinamicamente, incluindo Raças (ex: Humano, Bestial, Dracônico), Clãs de Origem, Talentos e Raízes Espirituais (Fogo, Vento, Vazio, etc.).
* **O Caminho do Cultivo:** Progressão dividida em 3 trilhas distintas (Cultivo Corporal, Espiritual e da Alma). Cada trilha conta com 9 Grandes Reinos, contendo 9 subníveis cada (ex: Condensação de Qi 9/9).
* **Sistema de Tribulação e Gargalos:** Para avançar de reino, o cultivador deve tentar "romper" o seu limite, enfrentando taxas decrescentes de sucesso e risco de perda de XP ou desvio de cultivo.
* **Geografia Massiva:** Um mundo expansivo dividido hierarquicamente em 5 Impérios, 25 Reinos e 125 Cidades/Áreas, totalizando 155 locais físicos para viajar e explorar.
* **Mercado Global e Economia:** Sistema financeiro estruturado em três moedas de prestígio (Ouro Mortal, Pérola Espiritual e Cristal Dao). Jogadores podem comprar itens da loja do sistema ou listar seus próprios artefatos no mercado global, com o sistema gerenciando transferências e taxas.
* **Profissões e Crafting:** Coleta de matérias-primas no mundo para a criação de itens através de mais de 150 receitas distribuídas em profissões como Mestre das Pílulas (Alquimia) e Mestre de Forja.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js:** Ambiente de execução principal.
* **whatsapp-web.js:** Biblioteca base para simular o cliente do WhatsApp Web e interceptar/responder mensagens.
* **Puppeteer:** Ferramenta de automação de navegador utilizada em conjunto com a biblioteca do WhatsApp para gerenciamento da sessão. *(Nota: O projeto foi adaptado com scripts de evasão e ilusão de plataforma para ser compatível também com compilação via Termux no Android)*.
* **SQLite3:** Banco de dados relacional leve para persistência completa do estado do mundo, rodando nativamente sem necessidade de infraestrutura de servidores.

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
* Node.js (versão LTS recomendada).
* Um terminal (Prompt de Comando, PowerShell, ou Termux para Android).
* Um número de WhatsApp ativo para servir como o Bot.

### 1. Clonando e Instalando Dependências
Clone este repositório e instale as bibliotecas necessárias:
```bash
# Clone o projeto (ou extraia os arquivos)
git clone [https://github.com/SeuUsuario/MeuWuxiaBot.git](https://github.com/SeuUsuario/MeuWuxiaBot.git)
cd MeuWuxiaBot

# Instale as dependências (whatsapp-web.js, sqlite3, dotenv, qrcode-terminal, etc.)
npm install

```
### 2. Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e configure as premissas do sistema:
```env
# Prefixo dos comandos
PREFIX=/

# Caminho para salvar o banco de dados
DB_PATH=./data/game.sqlite

# Configurações de Sessão do WhatsApp
SESSION_DIR=./.wwebjs_auth

```
### 3. Materialização do Banco de Dados (Migrations e Seeds)
Antes de ligar o bot, é obrigatório construir as tabelas do SQLite e injetar os dados do mundo (Raças, Itens, Técnicas, Áreas e Loja). Execute os comandos abaixo estritamente nesta ordem:
```bash
# 1. Criação das 25 Tabelas Sagradas (players, inventário, logs, etc)
node src/infra/db/runMigrations.js

# 2. Sementes de Raças, Clãs, Talentos e Profissões
node src/infra/db/runSeeds.js

# 3. Sementes de Técnicas e Manuais de Cultivo
node src/infra/db/runTechniques.js

# 4. Sementes de Itens do Mundo e Produtos de Artesanato
node src/infra/db/runItems.js

# 5. Sementes do Compêndio de Receitas (Alquimia, Forja, etc)
node src/infra/db/runRecipes.js

# 6. Sementes da Loja Oficial com Ouro, Pérolas e Cristais
node src/infra/db/runShop.js

# 7. Sementes da Geografia (5 Impérios, 25 Reinos, 125 Cidades)
node src/infra/db/runWorldExpansion.js

```
*(As execuções gerarão mensagens de sucesso no terminal confirmando a injeção do Qi)*.
### 4. Despertando o Sistema
Inicie o servidor local do bot:
```bash
npm start

```
Um QR Code será renderizado no terminal. Abra o WhatsApp no seu aparelho celular, vá em "Aparelhos Conectados", escaneie o código e o bot estará online e pronto para receber comandos.
## 📜 Comandos Disponíveis
Os comandos abaixo já estão 100% materializados e disponíveis para os jogadores interagirem com o bot:
### Criação e Personagem
 * /registrar [Nome] [M/F] - Gira a roleta do destino e cria um cultivador com atributos, raça e clã únicos.
 * /perfil - Mostra a origem, talento, profissão e o reino de cultivo do personagem.
 * /status - Exibe a energia atual, HP, Qi, Alma e Fadiga.
 * /atributos - Lista as estatísticas brutas (Força, Agilidade, Inteligência, Sorte, etc).
 * /inventario - Inspeciona os tesouros materiais, manuais e artefatos carregados.
### Caminho do Cultivo
 * /livros - Verifica os manuais e técnicas obtidas que estão em processo de estudo.
 * /compreender [ID] - Medita sobre um manual para ganhar porcentagem de compreensão.
 * /aprender [ID] - Tenta alcançar a epifania de uma técnica (requer no mínimo 50% de compreensão, sujeito a desvio de Qi em falhas).
 * /equipartecnica [ID] - Sela uma técnica dominada no Mar de Consciência para ativá-la.
 * /cultivar, /treinar, /meditar - Absorve energia baseada na sua técnica para ganhar XP nas trilhas de Espírito, Corpo e Alma (consome fadiga).
 * /romper [corpo|espirito|alma] - Tenta romper o limite celestial no nível 9/9 para avançar de Reino.
### Exploração do Mundo
 * /area - Mostra detalhes e nível de perigo da localização atual.
 * /lista area - Lista as cidades acessíveis dentro do seu Reino atual, bem como conexões para capitais e impérios.
 * /viajar [Nome ou ID] - Move o jogador fisicamente entre áreas e continentes.
 * /explorar - Realiza buscas na área, rolando probabilidades de encontro com monstros, itens raros, minérios ou NPCs (consome fadiga).
### Profissões e Artesanato
 * /profissao escolher [pill_master|forge_master|etc] - Escolhe uma vocação inicial.
 * /refinar [ID_Receita] - Tenta forjar pílulas ou elixires baseados em alquimia.
 * /forjar [ID_Receita] - Modela armas e armaduras gastando minérios e recursos.
### Economia e Mercado
 * /loja - Abre o Pavilhão de Comércio do sistema.
 * /comprar [ID] [Qtd] - Adquire itens do sistema gastando Ouro, Pérolas Espirituais ou Cristais Dao.
 * /vender [ID] [Qtd] - Descarta um item para o sistema em troca de Ouro mortal.
 * /mercado - Lista todos os anúncios de itens colocados à venda por outros jogadores.
 * /mercado vender [ID] [Preço] [Qtd] [Moeda] - Trava seu item do inventário e anuncia globalmente cobrando uma taxa de listagem de 2%.
 * /mercado comprar [ID_Anuncio] [Qtd] - Compra diretamente um item anunciado por outro jogador, transferindo fundos entre carteiras e cobrando imposto na transação.
## 📁 Estrutura do Projeto
A arquitetura do bot promove escalabilidade e fácil manutenção:
```text
MeuWuxiaBot/
├── src/
│   ├── application/        # Orquestração de casos de uso
│   │   ├── commands/       # O Cérebro (messageRouter.js)
│   │   ├── handlers/       # Manipuladores de respostas (UX Textual)
│   │   └── services/       # Regras de transação (Player, Economia, Cultivo)
│   ├── domain/             # Leis isoladas do jogo
│   │   └── rules/          # Mecânicas de RNG e Raridades (rarityRules.js)
│   ├── infra/              # Camada de Dados
│   │   └── db/             # Arquivos de conexão (SQLite)
│   │       └── migrations/ # Scripts de criação de tabelas e sementes (.sql)
│   ├── shared/             # Utilitários globais
│   │   └── utils/          # Rolagem de dados e matemática (random.js)
│   ├── transport/          # Conexão Externa
│   │   └── whatsapp/       # Conexão com a rede do WhatsApp (client.js)
│   └── index.js            # Ponto de entrada (Inicialização)
├── data/                   # Diretório onde o game.sqlite será gerado
├── package.json            # Identidade e dependências do Node.js
└── .env                    # Variáveis ocultas do ambiente

```
## 🤝 Contribuições e Próximos Sprints
Ainda temos Sprints mapeados nos nossos antigos pergaminhos de design! Os próximos passos envolvem as mecânicas sociais de comunicação (/conversar entre jogadores próximos) e a criação das majestosas Seitas Imortais (/seita criar, Tesouro da Seita e Guerras).
Se você deseja adicionar novas técnicas, itens, profissões ou refinar fórmulas de combate, sinta-se à vontade para realizar um *Fork*, forjar o seu código e submeter um *Pull Request*.
## ⚖️ Licença
Desenvolvido com o *Dao* no coração.
Este projeto é de código aberto sob a licença **MIT**. Sinta-se livre para ramificar, forjar novas técnicas e contribuir para o crescimento contínuo desta Seita.

