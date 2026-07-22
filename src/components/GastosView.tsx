import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import type { Compra } from "../types";
import { CATEGORIAS } from "../types";
import type { Theme } from "../hooks/useTheme";

interface GastosViewProps {
  historico: Compra[];
  theme: Theme;
}

type Periodo = "semana" | "mes" | "ano" | "tudo";

const PERIODOS: { id: Periodo; label: string }[] = [
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mês" },
  { id: "ano", label: "Ano" },
  { id: "tudo", label: "Tudo" },
];

function dentroDoPeriodo(dataIso: string, periodo: Periodo): boolean {
  if (periodo === "tudo") return true;
  const dias = { semana: 7, mes: 30, ano: 365 }[periodo];
  const limite = Date.now() - dias * 24 * 60 * 60 * 1000;
  return new Date(dataIso).getTime() >= limite;
}

function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function GastosView({ historico, theme }: GastosViewProps) {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const corGrade = theme === "dark" ? "#334155" : "#e2e8f0";
  const corEixo = theme === "dark" ? "#94a3b8" : "#64748b";

  const filtradas = useMemo(
    () => historico.filter((c) => dentroDoPeriodo(c.data, periodo)).sort((a, b) => a.data.localeCompare(b.data)),
    [historico, periodo],
  );

  const porCompra = useMemo(
    () =>
      filtradas.map((c) => ({
        data: new Date(c.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        valor: c.valorTotal,
      })),
    [filtradas],
  );

  const porCategoria = useMemo(() => {
    // Rateia o valorTotal da compra entre categorias pela proporcao de itens
    // (nao ha preco por item obrigatorio, so isso e uma estimativa razoavel).
    const totais = new Map<string, number>();
    for (const compra of filtradas) {
      if (compra.itens.length === 0) continue;
      const porItem = compra.valorTotal / compra.itens.length;
      for (const item of compra.itens) {
        totais.set(item.categoria, (totais.get(item.categoria) ?? 0) + porItem);
      }
    }
    return CATEGORIAS.map((c) => ({ nome: c.nome, valor: totais.get(c.id) ?? 0, cor: c.cor })).filter(
      (c) => c.valor > 0,
    );
  }, [filtradas]);

  const totalPeriodo = filtradas.reduce((acc, c) => acc + c.valorTotal, 0);

  return (
    <div className="mx-auto max-w-lg p-4 pb-24 md:pb-8">
      <div className="flex gap-2">
        {PERIODOS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriodo(p.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium
                       ${
                         periodo === p.id
                           ? "bg-slate-900 text-white dark:bg-emerald-600"
                           : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                       }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Total no período:{" "}
        <span className="font-semibold text-slate-900 dark:text-white">{formatarValor(totalPeriodo)}</span>
      </p>

      {filtradas.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">Sem compras nesse período.</p>
      ) : (
        <>
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Gasto por compra</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={porCompra}>
                <CartesianGrid strokeDasharray="3 3" stroke={corGrade} />
                <XAxis dataKey="data" fontSize={12} stroke={corEixo} />
                <YAxis fontSize={12} width={48} stroke={corEixo} />
                <Tooltip
                  formatter={(v) => formatarValor(Number(v))}
                  contentStyle={
                    theme === "dark"
                      ? { background: "#1e293b", border: "1px solid #334155", color: "#fff" }
                      : undefined
                  }
                />
                <Line type="monotone" dataKey="valor" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Gasto por categoria</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={porCategoria} dataKey="valor" nameKey="nome" outerRadius={90} label>
                  {porCategoria.map((c) => (
                    <Cell key={c.nome} fill={c.cor} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatarValor(Number(v))}
                  contentStyle={
                    theme === "dark"
                      ? { background: "#1e293b", border: "1px solid #334155", color: "#fff" }
                      : undefined
                  }
                />
                <Legend wrapperStyle={{ color: corEixo }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
