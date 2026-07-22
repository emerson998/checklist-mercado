import { useState } from "react";

interface NomeUsuarioModalProps {
  nomeAtual: string | null;
  onConfirmar: (nome: string) => void;
  onFechar: () => void;
}

export function NomeUsuarioModal({ nomeAtual, onConfirmar, onFechar }: NomeUsuarioModalProps) {
  const [nome, setNome] = useState(nomeAtual ?? "");

  function confirmar() {
    onConfirmar(nome.trim());
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 md:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Como você quer ser chamado(a)?</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Vira o nome da sua lista — ex: "Lista de Compras da Caroline". Pode deixar em branco.
        </p>

        <input
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && confirmar()}
          placeholder="Ex: Caroline"
          className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none
                     focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={onFechar}
            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50
                       dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Agora não
          </button>
          <button
            onClick={confirmar}
            className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
