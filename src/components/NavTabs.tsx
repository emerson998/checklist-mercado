export type Aba = "carrinho" | "historico" | "gastos" | "backup";

const ABAS: { id: Aba; label: string; icon: string }[] = [
  { id: "carrinho", label: "Carrinho", icon: "🛒" },
  { id: "historico", label: "Histórico", icon: "🧾" },
  { id: "gastos", label: "Gastos", icon: "📊" },
  { id: "backup", label: "Backup", icon: "💾" },
];

interface NavTabsProps {
  abaAtiva: Aba;
  onChange: (aba: Aba) => void;
}

export function NavTabs({ abaAtiva, onChange }: NavTabsProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white/95 backdrop-blur
                 md:static md:border-t-0 md:border-b md:bg-white
                 dark:border-slate-800 dark:bg-slate-900/95 dark:md:bg-slate-900"
    >
      {ABAS.map((aba) => {
        const ativo = aba.id === abaAtiva;
        return (
          <button
            key={aba.id}
            onClick={() => onChange(aba.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors
                       md:flex-row md:justify-center md:gap-2 md:py-3.5 md:text-sm
                       ${ativo ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
          >
            <span className="text-lg md:text-base">{aba.icon}</span>
            <span>{aba.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
