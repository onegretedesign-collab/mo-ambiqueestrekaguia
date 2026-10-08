import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, Key, X, Check, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal = ({ isOpen, onClose, onSuccess }: AdminLoginModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const userClean = username.trim().toLowerCase();
    const passClean = password.trim();

    // Check credentials: Login: Estregaguia (or Estrelaguia) | Senha: Estrelaguia
    const isUserValid = userClean === "estregaguia" || userClean === "estrelaguia";
    const isPassValid = passClean.toLowerCase() === "estrelaguia";

    setTimeout(() => {
      setIsLoading(false);
      if (isUserValid && isPassValid) {
        setUsername("");
        setPassword("");
        onSuccess();
      } else {
        setError("Usuário ou senha incorretos. Verifique suas credenciais.");
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#0F1118] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary block">
                Painel Restrito
              </span>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                Controle de Arquivos
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/50 mb-6 leading-relaxed">
          Digite os dados de acesso para gerenciar arquivos, imagens e links dos botões do site.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Login
            </label>
            <input
              type="text"
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Digite o login de acesso"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs font-medium focus:border-primary focus:outline-none transition-all placeholder:text-white/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-primary" /> Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Digite a senha"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs font-medium focus:border-primary focus:outline-none transition-all placeholder:text-white/20"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-orange-500 text-black font-black uppercase text-xs tracking-wider transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Entrando...</span>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Acesso Seguro Autorizado
          </span>
          <span>Estrela Guia &copy; 2026</span>
        </div>
      </motion.div>
    </div>
  );
};
