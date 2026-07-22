import { useState } from "react";

interface FinalizarCompraModalProps {
  onConfirmar: (valorTotal: number) => void;
  onCancelar: () => void;
}

export function FinalizarCompraModal({ onConfirmar, onCancelar }: FinalizarCompraModalProps) {
  const [valor, setValor] = useState("");
  const numero = Number(valor.replace(",", "."));
  const valido = valor.trim() !== "" && !Number.isNaN(numero) && numero >= 0;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 md:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Finalizar compra</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Quanto você gastou no total?</p>

        <label className="mt-4 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 focus-within:border-emerald-500 dark:border-slate-700">
          <span className="text-slate-400">R$</span>
          <input
            autoFocus
            inputMode="decimal"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && valido) onConfirmar(numero);
            }}
            className="w-full bg-transparent text-slate-900 outline-none dark:text-white"
          />
        </label>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50
                       dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            disabled={!valido}
            onClick={() => onConfirmar(numero)}
            className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-40"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
