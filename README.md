# CondoToalhas - Explicação do Código

Este projeto é uma aplicação web simples para controlar o inventário de toalhas (limpas, sujas, na lavandaria, etc.) usando HTML + JavaScript puro e `localStorage`.

## Arquivo principal
- `index.html`: versão original.
- `index-modular.html`: versão modular com funções separadas e comentários line-by-line.

## Como o `index-modular.html` funciona

### 1) Estrutura HTML
1. O cabeçalho cria a barra superior com título e abas (Dashboard e Histórico).
2. O `main` tem duas seções:
   - `#view-dashboard`: mostra ações e resumo de estoque.
   - `#view-history`: mostra histórico completo (oculto por padrão).
3. Um modal (`#transaction-modal`) é usado para inserir transações (quantidade, e opcionalmente responsável).

### 2) Inicialização do aplicativo
No final do arquivo, o script começa executando `document.addEventListener('DOMContentLoaded', initializeApp);`.

#### `initializeApp()`:
- Captura referências de elementos (função `initElementRefs`).
- Registra eventos (função `bindEvents`).
- Inicializa `localStorage` com valores padrão (função `dbInit`).
- Cria ícones Lucide (`lucide.createIcons()`).
- Renderiza inventário e histórico.
- Alterna para aba ativa default (`dashboard`).

### 3) Dados salvos localmente
O app usa `localStorage` com duas chaves:
- `condo_inventory_html_v4` → inventário atual.
- `condo_transactions_html_v4` → lista de transações.

Funções de leitura/gravação:
- `getInventory()` / `saveInventory(inv)`
- `getTransactions()` / `saveTransaction(tx)`

### 4) Renderização
- `renderInventory()` atualiza valores dos cards de estoque.
- `renderHistory()` cria o HTML do histórico completo e lista recente.
  - Se não houver transações, exibe mensagens de “nenhuma movimentação”.

### 5) Modos e abas
- `switchTab(tabName)` alterna as abas e mostra/esconde as seções.
- Botões desktop e mobile chamam `switchTab('dashboard')` ou `switchTab('history')`.

### 6) Modal de transações
- `openModal(action)` abre o modal configurando título, dica, cor do botão e se deve exibir campo de nome.
- `closeModal()` fecha.
- `showError(msg)` / `hideError()` controlam erro dentro do modal.

### 7) Lógica de transação e inventário
- `handleTransactionSubmit(event)` é chamado no submit do formulário.
- Valida quantidade (`Number.isInteger(amount)` e `amount > 0`).
- Executa `applyInventoryChange(action, amount, inventory)`:
  - `move_to_gym`: retira de estoque e acrescenta à academia.
  - `use`: retira da academia e vira sujas.
  - `send`: retira sujas e manda para lavanderia.
  - `receive`: retira lavanderia e volta para estoque.
  - `add_new`: incrementa estoque + total.
  - `remove_old`: deduz estoque e total.
- Se houver erro (quantidade insuficiente), mostra mensagem.
- Se válido: salva inventário e transação, fecha modal, rerenderiza.

### 8) Transações e histórico
- Transações são objetos com:
  - `id`, `type`, `amount`, `date`, `note`
- `saveTransaction()` adiciona no início da lista.
- `renderHistory()` usa `TRANSACTION_STYLES` para exibir ícones e cores diferentes.

## Como testar localmente
1. Abra `index-modular.html` no navegador (ou use Live Server no VS Code).
2. Clique em qualquer botão `Enviar`, `Receber`, `Registar Compra`, etc.
3. Preencha quantidade e confirme.
4. Observe as atualizações de cards e histórico.

## Dicas para você como iniciante
- `const` define valor fixo, `let` permite reatribuição.
- `document.getElementById('id')` busca elemento na página.
- `addEventListener('click', ...)` registra clique.
- `localStorage.setItem` e `getItem` guardam e ler dados no navegador.
- O app renderiza a interface com `innerHTML` e texto com `textContent`.

---

Se quiser, posso adicionar no `index-modular.html` um comentário adicional no topo com um “mapa de funções” para você ir clicando e encontrar cada parte rápido.