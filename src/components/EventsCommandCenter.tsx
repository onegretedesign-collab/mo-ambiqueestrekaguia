import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Calendar, Ticket, Image as ImageIcon, Share2, Grid, List, Sparkles } from "lucide-react";
import { EventShow, GalleryItem } from "../types/events";

interface EventsCommandCenterProps {
  events: EventShow[];
  galleries: GalleryItem[];
  onOpenTicket: (event: EventShow) => void;
  onOpenGallery: (galleryId: number) => void;
  onShowToast: (msg: string) => void;
}

export const EventsCommandCenter = ({
  events,
  galleries,
  onOpenTicket,
  onOpenGallery,
  onShowToast
}: EventsCommandCenterProps) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    { id: "all", label: "Todos os Eventos" },
    { id: "shows", label: "Shows & Festas" },
    { id: "congado", label: "Congado & Tradição" },
    { id: "oficinas", label: "Oficinas & Cultura" },
    { id: "projeto", label: "Instrumento nº 977307" }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat = selectedCategory === "all" || ev.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        (ev.modalidade && ev.modalidade.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [events, selectedCategory, search]);

  const handleShareEvent = (ev: EventShow, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: ev.title, text: ev.description, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}#shows-eventos`);
      onShowToast(`Link de "${ev.title}" copiado!`);
    }
  };

  return (
    <section id="eventos-oticket" className="py-20 px-6 bg-[#08090C] border-b border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-black uppercase text-[11px] tracking-[0.25em]">
                Plataforma de Eventos
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Eventos & Ingressos
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-md font-normal leading-relaxed">
            Consulte a programação, reserve seus ingressos solidários gratuitos e acesse os registros fotográficos de nossas ações socioculturais.
          </p>
        </div>

        {/* oTicket Command & Filter Bar */}
        <div className="bg-[#12141C] p-4 lg:p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar shows, festas, capoeira, Instrumento 977307..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-primary transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0 self-start md:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "grid" ? "bg-primary text-black" : "text-white/50 hover:text-white"
                }`}
                title="Visualização em Grade"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "list" ? "bg-primary text-black" : "text-white/50 hover:text-white"
                }`}
                title="Visualização em Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-black shadow-lg shadow-primary/20"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-white/40 font-medium">
          <span>
            Exibindo <strong className="text-white">{filteredEvents.length}</strong> evento{filteredEvents.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-primary text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Entrada Solidária e Gratuita
          </span>
        </div>

        {/* Events Container */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-[#10121A] rounded-3xl border border-white/5 p-8">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 uppercase">Nenhum evento encontrado</h3>
            <p className="text-white/40 text-sm mb-6">Tente ajustar seus termos de busca ou mudar a categoria.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2.5 bg-primary text-black font-black uppercase text-xs rounded-xl"
            >
              Ver todos os eventos
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((ev) => {
              const gallery = ev.galleryId ? galleries.find((g) => g.id === ev.galleryId) : null;
              const photoCount = gallery?.images.length || 0;

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-[#11131C] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-primary/40 hover:shadow-[0_12px_36px_rgba(255,119,0,0.18)] transition-all"
                >
                  {/* Image & Date overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={ev.cover}
                      alt={ev.title}
                      className="w-full h-full object-cover brightness-80 group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#11131C] via-transparent to-black/20" />

                    {/* Date Block (oTicket style) */}
                    <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-center min-w-[54px] shadow-lg">
                      <span className="block font-black text-lg text-primary leading-none tabular-nums font-mono">
                        {ev.day || "20"}
                      </span>
                      <span className="block text-[9px] font-black uppercase tracking-wider text-white/80">
                        {ev.month || "EVENTO"}
                      </span>
                    </div>

                    {/* Category / Status badge */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                      <span className="bg-primary/95 text-black font-black uppercase text-[9px] tracking-wider px-2.5 py-1 rounded-md shadow-md">
                        {ev.priceBadge || "Entrada Franca"}
                      </span>
                      {ev.modalidade && (
                        <span className="bg-black/80 backdrop-blur-md text-amber-400 font-bold uppercase text-[8px] tracking-widest px-2 py-0.5 rounded border border-amber-500/30">
                          {ev.modalidade.split("/")[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-bold uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{ev.date}</span>
                        {ev.time && <span>· {ev.time}</span>}
                      </div>

                      <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {ev.title}
                      </h3>

                      <p className="text-white/50 text-xs line-clamp-3 leading-relaxed font-normal">
                        {ev.description}
                      </p>
                    </div>

                    {/* Venue */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{ev.venue || ev.location}</span>
                      </div>
                      <button
                        onClick={(e) => handleShareEvent(ev, e)}
                        className="p-1.5 text-white/40 hover:text-white rounded-md hover:bg-white/5 transition-colors shrink-0"
                        title="Compartilhar evento"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Command Buttons on Card */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onOpenTicket(ev)}
                        className="flex-1 py-3 px-3 rounded-xl bg-primary hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95 transition-all"
                      >
                        <Ticket className="w-4 h-4" />
                        Emitir Passe
                      </button>

                      {ev.galleryId && (
                        <button
                          onClick={() => onOpenGallery(ev.galleryId!)}
                          className="py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                          title="Ver Galeria de Fotos"
                        >
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <span>{photoCount}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredEvents.map((ev) => {
              const gallery = ev.galleryId ? galleries.find((g) => g.id === ev.galleryId) : null;
              const photoCount = gallery?.images.length || 0;

              return (
                <div
                  key={ev.id}
                  className="bg-[#11131C] p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-6 hover:border-primary/40 transition-colors"
                >
                  <div className="relative w-full sm:w-44 aspect-video sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-black">
                    <img
                      src={ev.cover}
                      alt={ev.title}
                      className="w-full h-full object-cover brightness-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-center">
                      <span className="block font-black text-xs text-primary font-mono">{ev.day || "20"}</span>
                      <span className="block text-[8px] font-black uppercase text-white/80">{ev.month || "EVT"}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                        {ev.date}
                      </span>
                      {ev.modalidade && (
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                          {ev.modalidade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight truncate">
                      {ev.title}
                    </h3>
                    <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{ev.venue || ev.location}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => onOpenTicket(ev)}
                      className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      Passe
                    </button>
                    {ev.galleryId && (
                      <button
                        onClick={() => onOpenGallery(ev.galleryId!)}
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                        Fotos ({photoCount})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
