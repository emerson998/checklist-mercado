import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "lista-compras:tema";

function temaInicial(): Theme {
  const salvo = window.localStorage.getItem(STORAGE_KEY);
  if (salvo === "light" || salvo === "dark") return salvo;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(temaInicial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((atual) => (atual === "light" ? "dark" : "light"));
  }

  return { theme, toggleTheme };
}
