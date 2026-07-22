import { useRef, useState } from "react";
import type { Compra } from "../types";
import { baixarCsv, comprasParaCsv, csvParaCompras } from "../utils/csv";

interface BackupCsvProps {
  historico: Compra[];
  onMesclar: (importado: Compra[]) => void;
  onSubstituir: (importado: Compra[]) => void;
}

export function BackupCsv({ historico, onMesclar, onSubstituir }: BackupCsvProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendente, setPendente] = useState<Compra[] | null>(null);

  function exportar() {
    const csv = comprasParaCsv(historico);
    baixarCsv(csv, `lista-de-compras-backup-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  function onArquivoSelecionado(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    arquivo.text().then((conteudo) => {
      const importado = csvParaCompras(conteudo);
      if (importado.length === 0) return;
      setPendente(importado);
    });
  }

  return (
    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
      <button onClick={exportar} className="hover:text-slate-700 dark:hover:text-slate-200">
        Exportar CSV
      </button>
      <button onClick={() => inputRef.current?.click()} className="hover:text-slate-700 dark:hover:text-slate-200">
        Importar CSV
      </button>
      <input ref={inputRef} type="file" accept=".csv" hidden onChange={onArquivoSelecionado} />

      {pendente && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Importar backup</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              O arquivo tem {pendente.length} compra(s). Substituir os dados atuais ou mesclar com o histórico
              existente?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  onMesclar(pendente);
                  setPendente(null);
                }}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50
                           dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Mesclar
              </button>
              <button
                onClick={() => {
                  onSubstituir(pendente);
                  setPendente(null);
                }}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Substituir
              </button>
            </div>
            <button
              onClick={() => setPendente(null)}
              className="mt-3 w-full text-center text-xs font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
