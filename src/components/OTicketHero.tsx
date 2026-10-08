import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Calendar, MapPin, Ticket, Play, Pause, Image as ImageIcon } from "lucide-react";
import { EventShow } from "../types/events";

interface OTicketHeroProps {
  events: EventShow[];
  onOpenTicket: (event: EventShow) => void;
  onOpenGallery: (galleryId: number) => void;
  onExploreShows: () => void;
}

export const OTicketHero = ({
  events,
  onOpenTicket,
  onOpenGallery,
  onExploreShows
}: OTicketHeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const featuredEvents = events.slice(0, 4);

  useEffect(() => {
    if (!isPlaying || featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, featuredEvents.length]);

  const current = featuredEvents[currentIndex] || events[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  if (!current) return null;

  return (
    <section className="relative overflow-hidden bg-[#0A0C11] border-b border-white/5">
      {/* Background slide with crossfade */}
      <div className="relative min-h-[580px] lg:min-h-[660px] flex items-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={current.cover}
              alt={current.title}
              className="w-full h-full object-cover brightness-[0.45] contrast-105"
              referrerPolicy="no-referrer"
            />
            {/* Multi-stage oTicket gradient vignette */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0A0C11] via-[#0A0C11]/60 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0A0C11] via-[#0A0C11]/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content container */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10 w-full">
          <div className="max-w-3xl">
            {/* Top badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="bg-primary text-black font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-md shadow-md shadow-primary/20">
                DESTAQUE
              </span>
              {current.categoryLabel && (
                <span className="bg-white/10 backdrop-blur-md text-white/80 font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md border border-white/10">
                  {current.categoryLabel}
                </span>
              )}
              {current.modalidade && (
                <span className="bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md border border-amber-500/30">
                  {current.modalidade}
                </span>
              )}
              <span className="text-white/60 text-xs font-semibold flex items-center gap-1.5 ml-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {current.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] mb-4 drop-shadow-md">
              {current.title}
            </h1>

            {/* Description excerpt */}
            <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-3 mb-8 max-w-2xl font-normal">
              {current.description}
            </p>

            {/* Location tag */}
            <div className="flex items-center gap-2 text-white/50 text-xs font-medium mb-8">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{current.venue || current.location}</span>
              <span className="text-white/30">·</span>
              <span className="text-primary font-bold">{current.priceBadge || "Entrada Franca"}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenTicket(current)}
                className="bg-primary hover:bg-orange-600 text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4" />
                Emitir Passe Gratuito
              </button>

              {current.galleryId && (
                <button
                  onClick={() => onOpenGallery(current.galleryId!)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white px-7 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                >
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Ver Fotos do Evento
                </button>
              )}

              <button
                onClick={onExploreShows}
                className="text-white/60 hover:text-white px-4 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors group"
              >
                Ver Todos os Shows
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel slide controls (Bottom-right bar) */}
        <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          <button
            onClick={handlePrev}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Evento anterior"
            aria-label="Evento anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1.5 px-2">
            {featuredEvents.map((ev, i) => (
              <button
                key={ev.id}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-primary shadow-sm shadow-primary/50" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                title={`Ir para ${ev.title}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Próximo evento"
            aria-label="Próximo evento"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 text-white/40 hover:text-white rounded-xl transition-colors border-l border-white/10 ml-1"
            title={isPlaying ? "Pausar rotação" : "Iniciar rotação"}
            aria-label={isPlaying ? "Pausar rotação" : "Iniciar rotação"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
};
