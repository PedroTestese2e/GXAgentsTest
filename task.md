# Mini IDE Genexus AI - Checkpoints e Tasks

Este documento servirá como nosso guia passo a passo, dividido em **Sprints**, contendo todas as **Tasks** necessárias para levar a Mini IDE do zero ao funcionamento completo, integrando a skill `nexa` e o GeneXus SDK.

## Sprint 1: Fundação do Projeto
*Objetivo: Estabelecer os repositórios, a estrutura de pastas e a comunicação básica entre Frontend e Backend.*

- [x] **Task 1.1**: Inicializar a estrutura do Backend (Node.js com Express e TypeScript).
- [x] **Task 1.2**: Inicializar a estrutura do Frontend (Vite + React + CSS).
- [x] **Task 1.3**: Configurar rotas básicas de saúde (`/ping`) para garantir que Front e Back estão se comunicando.
- [x] **Task 1.4**: Configurar scripts locais (ex: `concurrently`) para rodar Front e Back com um único comando.

## Sprint 2: O Motor de IA e Skill Nexa
*Objetivo: Integrar a LLM e dar o conhecimento do GeneXus a ela através da skill nexa.*

- [x] **Task 2.1**: Baixar a skill `nexa` (arquivos `SKILL.md` etc) do repositório oficial do GeneXus.
- [x] **Task 2.2**: Criar módulo de carregamento e parseamento do arquivo `SKILL.md` no backend.
- [x] **Task 2.3**: Integrar SDK da LLM (ex: OpenAI) no backend.
- [x] **Task 2.4**: Criar endpoint `/api/chat` que recebe a mensagem do usuário, injeta a skill `nexa` como *System Prompt* e retorna o streaming de texto gerado pela LLM.

## Sprint 3: A Interface da Mini IDE
*Objetivo: Criar uma experiência visual premium de chat e visualização de código para o usuário.*

- [ ] **Task 3.1**: Desenvolver o layout principal da IDE (Menu lateral, Painel de Chat à esquerda, Painel de Código à direita).
- [ ] **Task 3.2**: Implementar o fluxo de Chat (bolhas de mensagem do usuário e da IA, com indicador de digitação).
- [ ] **Task 3.3**: Integrar o `Monaco Editor` no Painel de Código para exibir sintaxe de forma amigável.
- [ ] **Task 3.4**: Conectar o Frontend ao endpoint `/api/chat` do Backend e renderizar a resposta.

## Sprint 4: Controle e Aprovação (Diff & Extract)
*Objetivo: Separar o "bate-papo" do "código gerado" e permitir que o usuário aprove as alterações.*

- [ ] **Task 4.1**: Implementar lógica no Backend (ou Frontend) para extrair blocos de código (ex: ` ```genexus ... ``` `) do texto retornado pela IA.
- [ ] **Task 4.2**: Mostrar o código extraído diretamente no Monaco Editor.
- [ ] **Task 4.3**: Adicionar botão "Aprovar Alterações (Aplicar na KB)" na interface.
- [ ] **Task 4.4**: Criar endpoint `/api/apply-changes` no backend que receberá o código aprovado.

## Sprint 5: O KB Connector (C# SDK) - Core
*Objetivo: Criar o utilitário que realmente abre a Knowledge Base do GeneXus.*

- [ ] **Task 5.1**: Criar projeto Console Application em C# (.NET Framework ou .NET Core dependendo da versão do GX).
- [ ] **Task 5.2**: Adicionar referências e DLLs necessárias do GeneXus Platform SDK (`Genexus.Server.API`, `Genexus.Common`, etc).
- [ ] **Task 5.3**: Implementar método para conectar e abrir uma KB local dado um caminho de diretório.
- [ ] **Task 5.4**: Compilar o utilitário C# CLI em um executável (.exe ou dll invocável).

## Sprint 6: A Tradução e Aplicação de Código
*Objetivo: Fazer o C# CLI entender o formato de texto curto da skill `nexa` e transformá-lo em objetos na KB.*

- [ ] **Task 6.1**: Implementar parser no utilitário C# que lê a string recebida (ex: `Transaction Customer { ... }`) e mapeia para a estrutura de objetos do SDK.
- [ ] **Task 6.2**: Usar os métodos do SDK para criar/salvar as Properties, Rules e Structure do objeto na KB aberta.
- [ ] **Task 6.3**: Implementar no Node.js a execução desse CLI via `child_process.exec`, passando o código aprovado pelo usuário no Frontend.
- [ ] **Task 6.4**: Retornar o sucesso (ou log de erros do GeneXus) para o Frontend.

## Sprint 7: Polimento Final e Testes
*Objetivo: Garantir estabilidade e fluxo perfeito End-to-End.*

- [ ] **Task 7.1**: Tratamento de erros caso a KB esteja bloqueada (em uso por outra instância do GX).
- [ ] **Task 7.2**: Refinamento de UI/UX (loaders, notificações de sucesso).
- [ ] **Task 7.3**: Teste de ponta-a-ponta: Pedir uma transação de "Produto" e vê-la aparecer magicamente dentro do GeneXus aberto.
