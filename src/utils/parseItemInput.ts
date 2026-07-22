/** Extrai quantidade + nome de uma entrada livre tipo "2 arroz" ou "feijão"
 * (sem número no início = quantidade 1). */
export function parseItemInput(raw: string): { quantidade: number; nome: string } {
  const texto = raw.trim();
  const match = texto.match(/^(\d+)\s+(.+)$/);
  if (match) {
    return { quantidade: Math.max(1, parseInt(match[1], 10)), nome: match[2].trim() };
  }
  return { quantidade: 1, nome: texto };
}
