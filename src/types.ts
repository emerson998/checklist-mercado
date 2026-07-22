export type Categoria = "acougue" | "mercado" | "hortifruti" | "outros";

export const CATEGORIAS: { id: Categoria; nome: string; cor: string }[] = [
  { id: "acougue", nome: "Açougue", cor: "#e11d48" },
  { id: "mercado", nome: "Mercado", cor: "#2563eb" },
  { id: "hortifruti", nome: "Hortifruti", cor: "#16a34a" },
  { id: "outros", nome: "Outros", cor: "#a855f7" },
];

export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  categoria: Categoria;
  comprado: boolean;
  precoUnitario?: number;
}

export interface Compra {
  id: string;
  data: string; // ISO 8601
  itens: Item[];
  valorTotal: number;
}
