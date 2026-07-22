import { useRef, useState } from "react";
import type { Compra } from "../types";
import { baixarCsv, comprasParaCsv, csvParaCompras } from "../utils/csv";

interface BackupViewProps {
  historico: Compra[];
  onMesclar: (importado: Compra[]) => void;
  onSubstituir: (importado: Compra[]) => void;
}

export function BackupView({ historico, onMesclar, onSubstituir }: BackupViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendente, setPendente] = useState<Compra[] | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);

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
      setNomeArquivo(arquivo.name);
      setPendente(importado);
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-4 pb-24 md:pb-8">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Backup manual do seu histórico de compras — útil pra trocar de aparelho ou guardar uma cópia sem precisar
        criar conta.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📤</span>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">Exportar backup</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Gera um arquivo <code className="text-xs">.csv</code> com as {historico.length} compra(s) do seu
              histórico e baixa no dispositivo.
            </p>
          </div>
        </div>
        <button
          onClick={exportar}
          disabled={historico.length === 0}
          className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Exportar CSV
        </button>
        {historico.length === 0 && (
          <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
            Nenhuma compra no histórico ainda.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📥</span>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">Importar backup</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Lê um arquivo <code className="text-xs">.csv</code> exportado antes e restaura as compras — você
              escolhe se mescla ou substitui o histórico atual.
            </p>
          </div>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 w-full rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50
                     dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Escolher arquivo CSV
        </button>
        <input ref={inputRef} type="file" accept=".csv" hidden onChange={onArquivoSelecionado} />
      </div>

      {pendente && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Importar backup</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{nomeArquivo}</span> tem{" "}
              {pendente.length} compra(s). Substituir os dados atuais ou mesclar com o histórico existente?
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
