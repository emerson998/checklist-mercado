import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { sugerirCategoria } from "../utils/categorize";
import { parseItemInput } from "../utils/parseItemInput";
import type { Categoria, Compra, Item } from "../types";

const CARRINHO_KEY = "lista-compras:carrinho";
const HISTORICO_KEY = "lista-compras:historico";

function novoId(): string {
  return crypto.randomUUID();
}

export function useCompras() {
  const [carrinho, setCarrinho] = useLocalStorage<Item[]>(CARRINHO_KEY, []);
  const [historico, setHistorico] = useLocalStorage<Compra[]>(HISTORICO_KEY, []);

  const adicionarItem = useCallback(
    (entrada: string, categoriaManual?: Categoria) => {
      const { quantidade, nome } = parseItemInput(entrada);
      if (!nome) return;
      const item: Item = {
        id: novoId(),
        nome,
        quantidade,
        categoria: categoriaManual ?? sugerirCategoria(nome),
        comprado: false,
      };
      setCarrinho((atual) => [...atual, item]);
    },
    [setCarrinho],
  );

  const toggleComprado = useCallback(
    (id: string) => {
      setCarrinho((atual) => atual.map((item) => (item.id === id ? { ...item, comprado: !item.comprado } : item)));
    },
    [setCarrinho],
  );

  const editarItem = useCallback(
    (id: string, patch: Partial<Item>) => {
      setCarrinho((atual) => atual.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [setCarrinho],
  );

  const removerItem = useCallback(
    (id: string) => {
      setCarrinho((atual) => atual.filter((item) => item.id !== id));
    },
    [setCarrinho],
  );

  const finalizarCompra = useCallback(
    (valorTotal: number) => {
      if (carrinho.length === 0) return;
      const compra: Compra = {
        id: novoId(),
        data: new Date().toISOString(),
        itens: carrinho,
        valorTotal,
      };
      setHistorico((atual) => [compra, ...atual]);
      setCarrinho([]);
    },
    [carrinho, setHistorico, setCarrinho],
  );

  /** Mescla compras importadas de um CSV com o historico atual, evitando
   * duplicar compras que ja existem (mesmo id). */
  const mesclarHistorico = useCallback(
    (importado: Compra[]) => {
      setHistorico((atual) => {
        const existentes = new Set(atual.map((c) => c.id));
        const novas = importado.filter((c) => !existentes.has(c.id));
        return [...atual, ...novas].sort((a, b) => b.data.localeCompare(a.data));
      });
    },
    [setHistorico],
  );

  const substituirHistorico = useCallback(
    (importado: Compra[]) => {
      setHistorico([...importado].sort((a, b) => b.data.localeCompare(a.data)));
    },
    [setHistorico],
  );

  return {
    carrinho,
    historico,
    adicionarItem,
    toggleComprado,
    editarItem,
    removerItem,
    finalizarCompra,
    mesclarHistorico,
    substituirHistorico,
  };
}
