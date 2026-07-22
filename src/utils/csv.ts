import Papa from "papaparse";
import type { Compra, Item, Categoria } from "../types";

export interface CsvRow {
  compraId: string;
  data: string;
  item: string;
  quantidade: number;
  categoria: Categoria;
  comprado: boolean;
  precoUnitario: number | "";
  valorTotalCompra: number;
}

export function comprasParaCsv(compras: Compra[]): string {
  const linhas: CsvRow[] = compras.flatMap((compra) =>
    compra.itens.map((item) => ({
      compraId: compra.id,
      data: compra.data,
      item: item.nome,
      quantidade: item.quantidade,
      categoria: item.categoria,
      comprado: item.comprado,
      precoUnitario: item.precoUnitario ?? "",
      valorTotalCompra: compra.valorTotal,
    })),
  );
  return Papa.unparse(linhas);
}

export function baixarCsv(conteudo: string, nomeArquivo: string): void {
  const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

export function csvParaCompras(conteudo: string): Compra[] {
  const parsed = Papa.parse<CsvRow>(conteudo, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const porCompra = new Map<string, Compra>();
  for (const row of parsed.data) {
    if (!row.compraId) continue;
    let compra = porCompra.get(row.compraId);
    if (!compra) {
      compra = { id: row.compraId, data: row.data, itens: [], valorTotal: Number(row.valorTotalCompra) || 0 };
      porCompra.set(row.compraId, compra);
    }
    const item: Item = {
      id: `${row.compraId}-${compra.itens.length}`,
      nome: row.item,
      quantidade: Number(row.quantidade) || 1,
      categoria: row.categoria,
      comprado: Boolean(row.comprado),
      precoUnitario: row.precoUnitario === "" || row.precoUnitario === undefined ? undefined : Number(row.precoUnitario),
    };
    compra.itens.push(item);
  }
  return Array.from(porCompra.values());
}
