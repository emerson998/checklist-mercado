# lista-de-compras

App de lista de compras com carrinho, histórico e gráfico de gastos. Sem login por padrão —
tudo fica salvo no `localStorage` do navegador. Login (Google/GitHub via Supabase) é opcional,
só pra sincronizar entre aparelhos.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Funcionalidades

- **Carrinho**: adicionar item digitando algo como `2 arroz` (quantidade + nome) — a categoria
  é sugerida automaticamente por palavra-chave (`src/utils/categorize.ts`), mas dá pra trocar
  no próprio item. Checkbox grande pra marcar como comprado (pensado pra usar no celular, dentro
  do mercado). Botão "Finalizar compra" pede o valor total gasto e move os itens pro histórico.
- **Histórico**: lista de compras passadas, clicável pra ver os itens de cada uma.
- **Gastos**: gráfico de linha (gasto por compra ao longo do tempo) e de pizza (gasto por
  categoria), com filtro por semana/mês/ano/tudo.
- **Backup CSV**: botões "Exportar"/"Importar" no topo — gera/lê um `.csv` com todo o histórico
  (colunas em `src/utils/csv.ts`). Importar pergunta se deve mesclar ou substituir os dados atuais.
- **Login opcional**: só aparece se as variáveis do Supabase estiverem configuradas (ver abaixo).
  Sem elas, o botão de login some e o app funciona 100% local — nada quebra.

## Login opcional (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com) e ative os provedores Google/GitHub
   em Authentication → Providers.
2. Copie `.env.example` pra `.env` e preencha `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`
   (Project Settings → API).
3. Crie uma tabela `compras` (colunas: `id`, `user_id`, `data`, `itens` jsonb, `valor_total`) se
   quiser persistir o histórico sincronizado — o app atual sincroniza só a sessão de auth; a
   migração dos dados locais pra tabela é o próximo passo natural se for expandir o projeto.
4. Depois do deploy, adicione a URL de produção como redirect autorizada no Supabase e no
   provedor OAuth (Google/GitHub) — senão o login quebra em produção mesmo funcionando local.

## Estrutura

```
src/
├── types.ts                 # Item, Compra, Categoria
├── hooks/
│   ├── useLocalStorage.ts    # persistência genérica em localStorage
│   ├── useCompras.ts         # carrinho + histórico (regras de negócio)
│   └── useAuth.ts            # sessão Supabase (no-op se não configurado)
├── utils/
│   ├── categorize.ts         # sugestão de categoria por palavra-chave
│   ├── parseItemInput.ts     # extrai quantidade + nome de "2 arroz"
│   └── csv.ts                # exportar/importar backup em CSV
├── lib/supabase.ts           # client Supabase (null se env não configurado)
├── components/               # uma tela/peça de UI por arquivo
└── App.tsx                   # monta as abas (Carrinho/Histórico/Gastos)
```

## Deploy (Vercel)

```bash
npm i -g vercel
vercel        # preview
vercel --prod # produção
```

Se for usar login, adicione `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` nas variáveis de
ambiente do projeto na Vercel antes do deploy.
# checklist-mercado
