import type { Categoria } from "../types";

// Palavras-chave locais — sem IA/API paga, so um mapa de substrings comuns.
const KEYWORDS: Record<Categoria, string[]> = {
  acougue: [
    "picanha", "alcatra", "frango", "carne", "linguica", "linguiça", "bacon",
    "costela", "file", "filé", "peixe", "camarao", "camarão", "bisteca", "figado", "fígado",
  ],
  hortifruti: [
    "alface", "tomate", "cebola", "batata", "cenoura", "banana", "maca", "maçã",
    "laranja", "limao", "limão", "uva", "abacate", "pepino", "couve", "brocolis",
    "brócolis", "morango", "melancia", "mamao", "mamão", "alho", "pimentao", "pimentão",
  ],
  mercado: [
    "arroz", "feijao", "feijão", "acucar", "açúcar", "sal", "oleo", "óleo",
    "macarrao", "macarrão", "leite", "cafe", "café", "pao", "pão", "manteiga",
    "queijo", "presunto", "iogurte", "biscoito", "refrigerante", "cerveja", "agua", "água",
  ],
  outros: [],
};

export function sugerirCategoria(nomeDigitado: string): Categoria {
  const nome = nomeDigitado.toLowerCase().trim();
  if (!nome) return "outros";

  for (const categoria of ["acougue", "hortifruti", "mercado"] as const) {
    if (KEYWORDS[categoria].some((palavra) => nome.includes(palavra))) {
      return categoria;
    }
  }
  return "outros";
}
