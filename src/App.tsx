import { useState } from "react";
import { NavTabs, type Aba } from "./components/NavTabs";
import { CarrinhoView } from "./components/CarrinhoView";
import { HistoricoView } from "./components/HistoricoView";
import { GastosView } from "./components/GastosView";
import { LoginButton } from "./components/LoginButton";
import { BackupView } from "./components/BackupView";
import { NomeUsuarioModal } from "./components/NomeUsuarioModal";
import { useCompras } from "./hooks/useCompras";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useNomeUsuario } from "./hooks/useNomeUsuario";

export default function App() {
  const [aba, setAba] = useState<Aba>("carrinho");
  const compras = useCompras();
  const { user, entrarCom, sair } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [nomeUsuario, setNomeUsuario] = useNomeUsuario();
  const [editandoNome, setEditandoNome] = useState(false);

  const titulo = nomeUsuario ? `Compras ${nomeUsuario}` : "Lista de Compras";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-lg items-center justify-between p-4">
          <button
            onClick={() => setEditandoNome(true)}
            className="truncate text-left text-lg font-bold text-slate-900 hover:opacity-70 dark:text-white"
            title="Editar nome"
          >
            🛒 {titulo}
          </button>
          <div className="flex items-center gap-4">
            <LoginButton user={user} onEntrar={entrarCom} onSair={sair} />
            <button
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
              title={theme === "light" ? "Modo escuro" : "Modo claro"}
              className="text-base leading-none"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <NavTabs abaAtiva={aba} onChange={setAba} />
        </div>
      </header>

      <main>
        {aba === "carrinho" && (
          <CarrinhoView
            carrinho={compras.carrinho}
            onAdicionar={compras.adicionarItem}
            onToggleComprado={compras.toggleComprado}
            onEditarCategoria={(id, categoria) => compras.editarItem(id, { categoria })}
            onRemover={compras.removerItem}
            onFinalizar={compras.finalizarCompra}
          />
        )}
        {aba === "historico" && <HistoricoView historico={compras.historico} />}
        {aba === "gastos" && <GastosView historico={compras.historico} theme={theme} />}
        {aba === "backup" && (
          <BackupView
            historico={compras.historico}
            onMesclar={compras.mesclarHistorico}
            onSubstituir={compras.substituirHistorico}
          />
        )}
      </main>

      <div className="md:hidden">
        <NavTabs abaAtiva={aba} onChange={setAba} />
      </div>

      {(editandoNome || nomeUsuario === null) && (
        <NomeUsuarioModal
          nomeAtual={nomeUsuario}
          onConfirmar={(nome) => {
            setNomeUsuario(nome);
            setEditandoNome(false);
          }}
          onFechar={() => {
            setNomeUsuario((atual) => atual ?? "");
            setEditandoNome(false);
          }}
        />
      )}
    </div>
  );
}
