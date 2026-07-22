import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "lista-compras:nome";

/** null = nunca perguntado ainda; "" = perguntado e a pessoa preferiu pular. */
export function useNomeUsuario() {
  return useLocalStorage<string | null>(STORAGE_KEY, null);
}
