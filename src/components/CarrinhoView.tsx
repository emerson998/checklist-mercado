import { useState } from "react";
import { CATEGORIAS } from "../types";
import type { Categoria, Item } from "../types";
import { FinalizarCompraModal } from "./FinalizarCompraModal";

interface CarrinhoViewProps {
  carrinho: Item[];
  onAdicionar: (entrada: string) => void;
  onToggleComprado: (id: string) => void;
  onEditarCategoria: (id: string, categoria: Categoria) => void;
  onRemover: (id: string) => void;
  onFinalizar: (valorTotal: number) => void;
}

function corCategoria(categoria: Categoria): string {
  return CATEGORIAS.find((c) => c.id === categoria)?.cor ?? "#94a3b8";
}

export function CarrinhoView({
  carrinho,
  onAdicionar,
  onToggleComprado,
  onEditarCategoria,
  onRemover,
  onFinalizar,
}: CarrinhoViewProps) {
  const [entrada, setEntrada] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  function handleAdicionar() {
    if (!entrada.trim()) return;
    onAdicionar(entrada);
    setEntrada("");
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-4 pb-24 md:pb-8">
      <div className="flex gap-2">
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdicionar()}
          placeholder='Ex: "2 arroz" ou "alface"'
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none
                     focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />
        <button
          onClick={handleAdicionar}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Adicionar
        </button>
      </div>

      {carrinho.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
          Sua lista está vazia — adicione o primeiro item acima.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {carrinho.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm
                         dark:border-slate-800 dark:bg-slate-900
                         ${item.comprado ? "opacity-50" : ""}`}
            >
              <button
                onClick={() => onToggleComprado(item.id)}
                aria-label={item.comprado ? "Marcar como não comprado" : "Marcar como comprado"}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-white transition-colors
                           ${item.comprado ? "border-emerald-600 bg-emerald-600" : "border-slate-300 dark:border-slate-600"}`}
              >
                {item.comprado && "✓"}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`truncate font-medium text-slate-900 dark:text-white ${item.comprado ? "line-through" : ""}`}>
                  {item.quantidade > 1 && <span className="text-slate-500 dark:text-slate-400">{item.quantidade}× </span>}
                  {item.nome}
                </p>
                <select
                  value={item.categoria}
                  onChange={(e) => onEditarCategoria(item.id, e.target.value as Categoria)}
                  style={{ color: corCategoria(item.categoria) }}
                  className="mt-0.5 bg-transparent text-xs font-medium outline-none"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onRemover(item.id)}
                aria-label="Remover item"
                className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500
                           dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {carrinho.length > 0 && (
        <button
          onClick={() => setMostrarModal(true)}
          className="mt-2 rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800
                     dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          Finalizar compra
        </button>
      )}

      {mostrarModal && (
        <FinalizarCompraModal
          onCancelar={() => setMostrarModal(false)}
          onConfirmar={(valor) => {
            onFinalizar(valor);
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
}
