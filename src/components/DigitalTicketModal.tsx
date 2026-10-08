import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, QrCode, Ticket, Check, Copy, Share2, Calendar, MapPin, Download } from "lucide-react";
import { EventShow } from "../types/events";

interface DigitalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventShow | null;
  onShowToast: (msg: string) => void;
}

export const DigitalTicketModal = ({
  isOpen,
  onClose,
  event,
  onShowToast
}: DigitalTicketModalProps) => {
  const [holderName, setHolderName] = useState("");
  const [ticketCode] = useState(() => `OT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${ticketCode} - ${event.title} (Moçambique Estrela Guia)`);
    setCopied(true);
    onShowToast("Código do ingresso copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `Meu passe garantido para "${event.title}" no Quartel Estrela Guia! Data: ${event.date}. Saiba mais no site oficial.`;
    if (navigator.share) {
      navigator.share({ title: event.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast("Link do evento copiado!");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-lg bg-[#0F1117] rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                  Passe Cultural Digital
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                  Comprovante de Entrada
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            {/* Input name for customization */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-white/60 mb-2">
                Nome do Participante / Titular
              </label>
              <input
                type="text"
                placeholder="Digite seu nome (ex: Maria Souza)"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Simulated oTicket Ticket Stub */}
            <div className="relative bg-linear-to-b from-[#161922] to-[#11131B] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              {/* Top Banner image preview */}
              <div className="relative h-28 w-full overflow-hidden">
                <img
                  src={event.cover}
                  alt={event.title}
                  className="w-full h-full object-cover brightness-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#161922] via-[#161922]/40 to-transparent" />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary border border-white/10">
                  {event.categoryLabel || "Evento"}
                </span>
                <span className="absolute top-3 right-3 bg-primary text-black px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {event.priceBadge || "Entrada Franca"}
                </span>
              </div>

              {/* Ticket Details */}
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
                    {event.title}
                  </h4>
                  {event.modalidade && (
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-1">
                      {event.modalidade}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3.5 rounded-xl border border-white/5">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block">Data e Hora</span>
                      <span className="font-bold text-white">{event.date}</span>
                      {event.time && <span className="block text-[10px] text-white/50">{event.time}</span>}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block">Local</span>
                      <span className="font-bold text-white line-clamp-1">{event.venue || event.location}</span>
                      <span className="text-[10px] text-white/50 block truncate">Uberlândia-MG</span>
                    </div>
                  </div>
                </div>

                {/* Participant badge */}
                <div className="flex items-center justify-between py-2 border-t border-b border-dashed border-white/10 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">Titular</span>
                    <span className="font-bold text-white uppercase tracking-tight">
                      {holderName.trim() || "Membro da Comunidade"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">Lote / Acesso</span>
                    <span className="font-mono text-primary font-black uppercase tracking-wider text-[11px]">
                      {ticketCode}
                    </span>
                  </div>
                </div>

                {/* QR and Barcode Mock */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <QrCode className="w-10 h-10 text-black" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary block">
                        Validação na Portaria
                      </span>
                      <span className="text-[10px] text-white/50">Apresente este passe no celular</span>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-white/30 tracking-widest text-right">
                    ESTRELA-GUIA-2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyCode}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar Código"}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-orange-600 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
