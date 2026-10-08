import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Menu, X, Ticket, Heart, Search, Shield, ChevronDown } from "lucide-react";

interface OTicketNavbarProps {
  currentView: "home" | "transparency" | "shows";
  onChangeView: (view: "home" | "transparency" | "shows") => void;
  onOpenDonation: () => void;
  onOpenQuickTicket: () => void;
}

export const OTicketNavbar = ({
  currentView,
  onChangeView,
  onOpenDonation,
  onOpenQuickTicket
}: OTicketNavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Início", href: "#início", view: "home" as const },
    { label: "Shows & Eventos", href: "#shows-eventos", view: "shows" as const },
    { label: "Projetos", href: "#projetos", view: "home" as const },
    { label: "Galeria de Fotos", href: "#galeria", view: "home" as const },
    { label: "Transparência", href: "#transparencia", view: "transparency" as const }
  ];

  const handleNavClick = (link: typeof navLinks[number]) => {
    setMobileOpen(false);
    if (link.view === "shows") {
      onChangeView("shows");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link.view === "transparency") {
      onChangeView("transparency");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (currentView !== "home") {
        onChangeView("home");
        setTimeout(() => {
          const el = document.querySelector(link.href);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Top Banner (City selector, contact, announcements) */}
      <div className="bg-[#050608] border-b border-white/5 py-2 px-6 text-[11px] text-white/50 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <strong>Uberlândia, MG</strong> · Rua do Dólar, 290 - Bairro São Jorge
            </span>
            <span className="text-white/20">|</span>
            <span className="text-white/60">Terno de Moçambique Estrela Guia · Fundado em 2002</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/mocambique_estrela_guia?igsh=aDh6OTExamExb3hv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              Instagram Oficial
            </a>
            <span className="text-white/20">·</span>
            <span className="text-amber-400/90 font-bold uppercase text-[10px] tracking-wider">
              Ponto de Cultura Estadual
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0A0C11]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          {/* Brand */}
          <div
            onClick={() => {
              onChangeView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-black font-black shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-lg font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors block leading-tight">
                Estrela Guia
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary block leading-none">
                Eventos & Cultura
              </span>
            </div>
          </div>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive =
                (link.view === "shows" && currentView === "shows") ||
                (link.view === "transparency" && currentView === "transparency") ||
                (link.view === "home" && currentView === "home" && link.label === "Início");

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-xs font-black uppercase tracking-wider transition-colors py-2 border-b-2 cursor-pointer ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-white/70 hover:text-white border-transparent"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Zone (oTicket buttons + container for accessibility script injection) */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={onOpenQuickTicket}
              className="text-xs font-black uppercase tracking-wider text-white hover:text-primary flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-primary" />
              Passe Digital
            </button>

            <button
              onClick={onOpenDonation}
              className="bg-primary hover:bg-orange-600 text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
            >
              Doar Agora
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenDonation}
              className="bg-primary text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider"
            >
              Doar
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-white/70 hover:text-white"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#0E1017] border-l border-white/10 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    <span className="font-black text-sm uppercase tracking-wider text-white">Menu oTicket</span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link)}
                      className="block w-full text-left py-3 text-lg font-black uppercase tracking-tight text-white hover:text-primary transition-colors border-b border-white/5"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenQuickTicket();
                  }}
                  className="w-full py-3.5 rounded-xl bg-white/10 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-primary" />
                  Emitir Passe Digital
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenDonation();
                  }}
                  className="w-full py-3.5 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Fazer Doação (PIX)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
