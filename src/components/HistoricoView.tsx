import { useState } from "react";
import type { Compra } from "../types";
import { CATEGORIAS } from "../types";

interface HistoricoViewProps {
  historico: Compra[];
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function HistoricoView({ historico }: HistoricoViewProps) {
  const [selecionada, setSelecionada] = useState<string | null>(null);

  if (historico.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">Nenhuma compra finalizada ainda.</p>
    );
  }

  const compra = historico.find((c) => c.id === selecionada);

  if (compra) {
    return (
      <div className="mx-auto max-w-lg p-4 pb-24 md:pb-8">
        <button
          onClick={() => setSelecionada(null)}
          className="mb-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
        >
          ← Voltar
        </button>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{formatarData(compra.data)}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{formatarValor(compra.valorTotal)} no total</p>

        <ul className="mt-4 flex flex-col gap-2">
          {compra.itens.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800 dark:text-white"
            >
              <span>
                {item.quantidade > 1 && <span className="text-slate-500 dark:text-slate-400">{item.quantidade}× </span>}
                {item.nome}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {CATEGORIAS.find((c) => c.id === item.categoria)?.nome}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg p-4 pb-24 md:pb-8">
      <ul className="flex flex-col gap-2">
        {historico.map((compra) => (
          <li key={compra.id}>
            <button
              onClick={() => setSelecionada(compra.id)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-emerald-300
                         dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{formatarData(compra.data)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{compra.itens.length} itens</p>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{formatarValor(compra.valorTotal)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
