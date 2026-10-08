import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ChevronRight, MapPin, Calendar, Ticket, Image as ImageIcon, Search, Share2, Sparkles, Filter } from "lucide-react";
import { EventShow, GalleryItem } from "../types/events";
import { eventsData as fallbackEvents, galleries as fallbackGalleries } from "../data/eventsData";

interface ShowsEventosPageProps {
  key?: string;
  events?: EventShow[];
  galleries?: GalleryItem[];
  onBack: () => void;
  onOpenTicket?: (event: EventShow) => void;
  onOpenGallery?: (galleryId: number) => void;
  onShowToast?: (msg: string) => void;
}

export const ShowsEventosPage = ({
  events = fallbackEvents,
  galleries = fallbackGalleries,
  onBack,
  onOpenTicket = () => {},
  onOpenGallery = () => {},
  onShowToast = () => {}
}: ShowsEventosPageProps) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Todos os Eventos" },
    { id: "shows", label: "Shows & Festas" },
    { id: "projeto", label: "Instrumento nº 977307" },
    { id: "congado", label: "Congado & Fé" },
    { id: "oficinas", label: "Oficinas Culturais" }
  ];

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchCat = activeCategory === "all" || ev.category === activeCategory;
      const q = filterQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        (ev.modalidade && ev.modalidade.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [events, activeCategory, filterQuery]);

  const handleShare = (ev: EventShow) => {
    if (navigator.share) {
      navigator.share({ title: ev.title, text: ev.description, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}#shows-eventos`);
      onShowToast(`Link de "${ev.title}" copiado!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="py-12 md:py-20 px-6 bg-[#08090C] min-h-screen text-white font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors group bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10 w-fit"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </button>
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
            <span>OTICKET</span>
            <span>/</span>
            <span className="text-primary font-bold">SHOWS & EVENTOS</span>
          </div>
        </div>

        {/* Hero Banner for Shows e Eventos */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-[#141722] via-[#0E1018] to-black p-8 md:p-14 border border-white/10 shadow-2xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3" /> Programações Oficiais & Culturais
            </div>
            <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Shows & Eventos
            </h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed font-normal">
              Acompanhe a agenda cultural de apresentações, festivais de congado, encontros gastronômicos e a comprovação física das ações vinculadas ao Instrumento nº 977307.
            </p>
          </div>
        </div>

        {/* oTicket Command Filter for Shows */}
        <div className="bg-[#10121A] p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por nome, atração ou edital..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeCategory === c.id
                    ? "bg-primary text-black font-black shadow-md shadow-primary/25"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Events Presentation */}
        <div className="space-y-16">
          {filtered.map((ev, index) => {
            const gallery = ev.galleryId ? galleries.find((g) => g.id === ev.galleryId) : null;
            const photoCount = gallery?.images.length || 0;
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={ev.id}
                className={`p-6 md:p-10 rounded-3xl bg-[#0E1017] border border-white/10 hover:border-primary/30 transition-all flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-8 lg:gap-12 items-center shadow-xl`}
              >
                {/* Artwork Column */}
                <div className="w-full lg:w-1/2 shrink-0">
                  <div
                    onClick={() => {
                      if (ev.galleryId) onOpenGallery(ev.galleryId);
                    }}
                    className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-black border border-white/10 group cursor-pointer shadow-2xl"
                  >
                    <img
                      src={ev.cover}
                      alt={ev.title}
                      className="w-full h-full object-cover brightness-85 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                    {/* Date Block */}
                    <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 text-center shadow-lg">
                      <span className="block font-black text-xl text-primary font-mono leading-none">
                        {ev.day || "20"}
                      </span>
                      <span className="block text-[9px] font-black uppercase tracking-wider text-white/80">
                        {ev.month || "EVENTO"}
                      </span>
                    </div>

                    {/* Gallery Overlay Badge */}
                    {ev.galleryId && (
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2 group-hover:bg-primary group-hover:text-black transition-colors shadow-lg">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Ver Galeria ({photoCount} Mídias)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Column */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {ev.modalidade && (
                      <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md">
                        {ev.modalidade}
                      </span>
                    )}
                    <span className="bg-primary/20 border border-primary/30 text-primary font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md">
                      {ev.date}
                    </span>
                    <span className="text-white/40 text-xs flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      {ev.venue || ev.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                    {ev.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line font-normal">
                    {ev.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onOpenTicket(ev)}
                      className="py-3.5 px-6 rounded-xl bg-primary hover:bg-orange-600 text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      <Ticket className="w-4 h-4" />
                      Emitir Passe Digital
                    </button>

                    {ev.galleryId && (
                      <button
                        onClick={() => onOpenGallery(ev.galleryId!)}
                        className="py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Galeria de Fotos ({photoCount})
                      </button>
                    )}

                    <button
                      onClick={() => handleShare(ev)}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors"
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
