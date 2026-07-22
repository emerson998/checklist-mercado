import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseConfigurado } from "../lib/supabase";

interface LoginButtonProps {
  user: User | null;
  onEntrar: (provider: "google" | "github") => void;
  onSair: () => void;
}

export function LoginButton({ user, onEntrar, onSair }: LoginButtonProps) {
  const [aberto, setAberto] = useState(false);

  if (!supabaseConfigurado()) return null;

  if (user) {
    return (
      <button
        onClick={onSair}
        className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Sair ({user.email ?? "conta"})
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setAberto((v) => !v)}
        className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Entrar para sincronizar
      </button>
      {aberto && (
        <div className="absolute right-0 z-10 mt-2 flex w-44 flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg
                        dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={() => onEntrar("google")}
            className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Continuar com Google
          </button>
          <button
            onClick={() => onEntrar("github")}
            className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Continuar com GitHub
          </button>
        </div>
      )}
    </div>
  );
}
