import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Music, 
  MapPin, 
  Calendar, 
  Heart, 
  ChevronRight, 
  Instagram, 
  Mail, 
  Globe,
  Share2,
  Download,
  MessageCircle,
  Shield,
  History,
  FileText,
  X,
  Menu,
  Copy,
  Video,
  ExternalLink,
  Clock,
  Sparkles,
  Navigation,
  CalendarPlus,
  Check,
  Ticket,
  Edit2,
  Settings,
  Plus,
  HelpCircle,
  AlertCircle,
  Lock,
  ZoomIn,
  ZoomOut,
  Eye
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { subscribeToComments, addComment, type Comment } from "../services/commentService";
import { subscribeToEvents, type Event } from "../services/eventService";
import { DocumentManagerModal } from "./DocumentManagerModal";
import { AdminLoginModal } from "./AdminLoginModal";
import { parseDriveUrl, isDriveUrl } from "../utils/driveUtils";
import { TransparencyDoc } from "../types/events";

// --- Components ---

const CommentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToComments(setComments);
    return () => unsubscribe();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(text, author);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-20">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-[#0F0F0F] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col h-full max-h-[80vh]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <MessageCircle className="text-primary" /> Mural de Gratidão
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {comments.map((c) => (
            <div key={c.id} className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-lg text-white mb-4 leading-relaxed font-light">"{c.text}"</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">{c.authorName}</span>
                <span className="text-white/20 text-xs">
                  {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}
                </span>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-20 text-white/20">
              Nenhum comentário ainda. Seja o primeiro!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 bg-black/50 border-t border-white/5 space-y-4">
          <input 
            type="text" 
            placeholder="Seu Nome" 
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none focus:border-primary transition-colors text-white font-medium"
            required
          />
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Sua mensagem de gratidão..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none focus:border-primary transition-colors text-white"
              required
            />
            <button 
              disabled={isSubmitting}
              className="bg-primary text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              Postar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DOCUMENT_PREVIEWS: Record<string, string[]> = {
  oficio: [
    "/previews/oficio/page-1.jpg",
    "/previews/oficio/page-2.jpg",
  ],
  "oficio-332": [
    "/previews/oficio/page-1.jpg",
    "/previews/oficio/page-2.jpg",
  ],
  "emenda-parlamentar": [
    "/previews/oficio/page-1.jpg",
    "/previews/oficio/page-2.jpg",
  ],
  transparencia: [
    "/previews/oficio/page-1.jpg",
    "/previews/oficio/page-2.jpg",
  ],
  estatuto: [
    "/previews/estatuto/page-1.jpg",
    "/previews/estatuto/page-2.jpg",
    "/previews/estatuto/page-3.jpg",
    "/previews/estatuto/page-4.jpg",
    "/previews/estatuto/page-5.jpg",
    "/previews/estatuto/page-6.jpg",
  ],
  relatorio: ["/previews/relatorio/page-1.jpg"],
  ata: ["/previews/ata-eleicao/page-1.jpg"],
  cnpj: ["/previews/cnpj/page-1.jpg"],
  certidoes: ["/previews/certidoes/page-1.jpg"],
  planejamento: [
    "/previews/planejamento/page-1.jpg",
    "/previews/planejamento/page-2.jpg",
  ],
};

const isOficio332Doc = (url: string, title: string, docId?: string): boolean => {
  const lowUrl = (url || "").toLowerCase();
  const lowTitle = (title || "").toLowerCase();
  const lowId = (docId || "").toLowerCase();

  return (
    lowId === "oficio" ||
    lowId === "oficio-332" ||
    lowId === "emenda-parlamentar" ||
    lowId === "transparencia" ||
    lowTitle.includes("332") ||
    lowTitle.includes("ofício") ||
    lowTitle.includes("oficio") ||
    lowTitle.includes("emenda") ||
    lowUrl.includes("332") ||
    lowUrl.includes("oficio") ||
    lowUrl.includes("sei_3158555") ||
    lowUrl.includes("1wgwji") ||
    lowUrl.includes("emenda")
  );
};

const getDocumentPreviewPages = (url: string, title: string, docId?: string): string[] | null => {
  if (docId && DOCUMENT_PREVIEWS[docId]) {
    return DOCUMENT_PREVIEWS[docId];
  }
  if (isOficio332Doc(url, title, docId)) {
    return DOCUMENT_PREVIEWS.oficio;
  }
  const lowUrl = (url || "").toLowerCase();
  const lowTitle = (title || "").toLowerCase();

  if (lowUrl.includes("estatuto") || lowTitle.includes("estatuto") || lowUrl.includes("1za_dweutnxdlr0elu2ua0e5z8u-ftskq")) {
    return DOCUMENT_PREVIEWS.estatuto;
  }
  if (lowUrl.includes("relatorio") || lowTitle.includes("relat") || lowTitle.includes("atividades")) {
    return DOCUMENT_PREVIEWS.relatorio;
  }
  if (lowUrl.includes("ata") || lowTitle.includes("eleição") || lowTitle.includes("eleicao") || lowTitle.includes("ata da assembleia")) {
    return DOCUMENT_PREVIEWS.ata;
  }
  if (lowUrl.includes("cnpj") || lowTitle.includes("cnpj")) {
    return DOCUMENT_PREVIEWS.cnpj;
  }
  if (lowUrl.includes("certid") || lowTitle.includes("certid")) {
    return DOCUMENT_PREVIEWS.certidoes;
  }

  // If url is an image data URL or image file
  if (url.startsWith("data:image/") || /\.(png|jpe?g|webp|gif)$/i.test(url)) {
    return [url];
  }

  return null;
};

const PdfViewerModal = ({ 
  isOpen, 
  onClose, 
  url, 
  title,
  docId
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  url: string; 
  title: string;
  docId?: string;
}) => {
  if (!isOpen) return null;

  const isOficio = isOficio332Doc(url, title, docId);
  const [zoom, setZoom] = useState(100);
  const previewPages = getDocumentPreviewPages(url, title, docId);
  const driveInfo = parseDriveUrl(url);
  const isDrive = isDriveUrl(url);
  
  const effectiveDownloadUrl = isOficio 
    ? "/SEI_3158555_Oficio_332.pdf" 
    : (driveInfo ? driveInfo.downloadUrl : url);
  const effectiveViewUrl = isOficio 
    ? "/SEI_3158555_Oficio_332.pdf" 
    : (driveInfo ? driveInfo.viewUrl : url);
  const displayUrl = driveInfo ? driveInfo.previewUrl : (isOficio ? "/SEI_3158555_Oficio_332.pdf" : url);
  const displayTitle = isOficio ? "OFÍCIO Nº 332/2026 - EMENDA PARLAMENTAR 2026" : title;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 lg:p-8 font-sans">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full max-w-5xl bg-[#11131A] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl z-10"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between bg-black/60 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-white truncate block">
                {displayTitle}
              </span>
              <span className="text-[10px] text-primary/90 font-mono uppercase tracking-wider block">
                {isOficio 
                  ? "Documento Original SEI nº 3158555 • Ministério da Cultura • 2 Páginas" 
                  : (previewPages ? `Documento Original • ${previewPages.length} ${previewPages.length > 1 ? "Páginas" : "Página"}` : (isDrive ? "Google Drive • Documento Oficial" : "Documento Oficial • Moçambique Estrela Guia"))}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Zoom Controls */}
            {previewPages && (
              <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.max(75, z - 25))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                  title="Diminuir Zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono px-1.5 text-white/70 min-w-[42px] text-center">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.min(200, z + 25))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            <a 
              href={effectiveDownloadUrl} 
              download={isOficio ? "SEI_3158555_Oficio_332.pdf" : `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-black hover:bg-orange-500 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-md"
              title="Baixar Arquivo Original"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar Arquivo Original</span>
            </a>
            
            <a 
              href={effectiveViewUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white border border-white/10 flex items-center gap-1"
              title="Abrir em Nova Aba"
            >
              <ExternalLink className="w-4 h-4" />
              {isDrive && <span className="text-[10px] hidden md:inline">Drive</span>}
            </a>
            
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white border border-white/10"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Frame - Only reading the sent original document */}
        <div className="flex-1 bg-[#0b0c10] relative flex flex-col min-h-0 overflow-y-auto p-4 sm:p-8">
          {previewPages ? (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {previewPages.map((pageImg, idx) => (
                <div 
                  key={idx}
                  className="relative mx-auto rounded-lg overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/15 bg-white transition-all duration-200"
                  style={{
                    width: `${zoom}%`,
                    maxWidth: zoom <= 100 ? "100%" : `${zoom}%`
                  }}
                >
                  <img 
                    src={pageImg} 
                    alt={`${displayTitle} - Página ${idx + 1}`}
                    className="w-full h-auto block select-none"
                    loading="lazy"
                  />
                  {previewPages.length > 1 && (
                    <div className="py-2.5 px-4 bg-[#14161f] text-white/70 text-[11px] font-mono font-bold text-center border-t border-black/20 flex items-center justify-between">
                      <span>{displayTitle}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px]">
                        Página {idx + 1} de {previewPages.length}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : isDrive ? (
            <div className="flex-1 flex flex-col min-h-0 relative">
              <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 px-6 flex items-center justify-between text-xs text-amber-200">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  Arquivo hospedado no Google Drive. Se a visualização abaixo for bloqueada pela segurança do Google, utilize os botões:
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={effectiveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-amber-300 hover:text-white"
                  >
                    Abrir no Drive &rarr;
                  </a>
                </div>
              </div>

              <iframe 
                src={displayUrl} 
                className="w-full h-full flex-1 border-none bg-black"
                title={displayTitle}
              />
            </div>
          ) : (
            <object
              data={displayUrl}
              type="application/pdf"
              className="w-full h-full flex-1"
            >
              <iframe 
                src={`${displayUrl}#toolbar=1`} 
                className="w-full h-full border-none"
                title={displayTitle}
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white space-y-4">
                  <FileText className="w-16 h-16 text-primary mb-2" />
                  <h4 className="text-lg font-bold">Documento disponível para visualização e download</h4>
                  <p className="text-sm text-white/50 max-w-md">
                    Clique no botão abaixo para abrir ou fazer download do arquivo em alta resolução.
                  </p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-black rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                  >
                    Abrir Documento
                  </a>
                </div>
              </iframe>
            </object>
          )}
        </div>
          
        {/* Bottom Bar Info */}
        <div className="px-6 py-3 bg-black/90 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/50">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            {isOficio 
              ? "Documento Original Oficial — Ministério da Cultura / SEI nº 3158555" 
              : "Visualização do documento original oficial"}
          </span>
          <a 
            href={effectiveDownloadUrl} 
            download={isOficio ? "SEI_3158555_Oficio_332.pdf" : `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`}
            className="text-primary hover:underline font-bold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Baixar cópia original em PDF &rarr;
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const ImpactReportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-20">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-[#0A0A0A] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-full max-h-[90vh] shadow-[0_0_100px_rgba(255,165,0,0.1)]"
      >
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-white/5 flex items-center justify-between bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-primary rounded-full" />
            <h3 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter">Relatório Institucional e de Impacto</h3>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/relatorio.pdf" 
              download="relatorio-atividades-estrela-guia.pdf"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-black font-bold uppercase text-xs tracking-wider hover:bg-orange-500 transition-all shadow-md"
              title="Baixar Relatório em PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar PDF Oficial</span>
            </a>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-16 text-white selection:bg-primary selection:text-black">
          {/* 1. Fundação e História */}
          <section id="fundacao">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6">01. Fundação e História</h4>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-xl text-white leading-relaxed font-light">
                  Fundado em 12 de outubro de 2002 no bairro São Jorge, em Uberlândia-MG, o <span className="text-primary font-bold">Terno Moçambique Estrela Guia</span> nasceu do sonho de Capitão Malaquias e Madrinha Iara de criar um porto seguro para a cultura e a dignidade humana.
                </p>
                <p className="text-sm text-white/50 leading-relaxed">
                  O que começou como um grupo de Congado para celebrar a fé e a ancestralidade afro-brasileira, evoluiu para uma organização social robusta que atende centenas de famílias em situação de vulnerabilidade, mantendo as raízes vivas enquanto planta sementes para o futuro.
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                 <History className="absolute -top-4 -right-4 w-24 h-24 text-white/[0.03] group-hover:text-primary/5 transition-colors" />
                 <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Marcos Importantes</h5>
                 <ul className="space-y-4 text-xs text-white/40">
                   <li className="flex gap-4"><span className="text-primary font-black">2002</span> Fundação oficial no Bairro São Jorge</li>
                   <li className="flex gap-4"><span className="text-primary font-black">2010</span> Reconhecimento como Ponto de Cultura Estadual</li>
                   <li className="flex gap-4"><span className="text-primary font-black">2020</span> Ações emergenciais durante a pandemia</li>
                 </ul>
              </div>
            </div>
          </section>

          {/* 2. Objetivos Estratégicos */}
          <section id="objetivos">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-center">02. Objetivos Estratégicos</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Preservação Cultural", desc: "Manter viva a tradição do Congado e do Moçambique através do repasse de saberes ancestrais." },
                { title: "Desenvolvimento Social", desc: "Oferecer ferramentas de capacitação e educação para jovens da periferia." },
                { title: "Combate à Fome", desc: "Garantir segurança alimentar básica para famílias cadastradas em nossa rede." },
                { title: "Inclusão Digital", desc: "Aproximar a comunidade das novas tecnologias através de oficinas de informática e produção." },
                { title: "Ética e Cidadania", desc: "Formar cidadãos conscientes de seus direitos e deveres na sociedade." },
                { title: "Saúde Comunitária", desc: "Promover bem-estar através de atividades físicas como Zumba e Street Dance." }
              ].map(obj => (
                <div key={obj.title} className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/30 transition-all">
                  <h5 className="text-white font-black text-xs uppercase tracking-widest mb-3">{obj.title}</h5>
                  <p className="text-xs text-white/40 leading-relaxed">{obj.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Público-Alvo */}
          <section id="publico">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">03. Público-Alvo</h4>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <p className="text-lg text-white/70 font-light leading-relaxed">
                  Atendemos diretamente mais de <span className="text-white font-bold">100 crianças e adolescentes</span> em nossas oficinas semanais, e indiretamente impactamos cerca de <span className="text-white font-bold">2.500 pessoas</span> através de nossas ações sociais e eventos culturais.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-5 py-2 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-white/60">Periferia de Uberlândia</span>
                  <span className="px-5 py-2 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-white/60">Famílias em vulnerabilidade</span>
                  <span className="px-5 py-2 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-white/60">Jovens de 06 a 18 anos</span>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                 <Users className="w-12 h-12 text-primary mb-4" />
                 <span className="text-4xl font-black text-white">600+</span>
                 <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Membros Cadastrados</span>
              </div>
            </div>
          </section>

          {/* 4. Atividades e Oficinas */}
          <section id="atividades">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">04. Atividades e Oficinas</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Música", items: ["Percussão Afro", "Cavaco", "Violão", "Coral"] },
                { title: "Dança", items: ["Dança Afro", "Street Dance", "Zumba", "Balé"] },
                { title: "Artes", items: ["Grafite", "Artesanato", "Contação de História", "Documentário"] },
                { title: "Ofícios", items: ["Culinária", "Barbeiro", "Confecção de Instrumentos", "Informática"] }
              ].map(cat => (
                <div key={cat.title} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-inner">
                  <h5 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-3">{cat.title}</h5>
                  <ul className="space-y-2">
                    {cat.items.map(item => (
                      <li key={item} className="text-[10px] text-white/40 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Impacto Social Medido */}
          <section id="impacto">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-center">05. Impacto Social</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Heart className="w-6 h-6"/>, val: "5.000+", label: "Kits de Higiene doados" },
                { icon: <Users className="w-6 h-6"/>, val: "100%", label: "Frequência escolar dos alunos" },
                { icon: <Globe className="w-6 h-6"/>, val: "30+", label: "Cidades Alcançadas" },
                { icon: <Shield className="w-6 h-6"/>, val: "2.000+", label: "Cestas Básicas Entregues" }
              ].map((imp, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-4">{imp.icon}</div>
                   <span className="text-3xl font-black text-white">{imp.val}</span>
                   <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-2">{imp.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 rounded-3xl bg-linear-to-r from-primary/10 to-transparent border border-primary/5">
               <p className="text-sm text-white/60 italic text-center max-w-3xl mx-auto">
                 "Nosso maior impacto não está apenas nos números, mas na mudança de olhar do jovem sobre si mesmo e sobre seu território, transformando vulnerabilidade em potência criativa."
               </p>
            </div>
          </section>

          {/* 6. Reconhecimentos */}
          <section id="reconhecimento" className="pb-12">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">06. Reconhecimento</h4>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="p-8 rounded-3xl bg-white/[0.05] border border-white/10 flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0 border border-primary/40">
                     <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Ponto de Cultura Estadual</h5>
                    <p className="text-xs text-white/40 leading-relaxed">Certificação oficial que chancela o Terno Estrela Guia como guardião estratégico da cultura de Minas Gerais.</p>
                  </div>
               </div>
               <div className="p-8 rounded-3xl bg-white/[0.05] border border-white/10 flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0 border border-primary/40">
                     <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Prêmio Grande Otelo</h5>
                    <p className="text-xs text-white/40 leading-relaxed">Maior honraria municipal concedida a instituições que transformam a realidade social de Uberlândia.</p>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/80 backdrop-blur-md text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Patrimônio Imaterial de Uberlândia</p>
          <button 
            onClick={onClose}
            className="px-16 py-5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 w-full md:w-auto"
          >
            Fechar Relatório
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DEFAULT_DOCUMENTS: TransparencyDoc[] = [
  { 
    id: "oficio-332",
    name: "OFÍCIO Nº 332/2026 - EMENDA PARLAMENTAR 2026", 
    link: "/SEI_3158555_Oficio_332.pdf", 
    backupLink: "https://drive.google.com/file/d/1wgwjiPAtaazA_-AsTgjznhci819qMMka/view?usp=sharing",
    desc: "",
    tag: "Ofício SEI • MinC"
  },
  { 
    id: "estatuto",
    name: "Estatuto Social", 
    link: "/estatuto.pdf", 
    backupLink: "https://drive.google.com/file/d/1Za_dweUtnxDlr0elU2uA0e5z8u-ftskq/view?usp=sharing",
    desc: "Regimento interno, finalidades e diretrizes estatutárias (2023)",
    tag: "Estatuto • 6 Págs"
  },
  { 
    id: "relatorio",
    name: "Relatório de Atividades", 
    link: "/relatorio.pdf", 
    desc: "Resumo anual de ações, Ponto de Cultura e Instrumento nº 977307",
    tag: "Relatório Oficial"
  },
  { 
    id: "ata",
    name: "Ata de Eleição e Posse", 
    link: "/ata-eleicao.pdf", 
    desc: "Composição oficial da diretoria executiva e conselho fiscal",
    tag: "Governança"
  },
  { 
    id: "cnpj",
    name: "Cartão CNPJ", 
    link: "/cnpj.pdf", 
    desc: "Comprovante de Inscrição e Situação Cadastral Ativa (06.207.190/0001-07)",
    tag: "Receita Federal"
  },
  { 
    id: "certidoes",
    name: "Certidões Negativas", 
    link: "/certidoes.pdf", 
    desc: "Regularidade Fiscal Federal (Receita/PGFN), Estadual, Municipal e Trabalhista",
    tag: "Certidão Conjunta"
  },
  { 
    id: "transparencia",
    name: "Transparência Governamental", 
    link: "/SEI_3158555_Oficio_332.pdf", 
    backupLink: "https://drive.google.com/file/d/1wgwjiPAtaazA_-AsTgjznhci819qMMka/view?usp=sharing",
    desc: "Consulta de Convênios do Governo Federal (Portal da Transparência)",
    tag: "Governo Federal"
  }
];

const TransparencyPortal = ({ 
  onBack, 
  onViewPdf,
  docs,
  onOpenAdminLogin
}: { 
  onBack: () => void; 
  onViewPdf: (url: string, title: string, docId?: string) => void; 
  docs: TransparencyDoc[];
  onOpenAdminLogin?: () => void;
  key?: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-32 pb-20 px-6 font-sans"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para o Início
          </button>

          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors py-2 px-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20"
              title="Acesso restrito para administradores"
            >
              <Lock className="w-3.5 h-3.5 text-primary" /> Área Restrita
            </button>
          )}
        </div>

        {/* Portal Header */}
        <div className="mb-14 pb-10 border-b border-white/10">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Institucional</span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none uppercase">Portal da<br/><span className="text-primary italic">Transparência</span></h1>
          <p className="text-white/50 max-w-2xl leading-relaxed text-sm mb-6">
            Acesso público aos documentos oficiais, estatutos e relatórios de atividades da nossa organização. Compromisso real com a comunidade e nossos apoiadores.
          </p>
          <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">Entidade Mantenedora:</p>
            <p className="text-sm text-white font-bold">Terno Moçambique Estrela Guia</p>
            <p className="text-xs text-white/40 mt-1 font-mono">CNPJ: 06.207.190/0001-07</p>
          </div>
        </div>

        {/* Clean Dynamic Document Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc, i) => {
            const driveInfo = parseDriveUrl(doc.link);
            const isDrive = isDriveUrl(doc.link);
            const isOficioCard = 
              doc.id === "oficio-332" || 
              doc.id === "emenda-parlamentar" || 
              doc.id === "oficio" ||
              doc.name.toLowerCase().includes("332") ||
              doc.name.toLowerCase().includes("ofício") ||
              doc.name.toLowerCase().includes("oficio");

            const cardDownloadUrl = isOficioCard
              ? "/SEI_3158555_Oficio_332.pdf"
              : (isDrive ? (driveInfo ? driveInfo.downloadUrl : doc.link) : (doc.id === 'transparencia' ? '/SEI_3158555_Oficio_332.pdf' : doc.link));

            const cardDownloadFileName = isOficioCard
              ? "SEI_3158555_Oficio_332.pdf"
              : `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;

            return (
              <motion.div 
                key={doc.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onViewPdf(doc.link, doc.name, doc.id)}
                className={`group relative p-8 rounded-3xl bg-white/[0.02] border transition-all text-left overflow-hidden min-h-[230px] flex flex-col justify-between cursor-pointer hover:bg-white/[0.04] shadow-xl ${
                  isOficioCard ? "border-primary/40 hover:border-primary shadow-primary/5" : "border-white/10 hover:border-primary"
                }`}
              >
                 {/* Direct Download Button */}
                 <div className="absolute top-6 right-6 z-10">
                   <a
                     href={cardDownloadUrl}
                     download={cardDownloadFileName}
                     onClick={(e) => e.stopPropagation()}
                     className="p-3 rounded-xl bg-white/5 hover:bg-primary text-white/60 hover:text-black transition-all border border-white/10 hover:border-primary shadow-md block cursor-pointer"
                     title={`Baixar ${doc.name}`}
                   >
                     <Download className="w-4 h-4" />
                   </a>
                 </div>
                 
                 <div>
                   <div className="flex items-center gap-3">
                     <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-lg">
                       <FileText className="w-7 h-7" />
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest w-fit">
                         {doc.tag}
                       </span>
                       {isDrive && (
                         <span className="text-[9px] text-amber-400 font-mono font-bold flex items-center gap-1">
                           <Sparkles className="w-2.5 h-2.5" /> Google Drive
                         </span>
                       )}
                     </div>
                   </div>

                   <div className="mt-4">
                     <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors mb-2 uppercase tracking-tight">
                       {doc.name}
                     </h3>
                     {/* No large text underneath for Ofício block as explicitly requested */}
                     {!isOficioCard && doc.desc && (
                       <p className="text-[11px] text-white/50 leading-relaxed font-medium mb-3">
                         {doc.desc}
                       </p>
                     )}
                   </div>
                 </div>

                 {isOficioCard ? (
                   <div className="mt-6 pt-3 border-t border-white/5 flex flex-col gap-2">
                     <a
                       href={cardDownloadUrl}
                       download={cardDownloadFileName}
                       onClick={(e) => e.stopPropagation()}
                       className="w-full py-3 px-4 rounded-xl bg-primary text-black hover:bg-amber-400 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                       title="Baixar arquivo original"
                     >
                       <Download className="w-4 h-4" /> Baixar Arquivo Original
                     </a>
                     <button
                       type="button"
                       onClick={(e) => {
                         e.stopPropagation();
                         onViewPdf(doc.link, doc.name, doc.id);
                       }}
                       className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                     >
                       <Eye className="w-3.5 h-3.5 text-primary" /> Ler Online (Sem Baixar) &rarr;
                     </button>
                   </div>
                 ) : (
                   <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-primary font-bold uppercase tracking-wider mt-4">
                     <button
                       type="button"
                       onClick={(e) => {
                         e.stopPropagation();
                         onViewPdf(doc.link, doc.name, doc.id);
                       }}
                       className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform hover:text-white cursor-pointer"
                     >
                       <Eye className="w-3.5 h-3.5" /> Visualizar Documento &rarr;
                     </button>
                     {doc.backupLink && (
                       <a
                         href={doc.backupLink}
                         target="_blank"
                         rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}
                         className="text-white/30 hover:text-white transition-colors underline flex items-center gap-1"
                         title="Abrir espelho via Google Drive"
                       >
                         <ExternalLink className="w-3 h-3" /> Espelho
                       </a>
                     )}
                   </div>
                 )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">
            Dúvidas sobre nossa gestão ou suporte a documentos? Entre em contato pelo e-mail <span className="text-primary">contato@estrelaguia.org</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TopBar = () => {
  return (
    <div className="hidden lg:block bg-black py-2 border-b border-white/5">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-bold">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> Rua do Dólar, 290, Bairro São Jorge, Uberlândia-MG</span>
          <span className="flex items-center gap-2"><Mail className="w-3 h-3 text-primary" /> contato@estrelaguia.org</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Facebook</a>
          <a 
            href="https://www.instagram.com/mocambique_estrela_guia?igsh=aDh6OTExamExb3hv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors"
          >
            Instagram
          </a>
          <a href="#" className="hover:text-primary transition-colors">Youtube</a>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ 
  onOpenDonation,
  currentView = "home",
  onChangeView
}: { 
  onOpenDonation: () => void;
  currentView?: "home" | "transparency" | "shows";
  onChangeView: (view: "home" | "transparency" | "shows") => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("início");

  const menuItems = [
    { label: "Início", href: "#início", view: "home" as const },
    { label: "Sobre Nós", href: "#sobre-nós", view: "home" as const },
    { label: "Projetos", href: "#projetos", view: "home" as const },
    { label: "Próximos Eventos", href: "#proximos-eventos", view: "home" as const },
    { label: "Shows e Eventos", href: "#shows-eventos", view: "shows" as const },
    { label: "Agenda", href: "#agenda", view: "home" as const },
    { label: "Galeria", href: "#galeria", view: "home" as const }
  ];

  useEffect(() => {
    if (currentView !== "home") {
      setActiveSection(currentView);
      return;
    }

    const handleScroll = () => {
      const sections = ["início", "sobre-nós", "projetos", "proximos-eventos", "agenda", "galeria"];
      const scrollPosition = window.scrollY + 200; // offset for nav height

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  const isItemActive = (item: typeof menuItems[number]) => {
    if (currentView === "shows") {
      return item.view === "shows";
    }
    if (currentView === "home") {
      return item.view === "home" && item.href === `#${activeSection}`;
    }
    return false;
  };

  const handleItemClick = (e: React.MouseEvent, item: typeof menuItems[number]) => {
    if (item.view === "shows") {
      e.preventDefault();
      onChangeView("shows");
    } else {
      if (currentView !== "home") {
        e.preventDefault();
        onChangeView("home");
        // Wait for view transition
        setTimeout(() => {
          const target = document.querySelector(item.href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    }
  };

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-3 lg:gap-6">
          <div className="flex items-center shrink-0 cursor-pointer" onClick={(e) => { handleItemClick(e, menuItems[0]); }}>
            <span className="font-display font-black text-sm sm:text-base lg:text-lg xl:text-xl uppercase text-white tracking-tight hover:text-primary transition-colors whitespace-nowrap">
              Moçambique Estrela Guia
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 sm:gap-1.5 lg:gap-2.5 xl:gap-3.5 2xl:gap-5 shrink-0">
            {menuItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                onClick={(e) => handleItemClick(e, item)}
                className={`px-2 lg:px-3 xl:px-3.5 py-2 rounded-xl text-[11px] lg:text-xs font-bold uppercase tracking-wider xl:tracking-widest whitespace-nowrap transition-all duration-200 inline-flex items-center justify-center leading-none text-center ${
                  isItemActive(item) 
                    ? "text-primary bg-primary/10 shadow-xs shadow-primary/20" 
                    : "text-white/75 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}
            <button 
              onClick={onOpenDonation}
              className="ml-1.5 lg:ml-2 xl:ml-3 bg-primary hover:bg-orange-600 text-black px-4 lg:px-5 xl:px-6 py-2.5 rounded-xl text-[11px] lg:text-xs font-black uppercase tracking-wider xl:tracking-widest whitespace-nowrap transition-all shadow-xl shadow-primary/10 hover:shadow-primary/30 active:scale-95 shrink-0 inline-flex items-center justify-center leading-none"
            >
              Doar Agora
            </button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-white/70 hover:text-primary transition-colors shrink-0"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[80%] bg-[#0A0A0A] border-l border-white/5 p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="font-display font-black text-primary text-sm uppercase tracking-[0.2em]">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-8">
                {menuItems.map((item, i) => (
                  <motion.a
                     key={item.label}
                     href={item.href}
                     onClick={(e) => {
                       setIsMenuOpen(false);
                       handleItemClick(e, item);
                     }}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className={`text-2xl font-black uppercase tracking-tighter transition-colors ${
                       isItemActive(item) ? "text-primary" : "text-white hover:text-primary"
                     }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenDonation();
                }}
                className="w-full py-6 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-primary/20"
              >
                Doar Agora
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ 
  onOpenDocuments, 
  onOpenAdminLogin 
}: { 
  onOpenDocuments: () => void; 
  onOpenAdminLogin: () => void; 
}) => {
  return (
    <section id="início" className="relative h-[90vh] flex items-end pb-32 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img 
          src="https://i.postimg.cc/0y34FKJ5/BANNER-SITE.jpg" 
          className="w-full h-full object-cover opacity-80"
          alt="Hero background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Cultura Viva e Transformação Social
          </span>
          <h1 className="text-4xl md:text-7xl font-black mb-4 leading-[1.1] text-white uppercase tracking-tighter">
            AJUDE A <span className="text-primary">PRESERVAR</span> NOSSA HISTÓRIA
          </h1>
          <p className="text-xs md:text-sm text-white/50 mb-8 font-light leading-relaxed max-w-md">
            Fundado em 2002 no bairro São Jorge, preservamos a tradição do Congado e transformamos vidas através da cultura e inclusão social.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button 
              onClick={onOpenDocuments}
              className="bg-primary hover:bg-orange-600 text-black px-10 py-5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer text-center"
            >
              PORTAL DA TRANSPARÊNCIA
            </button>
            <button 
              onClick={onOpenAdminLogin}
              className="flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-primary px-8 py-5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all backdrop-blur-md shadow-2xl hover:scale-105 active:scale-95 cursor-pointer text-center"
            >
              <Lock className="w-4 h-4 text-primary" />
              <span>ADICIONAR ARQUIVOS & LINKS</span>
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-20 right-0 w-1/3 h-24 bg-primary hidden xl:flex items-center justify-center gap-8 px-12 z-10"
      >
        <div className="text-black">
          <span className="block text-3xl font-black">2026</span>
          <span className="text-[10px] uppercase font-bold">Agenda Aberta</span>
        </div>
        <div className="w-px h-10 bg-black/20" />
        <div className="text-black flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold leading-tight">Membros<br/>Ativos</span>
          <span className="text-3xl font-black">600+</span>
        </div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  const pillars = [
    { title: "Cultura", desc: "Preservação do Congado e ritos tradicionais africanos.", icon: <Music className="w-8 h-8" /> },
    { title: "Esporte", desc: "Fomento à saúde e disciplina através de práticas coletivas.", icon: <Shield className="w-8 h-8" /> },
    { title: "Educação", desc: "Oficinas GRATUITAS de percussão para jovens.", icon: <Globe className="w-8 h-8" /> },
    { title: "Social", desc: "Assistência direta e transformação de comunidades.", icon: <Heart className="w-8 h-8" /> }
  ];

  return (
    <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {pillars.map((p, i) => (
        <motion.div 
          key={p.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="bg-black border border-white/5 p-10 rounded-3xl group hover:border-primary/50 transition-all hover:-translate-y-2 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black mb-6 group-hover:scale-110 transition-transform">
            {p.icon}
          </div>
          <h3 className="text-xl font-black uppercase mb-3 tracking-tighter">{p.title}</h3>
          <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
        </motion.div>
      ))}
    </section>
  );
};

const AboutSection = ({ onOpenImpactReport }: { onOpenImpactReport: () => void }) => {
  return (
    <section id="sobre-nós" className="py-32 px-6 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
          
          <div className="mb-20">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Quem Somos</span>
            <h2 className="text-4xl md:text-6xl font-black mb-12 leading-tight uppercase tracking-tighter text-white">
              História e <span className="text-primary italic">Resistência</span>
            </h2>
          </div>

          <div className="space-y-20">
            <div className="max-w-3xl mx-auto space-y-10">
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed italic">
                "Fundado em 2002 no bairro São Jorge, preservamos a tradição do Congado e transformamos vidas através da cultura e inclusão social."
              </p>
              <p className="text-lg text-white/50 leading-relaxed font-light">
                Fundada em 2002 por <span className="text-white font-bold">Malaquias Preto</span> e sua esposa <span className="text-white font-bold">Iara Aparecida Ferreira (Madrinha Iara)</span>, nossa organização atua como guardiã das tradições e promotora da dignidade humana através do Terno de Moçambique Estrela Guia.
              </p>
            </div>

            <div className="space-y-12">
              <div className="p-8 md:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Nossos Pilares</h3>
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {["Cultura", "Esporte", "Educação", "Social"].map(item => (
                    <li key={item} className="flex flex-col items-center gap-4 text-xs md:text-sm font-black uppercase tracking-widest text-white/60">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="max-w-md mx-auto">
                <button 
                  onClick={onOpenImpactReport}
                  className="w-full flex items-center justify-between px-10 py-8 bg-primary rounded-3xl text-black font-black uppercase tracking-[0.2em] text-sm group hover:bg-white transition-all shadow-2xl shadow-primary/20"
                >
                  Ver Relatório de Impacto 
                  <div className="p-3 bg-black/10 rounded-xl transition-all group-hover:bg-black group-hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = () => {
  const projects = [
    { 
      title: "Pró-Mirim Estrela Guia", 
      desc: "Iniciativa voltada para crianças e adolescentes. Formação cultural, percussão e cidadania focada na sucessão das tradições.",
      image: "https://images.unsplash.com/photo-1514525253344-f814d07295bf?q=80&w=800"
    },
    { 
      title: "Oficinas Criativas", 
      desc: "Dança (Afro/Street), Percussão, Artesanato, Grafite, Culinária, Zumba, Balé, Cavaco, Violão, Barbeiro, Contação de História, Capoeira e Projeto 60+ Canto Coral.",
      image: "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=800"
    },
    { 
      title: "Mãos Amigas (Social)", 
      desc: "Apoio emergencial com doação de leite, fraldas geriátricas, cestas básicas e itens essenciais para comunidades vulneráveis.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800"
    }
  ];

  return (
    <section id="projetos" className="py-32 px-6 bg-[#030303]">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Frentes de Atuação</span>
        <h2 className="text-6xl font-black mb-6">AÇÕES QUE TRANSFORMAM</h2>
        <div className="w-24 h-1 bg-primary mx-auto" />
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {projects.map((p, i) => (
          <motion.div 
            key={p.title}
            whileHover={{ y: -10 }}
            className="group"
          >
            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/5 mb-8">
              <img 
                src={p.image} 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
                alt={p.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
              <div className="absolute top-6 right-6">
                <span className="bg-primary text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                  100% GRATUITO
                </span>
              </div>
              <div className="absolute bottom-10 left-10 right-10">
                 <h3 className="text-3xl font-black mb-3">{p.title}</h3>
                 <p className="text-white/60 text-sm leading-relaxed mb-6">{p.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Dança Afro", icon: "🎭" },
            { label: "Percussão", icon: "🥁" },
            { label: "Street Dance", icon: "🕺" },
            { label: "Grafite", icon: "🎨" },
            { label: "Culinária", icon: "🍲" },
            { label: "Zumba", icon: "⚡" },
            { label: "Balé", icon: "🩰" },
            { label: "Violão", icon: "🎸" },
            { label: "Barbeiro", icon: "✂️" },
            { label: "Histórias", icon: "📚" },
            { label: "Capoeira", icon: "🥋" },
            { label: "60+ Coral", icon: "🎶" }
          ].map((skill, i) => (
            <motion.div 
              key={skill.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,165,0,0.1)" }}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center transition-all cursor-default"
            >
              <div className="text-2xl mb-2">{skill.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{skill.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CounterSection = () => {
  const stats = [
    { label: "Membros", value: "600" },
    { label: "Vidas Impactadas", value: "2500" },
    { label: "Voluntários", value: "6" },
    { label: "Fundado em", value: "2002" }
  ];

  return (
    <section className="bg-primary py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div 
            key={i} 
            className={`text-center text-black py-16 border-black/10 
              ${i % 2 === 0 ? "border-r" : "lg:border-r"} 
              ${i < 2 ? "border-b lg:border-b-0" : ""}
              ${i === 3 ? "lg:border-r-0" : ""}
            `}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-2 block">{s.label}</span>
            <span className="block text-5xl md:text-8xl font-black tracking-tighter leading-none">{s.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const VideoSection = () => {
  return (
    <section className="py-24 md:py-40 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000" 
          alt="Video background" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
      </div>
      <div className="relative z-10 text-center max-w-4xl px-6">
        <button className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-black mb-12 mx-auto hover:scale-110 active:scale-90 transition-all shadow-2xl shadow-primary/40">
           <Music className="w-10 h-10 ml-1" />
        </button>
        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">CONHEÇA O SOM DA NOSSA RESISTÊNCIA</h2>
        <p className="text-xl text-white/50 font-light">Assista ao documentário sobre o Terno Estrela Guia e sinta a energia do Congado.</p>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-32 px-6 bg-black text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9]">PRECISAMOS DA SUA<br/><span className="text-primary italic underline-offset-8">AJUDA</span> AGORA.</h2>
        <p className="text-lg text-white/40 mb-12 max-w-xl mx-auto leading-relaxed">
          Sua doação garante a manutenção da sede, compra de uniformes para as crianças e a realização da festa anual.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button className="bg-primary text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all">
            Fazer Doação Única
          </button>
          <button className="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
            Ser Doador Mensal
          </button>
        </div>

        <div className="pt-20 border-t border-white/5 text-left max-w-4xl mx-auto">
          <h3 className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-12 text-center">Nossas Metas Futuras</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Expansão", desc: "Ampliar o atendimento com mais recursos e materiais para novos jovens." },
              { title: "Sustentabilidade", desc: "Garantir remuneração justa para nossos oficineiros e líderes comunitários." },
              { title: "Infraestrutura", desc: "Melhorar e ampliar nossa sede física para acolher mais atividades e pessoas." }
            ].map((meta, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-3">{meta.title}</h4>
                <p className="text-white/30 text-xs leading-relaxed">{meta.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


// --- Próximos Eventos (Apresentações Futuras do Grupo) ---
interface UpcomingPresentationItem {
  id: string;
  title: string;
  dateBadge: {
    day: string;
    month: string;
    year: string;
  };
  dateText: string;
  time: string;
  location: string;
  address: string;
  city: string;
  category: string;
  description: string;
  details?: string;
  entryType: string;
  status: "Confirmado" | "Programado" | "Recorrente";
  image: string;
  mapQuery: string;
}

const defaultUpcomingPresentations: UpcomingPresentationItem[] = [
  {
    id: "festa-rosario-2026",
    title: "Grande Festa de Nossa Senhora do Rosário e São Benedito",
    dateBadge: { day: "11-12", month: "OUT", year: "2026" },
    dateText: "11 e 12 de Outubro de 2026",
    time: "A partir das 08h00 (Alvorada e Cortejo)",
    location: "Sede Moçambique Estrela Guia & Ruas do Bairro",
    address: "Rua do Dólar, 290 — Bairro São Jorge",
    city: "Uberlândia - MG",
    category: "Cortejo Tradicional",
    description: "O momento mais sagrado e esperado das nossas celebrações anuais. O Terno desfila com fardas azul e rosa, bastões, caixas e gungas entoando louvores aos santos protetores e à ancestralidade negra em um grandioso cortejo com mais de 600 participantes.",
    details: "Traje sugerido: roupas leves ou as cores do terno (azul e rosa). O cortejo percorre as principais ruas do bairro São Jorge com paradas rituais para bênçãos e orações nas casas dos devotos tradicionais.",
    entryType: "Aberto ao Público / Devoção Popular",
    status: "Confirmado",
    image: "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=1200",
    mapQuery: "Rua do Dólar, 290, São Jorge, Uberlândia, MG"
  },
  {
    id: "consciencia-negra-2026",
    title: "Cortejo Especial do Dia da Consciência Negra",
    dateBadge: { day: "20", month: "NOV", year: "2026" },
    dateText: "20 de Novembro de 2026",
    time: "15h30",
    location: "Praça Sérgio Pacheco & Centro Cultural",
    address: "Av. Afonso Pena, s/n — Centro",
    city: "Uberlândia - MG",
    category: "Apresentação Cultural",
    description: "Apresentação pública e cortejo em celebração à memória de Zumbi dos Palmares e à resistência afro-brasileira, com toques rituais de tambor, gungas ecoando e cânticos de liberdade compartilhados com toda a cidade.",
    details: "Apresentação especial com participação de mestres da cultura popular do Triângulo Mineiro, seguida por roda de capoeira e feira de saberes afro-mineiros.",
    entryType: "Entrada Franca na Praça",
    status: "Confirmado",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200",
    mapQuery: "Praça Sérgio Pacheco, Uberlândia, MG"
  },
  {
    id: "folia-reis-2027",
    title: "Tradicional Folia de Reis Estrela Guia",
    dateBadge: { day: "06", month: "JAN", year: "2027" },
    dateText: "06 de Janeiro de 2027",
    time: "17h00",
    location: "Quartel Moçambique Estrela Guia",
    address: "Rua do Dólar, 290 — Bairro São Jorge",
    city: "Uberlândia - MG",
    category: "Festividade Popular",
    description: "Celebração do ciclo natalino com o Terno de Reisado visitando os lares da comunidade. Os mestres e capitães entoam versos de fé e bênção ao som de caixas, gungas e violas caipiras.",
    details: "Cortejo comunitário com cânticos tradicionais de Santos Reis e partilha fraterna entre as famílias do bairro São Jorge.",
    entryType: "Livre para Toda a Família",
    status: "Programado",
    image: "https://images.unsplash.com/photo-1542601906960-daaa2303c990?q=80&w=1200",
    mapQuery: "Rua do Dólar, 290, São Jorge, Uberlândia, MG"
  },
  {
    id: "encontro-regional-2027",
    title: "Encontro Regional de Congadas e Moçambiques",
    dateBadge: { day: "14", month: "MAR", year: "2027" },
    dateText: "14 de Março de 2027",
    time: "10h00 às 17h00",
    location: "Parque do Sabiá (Arena Multiuso)",
    address: "Av. Anselmo Alves dos Santos, s/n — Tibery",
    city: "Uberlândia - MG",
    category: "Apresentação Cultural",
    description: "Intercâmbio de grupos tradicionais com dezenas de guardas de Congado, Catupé e Moçambique de Minas Gerais e Goiás. O Estrela Guia apresenta a força rítmica dos seus tambores e cantigas centenárias.",
    details: "Grande encontro com feira cultural, gastronomia tradicional e apresentações contínuas dos grupos tradicionais convidados.",
    entryType: "Entrada Franca no Parque",
    status: "Programado",
    image: "https://i.postimg.cc/BQ6s5pQ4/Whats-App-Image-2026-05-12-at-09-18-41-3.jpg",
    mapQuery: "Parque do Sabiá, Uberlândia, MG"
  },
  {
    id: "arraia-mocambique-2027",
    title: "Festa Junina e Arraiá Solidário do Moçambique",
    dateBadge: { day: "21", month: "JUN", year: "2027" },
    dateText: "21 de Junho de 2027",
    time: "A partir das 12h00",
    location: "Quartel Estrela Guia",
    address: "Rua do Dólar, 290 — Bairro São Jorge",
    city: "Uberlândia - MG",
    category: "Festividade Popular",
    description: "Festejo comunitário com quadrilha caipira, apresentações musicais convidadas, barracas de comidas típicas e brincadeiras tradicionais. Renda e mantimentos destinados aos projetos sociais do Ponto de Cultura.",
    details: "Shows ao vivo com Carvalho & Mariano, Grupo Quinteto do Samba e Alberto & Cristiano, além de bingo solidário e comidas típicas.",
    entryType: "1 kg de Alimento Não Perecível",
    status: "Programado",
    image: "https://i.postimg.cc/XJCdncH7/3075998a-3aae-4468-9018-de160d328055.jpg",
    mapQuery: "Rua do Dólar, 290, São Jorge, Uberlândia, MG"
  },
  {
    id: "oficina-percussao-recorrente",
    title: "Ensaio Geral Aberto & Vivência de Percussão Ancestral",
    dateBadge: { day: "SÁB", month: "QUINZENAL", year: "2026/27" },
    dateText: "1º e 3º Sábado de Cada Mês",
    time: "16h00 às 18h30",
    location: "Ponto de Cultura Estrela Guia",
    address: "Rua do Dólar, 290 — Bairro São Jorge",
    city: "Uberlândia - MG",
    category: "Oficinas & Ensaios",
    description: "Ensaio preparatório aberto para novos integrantes e público geral. Venha conhecer a afinação dos tambores, os passos da marcha do Moçambique e a história de resistência contada em cada cântico.",
    details: "Instrumentos fornecidos no local pelo projeto. Não é necessária experiência prévia com instrumentos de percussão.",
    entryType: "Gratuito / Aberto a Iniciantes",
    status: "Recorrente",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
    mapQuery: "Rua do Dólar, 290, São Jorge, Uberlândia, MG"
  }
];

const UpcomingEventsSection = () => {
  const [presentations, setPresentations] = useState<UpcomingPresentationItem[]>(defaultUpcomingPresentations);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<UpcomingPresentationItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inscrição em tempo real com o Firestore para carregar eventos dinâmicos caso existam
  useEffect(() => {
    const unsubscribe = subscribeToEvents((firestoreEvents) => {
      if (firestoreEvents && firestoreEvents.length > 0) {
        // Mapear eventos do firestore que tenham dados customizados
        const mappedFromFirestore: UpcomingPresentationItem[] = firestoreEvents.map((fe, idx) => {
          const parts = (fe.date || "").split("/");
          const dayPart = parts[0] || "DIA";
          const monthPart = (parts[1] || "MÊS").toUpperCase();

          return {
            id: fe.id || `firestore-event-${idx}`,
            title: fe.title,
            dateBadge: {
              day: dayPart,
              month: monthPart,
              year: "2026"
            },
            dateText: fe.date,
            time: fe.time || "Horário a confirmar",
            location: fe.location || "Sede Estrela Guia",
            address: fe.address || "Rua do Dólar, 290, Bairro São Jorge",
            city: "Uberlândia - MG",
            category: fe.category || "Apresentação Cultural",
            description: fe.description || "Apresentação cultural do Terno de Moçambique Estrela Guia com toques de caixa, gungas e cantigas ancestrais da tradição afro-brasileira.",
            details: fe.description || "Evento oficial da programação cultural do Terno de Moçambique Estrela Guia.",
            entryType: fe.ticketInfo || "Aberto ao Público",
            status: (fe.status === "Confirmado" || fe.status === "Recorrente" || fe.status === "Programado") ? fe.status : "Confirmado",
            image: fe.image || "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=1200",
            mapQuery: `${fe.location || "Rua do Dólar, 290"}, Uberlândia - MG`
          };
        });

        // Combinar com as apresentações padrões preservando itens únicos por título
        const existingTitles = new Set(mappedFromFirestore.map(e => e.title.toLowerCase().trim()));
        const uniqueDefaults = defaultUpcomingPresentations.filter(d => !existingTitles.has(d.title.toLowerCase().trim()));
        setPresentations([...mappedFromFirestore, ...uniqueDefaults]);
      }
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    "Todos",
    "Cortejo Tradicional",
    "Apresentação Cultural",
    "Festividade Popular",
    "Oficinas & Ensaios"
  ];

  const filteredEvents = presentations.filter((ev) => {
    const matchesCategory = selectedCategory === "Todos" || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.dateText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const createGoogleCalendarUrl = (ev: UpcomingPresentationItem) => {
    const title = encodeURIComponent(`${ev.title} — Moçambique Estrela Guia`);
    const details = encodeURIComponent(
      `${ev.description}\n\nLocal: ${ev.location} (${ev.address}, ${ev.city})\nHorário: ${ev.time}\nEntrada: ${ev.entryType}\nOrganização: Terno de Moçambique Estrela Guia`
    );
    const location = encodeURIComponent(`${ev.location}, ${ev.address}, ${ev.city}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const createGoogleMapsUrl = (ev: UpcomingPresentationItem) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery || `${ev.location}, ${ev.address}, ${ev.city}`)}`;
  };

  const handleCopyDetails = (ev: UpcomingPresentationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `🌟 Apresentação: ${ev.title}\n📅 Data: ${ev.dateText}\n⏰ Horário: ${ev.time}\n📍 Local: ${ev.location} (${ev.address}, ${ev.city})\n🎟️ Entrada: ${ev.entryType}\nℹ️ ${ev.description}\n\nOrganização: Terno de Moçambique Estrela Guia`;
    navigator.clipboard.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="proximos-eventos" className="py-24 md:py-32 px-6 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      {/* Glow decorativo de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3 text-primary" />
              Apresentações & Cortejos
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-display">
              PRÓXIMOS <span className="text-primary italic">EVENTOS</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">
              Acompanhe as próximas apresentações públicas, cortejos tradicionais e encontros culturais do 
              <span className="text-white font-semibold"> Terno de Moçambique Estrela Guia</span>. Venha celebrar conosco a fé, o som ancestral das caixas e a rica tradição do Congado.
            </p>
          </div>

          {/* Quick Counter / Info Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl">
              {presentations.length}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                Calendário Cultural
              </span>
              <span className="text-xs text-white/70 font-medium">
                Apresentações confirmadas e abertas
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-12">
          {/* Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative min-w-[240px] lg:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por evento ou local..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Grid de Cards de Próximos Eventos */}
        {filteredEvents.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-xl mx-auto space-y-4">
            <Calendar className="w-12 h-12 text-primary/40 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Nenhum evento encontrado</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Não encontramos apresentações correspondentes ao filtro selecionado. Tente alterar a categoria ou a busca.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
            >
              Ver todas as apresentações
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map((ev, index) => {
              const isCopied = copiedId === ev.id;
              return (
                <motion.article
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-primary/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-primary/5 relative cursor-pointer"
                  onClick={() => setSelectedEvent(ev)}
                >
                  {/* Top Image Banner com Tags Sobrepostas */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/50">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-black/40 to-black/30" />

                    {/* Bloco de Data (Ticket Badge Estilizado) */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md border border-primary/30 rounded-2xl px-3 py-2 min-w-[58px] shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary leading-none">
                        {ev.dateBadge.month}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white leading-tight font-display">
                        {ev.dateBadge.day}
                      </span>
                      <span className="text-[9px] font-mono text-white/50 leading-none">
                        {ev.dateBadge.year}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                        ev.status === "Confirmado"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : ev.status === "Recorrente"
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-white/10 text-white/80 border border-white/15"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ev.status === "Confirmado" ? "bg-emerald-400 animate-pulse" : "bg-primary"
                        }`} />
                        {ev.status}
                      </span>
                    </div>

                    {/* Categoria do Evento (Floating Pill) */}
                    <div className="absolute bottom-3 left-4 z-10">
                      <span className="inline-block px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-primary text-[10px] font-black uppercase tracking-wider">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3.5">
                      {/* Título da Apresentação */}
                      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {ev.title}
                      </h3>

                      {/* Metadados: Data e Horário */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-white/90 font-medium">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          <span>{ev.dateText}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span>{ev.time}</span>
                        </div>
                        {/* Local */}
                        <div className="flex items-start gap-2 text-white/70 pt-0.5">
                          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div className="leading-snug">
                            <span className="text-white font-medium block">{ev.location}</span>
                            <span className="text-white/40 text-[11px] block">{ev.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Breve descrição das apresentações futuras do grupo */}
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-white/70 text-xs sm:text-[13px] leading-relaxed line-clamp-3">
                          {ev.description}
                        </p>
                      </div>
                    </div>

                    {/* Badges de Entrada e Acesso */}
                    <div className="flex items-center justify-between gap-2 pt-2 text-[11px] font-bold">
                      <span className="inline-flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                        <Ticket className="w-3 h-3 shrink-0" />
                        {ev.entryType}
                      </span>
                      <span className="text-white/40 uppercase tracking-widest text-[10px]">
                        {ev.city}
                      </span>
                    </div>
                  </div>

                  {/* Rodapé de Ações do Card */}
                  <div 
                    className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Botão Ver Detalhes */}
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Detalhes
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Grupo de Ações Rápidas */}
                    <div className="flex items-center gap-1.5">
                      {/* Copiar Informações */}
                      <button
                        onClick={(e) => handleCopyDetails(ev, e)}
                        title={isCopied ? "Copiado!" : "Copiar detalhes do evento"}
                        className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isCopied
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Abrir Google Maps */}
                      <a
                        href={createGoogleMapsUrl(ev)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver local no Google Maps"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>

                      {/* Adicionar ao Google Agenda */}
                      <a
                        href={createGoogleCalendarUrl(ev)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Salvar no Google Agenda"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-black hover:bg-amber-400 font-black uppercase text-[10px] tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">Agenda</span>
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Banner Inferior: Convite para Contratação e Participação */}
        <div className="mt-16 p-8 md:p-10 rounded-3xl bg-linear-to-r from-white/[0.03] to-primary/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg md:text-xl font-black uppercase text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Deseja convidar o Estrela Guia para sua cidade ou evento?
            </h4>
            <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed max-w-2xl">
              Realizamos apresentações em festivais culturais, cortejos de congado, eventos corporativos sociais, palestras e vivências em escolas e universidades.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="mailto:contato@estrelaguia.org?subject=Convite%20para%20Apresenta%C3%A7%C3%A3o%20-%20Mo%C3%A7ambique%20Estrela%20Guia"
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-amber-400 text-black font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              Falar com a Produção
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes Completos do Evento */}
      <AnimatePresence>
        {selectedEvent && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image do Modal */}
              <div className="relative h-48 sm:h-56 w-full shrink-0">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-black/50 to-transparent" />
                
                {/* Fechar */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badge de categoria flutuante */}
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-wider">
                    {selectedEvent.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider border border-white/10">
                    {selectedEvent.status}
                  </span>
                </div>
              </div>

              {/* Corpo do Modal com Scroll */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-primary text-xs font-bold uppercase tracking-wider">
                    Terno de Moçambique Estrela Guia
                  </p>
                </div>

                {/* Grid de Informações Chave */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> Data & Horário
                    </span>
                    <p className="text-xs font-black text-white">{selectedEvent.dateText}</p>
                    <p className="text-[11px] text-white/60">{selectedEvent.time}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Local & Endereço
                    </span>
                    <p className="text-xs font-black text-white">{selectedEvent.location}</p>
                    <p className="text-[11px] text-white/60">{selectedEvent.address}, {selectedEvent.city}</p>
                  </div>
                </div>

                {/* Descrição Detalhada da Apresentação */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-widest">
                    Sobre a Apresentação
                  </h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Recomendações e Informações Adicionais */}
                {selectedEvent.details && (
                  <div className="space-y-2 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <h4 className="text-[11px] font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Orientações para a Comunidade
                    </h4>
                    <p className="text-white/70 text-xs leading-relaxed">
                      {selectedEvent.details}
                    </p>
                    <div className="pt-2 text-[11px] text-white/60 font-medium">
                      🎟️ Entrada: <span className="text-white font-bold">{selectedEvent.entryType}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações do Modal */}
              <div className="p-4 sm:p-6 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => handleCopyDetails(selectedEvent)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {copiedId === selectedEvent.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Informações</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={createGoogleMapsUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-primary" />
                    Como Chegar
                  </a>
                  <a
                    href={createGoogleCalendarUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Salvar na Agenda
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};


const Agenda = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const initialEvents = [
    { date: "12/Outubro", title: "Festa de Nossa Senhora do Rosário", location: "Sede Moçambique", status: "Confirmado" },
    { date: "20/Novembro", title: "Semana da Consciência Negra", location: "Praça Central", status: "Em Planejamento" }
  ];

  const recurringEvents = [
    { date: "Toda Quarta", title: "Oficina de Percussão GRATUITA", location: "Centro Cultural", status: "Recorrente" },
    { date: "Mensal", title: "Ação Social Moçambique", location: "Comunidade", status: "Ativo" }
  ];

  useEffect(() => {
    const unsubscribe = subscribeToEvents((fetchedEvents) => {
      if (fetchedEvents.length > 0) {
        setEvents(fetchedEvents);
      }
    });
    return () => unsubscribe();
  }, []);

  const displayEvents = events.length > 0 ? events : [...initialEvents, ...recurringEvents];

  return (
    <section id="agenda" className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-12 bg-primary rounded-full" />
          <h2 className="text-4xl font-bold uppercase tracking-tight font-display">Agenda Pública</h2>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/5 shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-black">
                <th className="px-8 py-6 text-left font-black uppercase text-xs tracking-widest first:rounded-tl-3xl">Data</th>
                <th className="px-8 py-6 text-left font-black uppercase text-xs tracking-widest">Evento / Compromisso</th>
                <th className="px-8 py-6 text-left font-black uppercase text-xs tracking-widest">Local</th>
                <th className="px-8 py-6 text-left font-black uppercase text-xs tracking-widest last:rounded-tr-3xl">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white/[0.02] backdrop-blur-sm">
              {displayEvents.map((ev, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors group">
                  <td className="px-8 py-8 font-black text-primary text-sm uppercase tracking-tighter">{ev.date}</td>
                  <td className="px-8 py-8 font-bold text-white text-lg">{ev.title}</td>
                  <td className="px-8 py-8 text-white/40 text-sm">{ev.location}</td>
                  <td className="px-8 py-8">
                    <span className="px-5 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-black transition-all">
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-4">
          {displayEvents.map((ev, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="font-black text-primary text-xs uppercase tracking-widest">{ev.date}</span>
                <span className="px-4 py-1.5 rounded-lg bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/40">
                  {ev.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">{ev.title}</h3>
              <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-bold tracking-widest">
                <MapPin className="w-3 h-3 text-primary" /> {ev.location}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Shared Galleries Data ---
const galleries = [
  {
    id: 1,
    title: "Festa do Rosário 2023",
    date: "12 de Outubro, 2023",
    location: "Sede Moçambique",
    cover: "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=2000",
    description: "A principal festividade do calendário da congada, celebrando com profunda devoção Nossa Senhora do Rosário e São Benedito. A comunidade se une em orações, cortejos e cânticos ancestrais com as cores azul e rosa do Terno de Moçambique Estrela Guia, colorindo e emocionando as ruas do bairro São Jorge.",
    images: [
      "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=2000",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000",
      "https://images.unsplash.com/photo-1542601906960-daaa2303c990?q=80&w=2000"
    ]
  },
  {
    id: 2,
    title: "Oficina de Percussão",
    date: "Todo Sábado",
    location: "Ponto de Cultura",
    cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000",
    description: "Um espaço pedagógico e cultural de transmissão oral de saberes musicais. Nossas oficinas promovem o aprendizado dos ritmos tradicionais, toques de caixas e do gungunar dos tambores, conectando crianças, jovens e adultos com a pulsação ancestral de nosso patrimônio.",
    images: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000",
      "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=2000"
    ]
  },
  {
    id: 3,
    title: "Consciência Negra",
    date: "Novembro 2023",
    location: "Praça Tubal Vilela",
    cover: "https://images.unsplash.com/photo-1542601906960-daaa2303c990?q=80&w=2000",
    description: "Apresentações públicas, rodas de conversa e atos de celebração que exaltam a resistência espiritual e cultural da população negra. Realizamos manifestações que fortalecem a identidade afro-brasileira e defendem a igualdade social e o respeito em Uberlândia.",
    images: [
      "https://images.unsplash.com/photo-1542601906960-daaa2303c990?q=80&w=2000",
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000"
    ]
  },
  {
    id: 4,
    title: "Ação Solidária",
    date: "Dezembro 2023",
    location: "Bairro São Jorge",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000",
    description: "Nosso compromisso social direto com o bem-estar de nossa comunidade. Realizamos a distribuição recorrente de alimentos, kits de higiene e agasalhos para as famílias em situação de vulnerabilidade no entorno de nossa sede, promovendo auxílio urgente e afeto.",
    images: [
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000",
      "https://images.unsplash.com/photo-1514525253344-f814d07295bf?q=80&w=2000"
    ]
  },
  {
    id: 5,
    title: "Ensaio Geral",
    date: "Setembro 2023",
    location: "Rua do Dólar",
    cover: "https://images.unsplash.com/photo-1514525253344-f814d07295bf?q=80&w=2000",
    description: "O momento sagrado em que todos os membros do Terno se encontram para alinhar o compasso dos tambores, afinar os cantos e ensaiar a marcha pelas ruas. Sob as orientações dos capitães, o ensaio geral prepara o espírito e a técnica da comunidade.",
    images: [
      "https://images.unsplash.com/photo-1514525253344-f814d07295bf?q=80&w=2000",
      "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=2000"
    ]
  },
  {
    id: 6,
    title: "Roda de Capoeira",
    date: "Regular",
    location: "Ponto de Cultura",
    cover: "https://i.postimg.cc/BQ6s5pQ4/Whats-App-Image-2026-05-12-at-09-18-41-3.jpg",
    description: "Excelente exemplo de integração física, de defesa histórica e de ritmo. Preservando a capoeira como símbolo de resistência na periferia, ensinamos técnicas corporais, canto, instrumentalização (berimbau, atabaque, pandeiro) e socialização reflexiva.",
    images: [
      "https://i.postimg.cc/BQ6s5pQ4/Whats-App-Image-2026-05-12-at-09-18-41-3.jpg",
      "https://i.postimg.cc/15tP0B5S/Whats-App-Image-2026-05-12-at-09-18-39-2.jpg",
      "https://i.postimg.cc/9FMVPbFV/Whats-App-Image-2026-05-12-at-09-18-38-2.jpg",
      "https://i.postimg.cc/jdgxB9kW/Whats-App-Image-2026-05-12-at-09-18-36-1.jpg"
    ]
  },
  {
    id: 7,
    title: "Festa Junina do Moçambique Estrela Guia",
    date: "Junho",
    location: "Sede Moçambique",
    cover: "https://i.postimg.cc/XJCdncH7/3075998a-3aae-4468-9018-de160d328055.jpg",
    description: "Nossa grande celebração de São João na sede do Terno. Uma fogueira imensa, mastro dos santos padroeiros, quadrilha animada e barraquinhas com quitutes deliciosos que unem os moradores de Uberlândia em um momento alegre e acolhedor.",
    images: [
      "https://i.postimg.cc/XJCdncH7/3075998a-3aae-4468-9018-de160d328055.jpg",
      "https://i.postimg.cc/C1qkwHPK/466e5d6c-ea15-4772-8d2b-66c5ac31e1b4.jpg",
      "https://i.postimg.cc/63vnBLj3/c6d95a5d-24fe-47ef-a64e-c311c108c87e.jpg",
      "https://i.postimg.cc/3Rvm3CSN/ff61ddc2-b5eb-482b-9248-b8ce3d89999a.jpg",
      "https://i.postimg.cc/xTcvV2VZ/Whats-App-Image-2026-06-21-at-07-21-35.jpg",
      "https://i.postimg.cc/9FrdHhH6/Whats-App-Image-2026-06-21-at-07-21-36.jpg",
      "https://i.postimg.cc/9FrdHhHN/Whats-App-Image-2026-06-21-at-07-21-36-(1).jpg",
      "https://i.postimg.cc/kXBQPmPp/Whats-App-Image-2026-06-21-at-07-21-36-(2).jpg",
      "https://i.postimg.cc/Fs7yX4Xq/Whats-App-Image-2026-06-21-at-07-21-36-(3).jpg",
      "https://i.postimg.cc/ncC4fJf6/Whats-App-Image-2026-06-21-at-07-21-36-(4).jpg",
      "https://i.postimg.cc/SNJ6bhpk/Whats-App-Image-2026-06-21-at-07-21-37.jpg",
      "https://i.postimg.cc/WbhGcvPR/Whats-App-Image-2026-06-21-at-07-21-37-(1).jpg",
      "https://i.postimg.cc/L6ntFpMM/Whats-App-Image-2026-06-21-at-07-21-37-(2).jpg",
      "https://drive.google.com/file/d/1fb0XTgYjm6Q8lwbk_TnTfBR6SeUeodtq/view?usp=sharing",
      "https://drive.google.com/file/d/1RGESiFfQyjzIbPecuAF_mpA68UruO3g0/view?usp=sharing",
      "https://drive.google.com/file/d/14DVFafrB9xmJuCHDZciQrZ6ziHa1djPu/view?usp=sharing",
      "https://drive.google.com/file/d/15gvlxD_yTIt-4_N2Uyn3fX9T8pgBlQOW/view?usp=sharing",
      "https://drive.google.com/file/d/1HrFus24gjej45p0Yd2DO1nEQuXokJg74/view?usp=sharing",
      "https://drive.google.com/file/d/1fFdYOU7k51sSlQ6s1QeyicwZdIfG0Eiy/view?usp=sharing",
      "https://drive.google.com/file/d/1EgHuTTvIF_KBdNyPsCRqpIY3kMWgubcg/view?usp=sharing",
      "https://drive.google.com/file/d/1HEJrcS-3P2HCMT5Bshxgf91pOoKzMv-X/view?usp=sharing",
      "https://drive.google.com/file/d/1AXgQv4zoMt-P95xEH9nb48pP2o6luquB/view?usp=sharing",
      "https://drive.google.com/file/d/1aSVAubaZXvhY9I3H_YPVOW-RgL1Vq1Bv/view?usp=sharing",
      "https://drive.google.com/file/d/1lncWWJ-Fcd17v7xAJmEz1Suwgj6ddn3G/view?usp=sharing"
    ]
  },
  {
    id: 8,
    title: "Fotos dos eventos realizados – Instrumento nº 977307",
    date: "Instrumento nº 977307",
    location: "Sede Moçambique Estrela Guia",
    cover: "https://lh3.googleusercontent.com/d/1zCjw-1WNKZUeplKMDh435YmJEVT9GGLj=w1000",
    description: "Registros fotográficos das atividades culturais realizadas no âmbito do projeto, para comprovação da execução física e transparência das ações vinculadas ao Instrumento nº 977307.",
    images: [
      "https://drive.google.com/file/d/1zCjw-1WNKZUeplKMDh435YmJEVT9GGLj/view?usp=sharing",
      "https://drive.google.com/file/d/1KFrODDZ34hjJJP3yKxFHF8IKnRgpw22l/view?usp=sharing",
      "https://drive.google.com/file/d/1kDztWw3akTkAZnFK1QwCb5SxT_oGj9Y9/view?usp=sharing",
      "https://drive.google.com/file/d/1R3hUwFFx3NBVLQODOasZCchGV7XI33R2/view?usp=sharing",
      "https://drive.google.com/file/d/1JrbThumjJNfYwefc8hNKej-0OK6oc7Up/view?usp=sharing",
      "https://drive.google.com/file/d/1ORByvc1ZEfdKVdpImjUgBXhJhWTCdMYg/view?usp=sharing",
      "https://drive.google.com/file/d/1zOFf68v-HCzyUlFuYGN9p0oI53flIJE4/view?usp=sharing"
    ]
  },
  {
    id: 9,
    title: "Pagode com Feijoada",
    date: "Confraternização Cultural",
    location: "Quartel Moçambique Estrela Guia - Rua do Dólar, 290 — São Jorge",
    cover: "https://lh3.googleusercontent.com/d/19FyHebMAZby1r41fRaVMN37hGVd-txuU=w1000",
    description: "Tradicional Pagode com Feijoada no Quartel do Moçambique Estrela Guia. Encontro festivo de confraternização, gastronomia e samba com a comunidade, celebrando a cultura popular com muita música, alegria e união.",
    images: [
      "https://drive.google.com/file/d/19FyHebMAZby1r41fRaVMN37hGVd-txuU/view?usp=sharing",
      "https://drive.google.com/file/d/1jVmURqlvog0fn8eZYAPNhcEWmWW0ftu2/view?usp=sharing",
      "https://drive.google.com/file/d/1U8Pkm5YeSA_25_Z4KfcC2uP_OmHvTk6R/view?usp=sharing",
      "https://drive.google.com/file/d/1Y2EEn8y_agLgj0dZbd4R-aa-9X5QFFeh/view?usp=sharing",
      "https://drive.google.com/file/d/1scS9Mu9nhO4saJM-FhYBtaXh4UeFg99h/view?usp=sharing"
    ]
  }
];

const Gallery = ({ onOpenGallery }: { onOpenGallery: (id: number) => void }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section id="galeria" className="py-24 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-2 h-16 bg-primary rounded-full shadow-[0_0_20px_rgba(255,165,0,0.3)]" />
            <div>
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Memórias Coletivas</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Álbuns de Eventos</h2>
            </div>
          </div>
          <p className="text-white/40 text-sm max-w-sm font-medium leading-relaxed">
            Cada miniatura abre uma galeria de fotos completa. Toque para explorar nossa história através das lentes da comunidade.
          </p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {galleries.map((gallery) => (
            <motion.div 
              key={gallery.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              onClick={() => onOpenGallery(gallery.id)}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] cursor-pointer group shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Container with high contrast hover effects */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img 
                  src={gallery.cover} 
                  alt={gallery.title} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-95 group-hover:scale-105 transition-all duration-750"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                
                {/* Date Tag Overlay */}
                <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
                  {gallery.date}
                </span>

                {/* Explore overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-primary hover:bg-orange-600 text-black text-[10px] font-black uppercase tracking-widest px-4.5 py-2.5 rounded-full shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Ver Fotos <Share2 className="w-3.5 h-3.5 rotate-45" />
                  </span>
                </div>
              </div>

              {/* Informative Content Box under the image */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                    {gallery.title}
                  </h3>
                  
                  <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                    {gallery.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> 
                  <span className="truncate">{gallery.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TeamSection = () => {
    const team = [
      { 
        name: "Malaquias Preto", 
        role: "Capitão Fundador", 
        bio: "Mestre dos ritos, conduz o Estrela Guia preservando os ritos do Congado há décadas.",
        image: "https://i.postimg.cc/RVhnhWqj/CAPITAO-MALAQUIAS-FOTO.png"
      },
      { 
        name: "Madrinha Iara", 
        role: "Presidente Fundadora", 
        bio: "Iara Aparecida Ferreira, pilar fundamental na gestão social e acolhimento da comunidade.",
        image: "https://i.postimg.cc/jSRKRStd/Gemini-Generated-Image-4ohjaa4ohjaa4ohj.png"
      },
      { 
        name: "Elenion (Leno)", 
        role: "Presidente", 
        bio: "Uma das pessoas mais importantes da minha vida, meu padrasto que amo tanto Elenion ( Leno) , para quem não sabe ele não tem filhos de sangue, mas criou o gente, nos acompanhou nos levando ao altar para nos casar, estava em todas as minhas formaturas, padrinho do meu filho Luã( igreja), Marco Tulio (fogueira) e Lucas (fogueira) e está comigo em tudo que me proponho a fazer. Te amamos, te amamos, Feliz dia dos pais.",
        image: "https://i.postimg.cc/JhvVqC01/ecea6dcf-501f-42a3-955a-ea26328edc79.jpg"
      },
      { name: "Direção Coletiva", role: "Gestão Estratégica", bio: "Responsável pela ponte entre a tradição e as ações sociais, editais e parcerias externas." }
    ];
  
    return (
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-2 h-12 bg-primary rounded-full" />
            <h2 className="text-4xl font-bold font-display uppercase tracking-widest">Equipe Diretiva</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div 
                key={member.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-[2.5rem] bg-[#0F0F0F] p-10 border border-white/5 group overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500" />
                <div className="mb-8 w-full aspect-square rounded-[2rem] bg-white/5 overflow-hidden border border-white/10 shadow-inner">
                  {member.image ? (
                    <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-white/10 to-transparent flex items-center justify-center">
                       <Users className="w-16 h-16 text-white/10 group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{member.name}</h3>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">{member.role}</p>
                <p className="text-white/40 text-sm leading-relaxed font-light">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

const Interactivity = ({ onOpenComments }: { onOpenComments: () => void }) => {
  return (
    <section className="py-24 px-6 bg-linear-to-b from-black to-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-12 bg-primary rounded-full" />
          <h2 className="text-4xl font-bold">Interatividade e Funcionalidades</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Shield className="text-primary" /> Controle Total
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Download className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Baixar registros</h4>
                  <p className="text-white/40 text-sm">Salve registros das ações culturais e sociais.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copiado para a área de transferência!");
                  }}
                  className="flex items-start gap-4 text-left group"
                >
                  <Share2 className="w-6 h-6 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">Compartilhar</h4>
                    <p className="text-white/40 text-sm">Dissemine nossa causa em redes sociais.</p>
                  </div>
                </button>
              </li>
              <li className="flex items-start gap-4">
                <button onClick={onOpenComments} className="flex items-start gap-4 text-left group">
                  <MessageCircle className="w-6 h-6 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">Comentar</h4>
                    <p className="text-white/40 text-sm">Deixe sua mensagem (Feedback Público).</p>
                  </div>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <History className="text-primary" /> Banco de Dados
              </h3>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Todas as interações são registradas em tempo real, permitindo que a comunidade visualize os comentários de todos os visitantes, criando um mural de gratidão e sugestões.
              </p>
            </div>
            <button 
              onClick={onOpenComments}
              className="w-full py-5 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-black transition-all text-lg tracking-widest uppercase"
            >
              Visualizar Comentários
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ManagementRecords = () => {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-12 bg-primary rounded-full" />
          <h2 className="text-4xl font-bold">Reconhecimentos e Impacto</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-12 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-bold mb-4">Ponto de Cultura</h3>
            <p className="text-white/40 text-sm italic">"Reconhecido como Ponto de Cultura de Minas Gerais em 2010."</p>
          </div>
          <div className="p-12 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-bold mb-4">Prêmio Grande Otelo</h3>
            <p className="text-white/40 text-sm">Honraria recebida pelos serviços sócio-culturais prestadores à Uberlândia.</p>
          </div>
          <div className="p-12 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-bold mb-4">Atuação Global</h3>
            <p className="text-white/40 text-sm">Apresentações em mais de 30 cidades mineiras e 10 estados brasileiros.</p>
          </div>
          <div className="p-12 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-bold mb-4">Ação Pandemia</h3>
            <p className="text-white/40 text-sm">5.000 pessoas atendidas com segurança alimentar e higiene básica.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const DonationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-[#111] rounded-3xl border border-white/10 p-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />
        <h3 className="text-3xl font-black mb-6">Apoie o <span className="text-primary italic">Estrela Guia</span></h3>
        <p className="text-white/50 mb-8 leading-relaxed">Sua doação ajuda a manter nossa sede e projetos sociais vivos. Escolha um método:</p>
        
        <div className="space-y-4">
          <div 
            className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary transition-colors cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText("06207190000107");
              alert("CNPJ copiado para o clipboard!");
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-black text-white">PIX (CNPJ)</span>
                <span className="text-xs text-white/40">06.207.190/0001-07</span>
                <p className="text-[10px] text-white/20 mt-1 uppercase font-bold">Terno Moçambique Estrela Guia</p>
              </div>
              <button className="text-primary font-bold text-xs uppercase tracking-widest group-hover:underline flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copiar
              </button>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <span className="block font-black text-white mb-2">Dados da Instituição</span>
            <div className="text-xs text-white/40 space-y-1">
              <p className="font-bold text-white/60">Terno Moçambique Estrela Guia</p>
              <p>CNPJ: 06.207.190/0001-07</p>
              <p>Banco: Caixa Econômica Federal</p>
            </div>
          </div>
        </div>
        
        <button onClick={onClose} className="mt-10 w-full py-4 bg-primary text-black font-black uppercase tracking-widest rounded-xl">Fechar</button>
      </motion.div>
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          <div>
            <div className="flex items-center mb-8">
              <span className="font-display font-black text-xl uppercase text-white tracking-tight">
                Moçambique Estrela Guia
              </span>
            </div>
            <p className="text-white/40 leading-relaxed italic mb-4">"Resistência que canta, fé que guia. Patrimônio imaterial de Uberlândia."</p>
            <div className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] space-y-1">
              <p>Terno Moçambique Estrela Guia</p>
              <p>CNPJ: 06.207.190/0001-07</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Contatos</h4>
            <div className="flex flex-col gap-4">
              <a 
                href="https://www.instagram.com/mocambique_estrela_guia?igsh=aDh6OTExamExb3hv" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" /> Instagram
              </a>
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <MapPin className="w-5 h-5 text-primary" /> Rua do Dólar, 290 - Bairro São Jorge, Uberlândia-MG
              </a>
              <a href="mailto:contato@estrelaguia.org" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <Mail className="w-5 h-5 text-primary" /> contato@estrelaguia.org
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Informativo</h4>
            <p className="text-sm text-white/40 leading-relaxed">Inscreva-se para receber atualizações da nossa agenda e novos projetos sociais.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Seu email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex-1 outline-none focus:border-primary transition-colors text-sm" 
              />
              <button className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest">
                {subscribed ? "OK!" : "Enviar"}
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 text-white/20 text-xs gap-4">
          <p>© {new Date().getFullYear()} Moçambique Estrela Guia. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingDonationButton = ({ onOpen }: { onOpen: () => void }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ scale: 0, opacity: 0, x: 50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0, opacity: 0, x: 50 }}
          whileHover={{ scale: 1.05 }}
          whileActive={{ scale: 0.95 }}
          onClick={onOpen}
          className="fixed bottom-8 right-8 z-[100] bg-primary text-black p-5 rounded-full shadow-[0_0_50px_rgba(255,165,0,0.4)] flex items-center justify-center group"
          id="floating-donation-btn"
        >
          <Heart className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          <span className="max-w-0 group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 overflow-hidden whitespace-nowrap font-black uppercase text-[10px] tracking-widest">
            Doar Agora
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Shows e Eventos Page Component ---
interface EventShow {
  id: number;
  title: string;
  date: string;
  location: string;
  cover: string;
  description: string;
  galleryId?: number;
  modalidade?: string;
}

const eventsData: EventShow[] = [
  {
    id: 1,
    title: "Folia de Reis",
    date: "06 de Janeiro",
    location: "Sede Moçambique Estrela Guia",
    cover: "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=2000",
    description: "O Terno de Moçambique Estrela Guia celebra a tradicional Folia de Reis com um grande cortejo musical que percorre as ruas do bairro. Com fardas impecáveis, caixas e gungas soando em uníssono, a comunidade entoa orações e cantos de louvor, preservando e compartilhando esta valiosa devoção secular de geração em geração.",
    galleryId: 1
  },
  {
    id: 2,
    title: "Festa Junina do Moçambique",
    date: "21 de Junho",
    location: "Quartel Estrela Guia",
    cover: "https://i.postimg.cc/XJCdncH7/3075998a-3aae-4468-9018-de160d328055.jpg",
    description: `🔥 VEM AÍ A FESTA JUNINA DO MOÇAMBIQUE ESTRELA GUIA! 🌽🔥

Prepare o traje caipira e venha viver uma tarde inesquecível de muita alegria, música e tradição! 🤠🎶

🎤 Atrações Confirmadas:
* Carvalho & Mariano
* Grupo Quinteto do Samba
* Alberto & Cristiano

✨ E ainda teremos:
🎊 Quadrilha
🌽 Comidas Típicas
🍹 Bebidas
🎯 Bingo

📅 21 de Junho — Domingo
⏰ A partir das 12H
📍 Rua do Dólar, 290 — São Jorge
📌 Quartel Moçambique Estrela Guia

🎟️ Entrada: 1KG de alimento não perecível

❤️ Sua solidariedade faz a festa acontecer!
Chame a família, os amigos e venha festejar com a gente! 🌻🔥`,
    galleryId: 7
  },
  {
    id: 3,
    title: "Rodas Culturais de Capoeira",
    date: "Finais de Semana",
    location: "Ponto de Cultura Estrela Guia",
    cover: "https://i.postimg.cc/BQ6s5pQ4/Whats-App-Image-2026-05-12-at-09-18-41-3.jpg",
    description: "Encontros semanais dedicados à transmissão da capoeira como expressão legítima de resistência física e cultural. Unindo técnicas corporais, canto coletivo e compasso instrumental (berimbau, pandeiro, atabaque), fortalecemos o vínculo social e identitário.",
    galleryId: 6
  },
  {
    id: 4,
    title: "Fotos dos eventos realizados – Instrumento nº 977307",
    modalidade: "Execução do Projeto / Registro Fotográfico",
    date: "Instrumento nº 977307",
    location: "Sede Moçambique Estrela Guia",
    cover: "https://lh3.googleusercontent.com/d/1zCjw-1WNKZUeplKMDh435YmJEVT9GGLj=w1000",
    description: "Registros fotográficos das atividades culturais realizadas no âmbito do projeto, para comprovação da execução física e transparência das ações vinculadas ao Instrumento nº 977307.",
    galleryId: 8
  },
  {
    id: 5,
    title: "Pagode com Feijoada",
    modalidade: "Confraternização / Gastronomia e Samba",
    date: "Confraternização Cultural",
    location: "Quartel Moçambique Estrela Guia — Rua do Dólar, 290, São Jorge",
    cover: "https://lh3.googleusercontent.com/d/19FyHebMAZby1r41fRaVMN37hGVd-txuU=w1000",
    description: "Tradicional Pagode com Feijoada no Quartel do Moçambique Estrela Guia. Um encontro festivo e comunitário recheado de samba, gastronomia típica e celebração cultural, fortalecendo a união dos moradores e amigos do Terno.",
    galleryId: 9
  }
];

const ShowsEventosPage = ({ 
  onBack, 
  onOpenGallery 
}: { 
  onBack: () => void; 
  onOpenGallery: (id: number) => void;
  key?: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-16 md:py-28 px-6 bg-[#030303] min-h-screen text-white font-sans"
    >
      <div className="max-w-7xl mx-auto">
        {/* Voltar bar */}
        <div className="flex justify-between items-center mb-16">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors group bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </button>
          <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest leading-none">Estrela Guia / Shows e Eventos</span>
        </div>

        {/* Heading */}
        <div className="flex items-center gap-6 mb-24">
          <div className="w-2.5 h-20 bg-primary rounded-full shadow-[0_0_20px_rgba(255,165,0,0.5)]" />
          <div>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Programações e Vivências</span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-none">Shows e Eventos</h1>
          </div>
        </div>

        {/* Dynamic alternating events list */}
        <div className="space-y-36">
          {eventsData.map((event, index) => {
            const isEven = index % 2 === 0;
            const hasGallery = !!event.galleryId;
            const targetGallery = hasGallery ? galleries.find(g => g.id === event.galleryId) : null;

            return (
              <div 
                key={event.id}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center`}
              >
                {/* Photo area */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-1/2 group"
                >
                  <div 
                    onClick={() => {
                      if (event.galleryId) {
                        onOpenGallery(event.galleryId);
                      }
                    }}
                    className={`relative overflow-hidden aspect-[4/3] rounded-[2.5rem] border border-white/10 bg-black shadow-3xl select-none ${hasGallery ? "cursor-pointer group" : "cursor-default"}`}
                  >
                    <img 
                      src={event.cover} 
                      alt={event.title}
                      className={`w-full h-full object-cover grayscale brightness-75 transition-all duration-700 ${hasGallery ? "group-hover:grayscale-0 group-hover:brightness-95 group-hover:scale-105" : ""}`} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent opacity-60" />
                    
                    {/* Pulsing visual helper */}
                    {hasGallery ? (
                      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#FFA500]/90 flex items-center gap-2 group-hover:bg-primary group-hover:text-black transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#FFA500] animate-pulse group-hover:bg-black" />
                        Ver Galeria ({targetGallery?.images.length || 0})
                      </div>
                    ) : (
                      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        Fotos em breve
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Text area */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className="w-full lg:w-1/2 flex flex-col justify-center space-y-6"
                >
                  {/* Category / Modalidade tags */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {event.modalidade && (
                      <span className="text-amber-400 bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {event.modalidade}
                      </span>
                    )}
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full inline-block">
                      {event.date}
                    </span>
                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      {event.location}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-white transition-colors">
                    {event.title}
                  </h2>

                  <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line">
                    {event.description}
                  </p>

                  <div className="pt-4">
                    {hasGallery && event.galleryId ? (
                      <button 
                        onClick={() => onOpenGallery(event.galleryId!)}
                        className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-primary hover:text-black hover:border-transparent px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-primary transition-colors cursor-pointer"
                      >
                        <span>Explorar Registros ({targetGallery?.images.length || 0} Fotos/Mídias)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2.5 text-white/30 text-xs font-bold uppercase tracking-widest px-6 py-3 border border-white/5 rounded-full bg-white/[0.01]">
                        Novidade e fotos em breve
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner bottom */}
        <div className="mt-40 p-12 md:p-16 rounded-[3rem] bg-linear-to-br from-primary/5 to-transparent border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-white">Prefere apoiar nossas programações?</h3>
            <p className="text-white/40 text-sm max-w-xl font-medium">
              O Terno Estrela Guia depende de apoios solidários espontâneos para manter as fardas bem cuidadas, organizar os mastros de santos e alimentar toda a comunidade nos dias festivos.
            </p>
          </div>
          <button 
            onClick={() => {
              const donateBtn = document.getElementById("floating-donation-btn");
              if (donateBtn) donateBtn.click();
            }}
            className="bg-primary hover:bg-orange-600 text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/10 hover:shadow-primary/30 shrink-0"
          >
            Quero Contribuir
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Reusable Global Lightbox Modal ---
const VIDEO_DRIVE_IDS = [
  "1fb0XTgYjm6Q8lwbk_TnTfBR6SeUeodtq",
  "1RGESiFfQyjzIbPecuAF_mpA68UruO3g0",
  "14DVFafrB9xmJuCHDZciQrZ6ziHa1djPu",
  "15gvlxD_yTIt-4_N2Uyn3fX9T8pgBlQOW",
  "1HrFus24gjej45p0Yd2DO1nEQuXokJg74",
  "1fFdYOU7k51sSlQ6s1QeyicwZdIfG0Eiy",
  "1EgHuTTvIF_KBdNyPsCRqpIY3kMWgubcg",
  "1HEJrcS-3P2HCMT5Bshxgf91pOoKzMv-X",
  "1AXgQv4zoMt-P95xEH9nb48pP2o6luquB",
  "1aSVAubaZXvhY9I3H_YPVOW-RgL1Vq1Bv",
  "1lncWWJ-Fcd17v7xAJmEz1Suwgj6ddn3G"
];

const isVideoUrl = (url: string) => {
  if (url.endsWith(".mp4") || url.includes(".mp4") || url.includes("/video/")) return true;
  return VIDEO_DRIVE_IDS.some(id => url.includes(id));
};

const isHorizontalVideo = (url: string) => {
  return url.includes("1fFdYOU7k51sSlQ6s1QeyicwZdIfG0Eiy") || url.includes("horizontal");
};

const getMediaDisplayUrl = (url: string) => {
  if (isVideoUrl(url)) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  }
  
  // Format Google Drive photo URLs directly to crisp direct CDN images
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFile[1]}=w1600`;
  }
  const matchThumb = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchThumb && matchThumb[1]) {
    return `https://lh3.googleusercontent.com/d/${matchThumb[1]}=w1600`;
  }
  return url;
};

const LightboxModal = ({ 
  selectedGalleryId, 
  onClose 
}: { 
  selectedGalleryId: number | null; 
  onClose: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Whenever selectedGalleryId changes, reset image index
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedGalleryId]);

  if (selectedGalleryId === null) return null;

  const activeGallery = galleries.find(g => g.id === selectedGalleryId);
  if (!activeGallery) return null;

  const currentRawUrl = activeGallery.images[currentImageIndex];
  const displayUrl = getMediaDisplayUrl(currentRawUrl);
  const isVideo = isVideoUrl(currentRawUrl);

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estrela-guia-galeria-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % activeGallery.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + activeGallery.images.length) % activeGallery.images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[160] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <div 
          className="event-modal-container relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-5 flex flex-col items-stretch justify-center gap-2.5 my-auto max-h-[94vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER BAR - Compact title & details */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10 shrink-0">
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                  {activeGallery.date}
                </span>
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">{activeGallery.location}</span>
                </span>
                {isVideo ? (
                  <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Video className="w-3 h-3 shrink-0" /> Vídeo
                  </span>
                ) : (
                  <span className="bg-white/10 text-white/70 border border-white/5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    Foto
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight truncate">
                {activeGallery.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 border border-white/10 rounded-xl text-white bg-white/5 hover:bg-primary hover:text-black transition-colors cursor-pointer"
                onClick={() => {
                  if (isVideo) {
                    window.open(currentRawUrl, '_blank');
                  } else {
                    handleDownload(displayUrl);
                  }
                }}
                title={isVideo ? "Abrir no Google Drive" : "Download Imagem"}
              >
                {isVideo ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 border border-white/10 rounded-xl text-white bg-white/5 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={onClose}
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Event description textual content */}
          {activeGallery.description && (
            <p className="text-white/70 text-xs leading-relaxed line-clamp-2 shrink-0">
              {activeGallery.description}
            </p>
          )}

          {/* CENTER MEDIA DISPLAY CONTAINER - Fixed max height carousel to avoid vertical empty space */}
          <div className="carousel relative w-full flex items-center justify-center bg-black/90 rounded-2xl border border-white/5 overflow-hidden group h-[300px] max-h-[300px] shrink">
            {/* Prev/Next Navigation Overlay */}
            {activeGallery.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2.5 z-30 p-2 text-white hover:text-primary bg-black/75 hover:bg-black/95 rounded-full border border-white/10 transition-all backdrop-blur-md shadow-lg cursor-pointer"
                  title="Anterior"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2.5 z-30 p-2 text-white hover:text-primary bg-black/75 hover:bg-black/95 rounded-full border border-white/10 transition-all backdrop-blur-md shadow-lg cursor-pointer"
                  title="Próximo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex items-center justify-center p-1"
              >
                {isVideo ? (
                  <div className={
                    isHorizontalVideo(currentRawUrl)
                      ? "relative w-full max-w-[720px] aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center max-h-[280px]"
                      : "relative h-full max-h-[280px] aspect-[9/16] rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center"
                  }>
                    <iframe
                      src={displayUrl}
                      className="w-full h-full border-0 absolute inset-0 object-contain"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={displayUrl}
                    alt={`Foto ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[285px] h-full object-contain rounded-xl shadow-xl"
                    style={{ objectFit: 'contain' }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "true";
                        const match = currentRawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                        if (match && match[1]) {
                          target.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
                        }
                      }
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM PASSADOR DE IMAGEM (PAGINATION & CONTROLS) - Directly below media */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs shrink-0">
            <div className="text-white/60 font-mono text-[11px] font-bold uppercase tracking-wider">
              Item <span className="text-primary font-black">{currentImageIndex + 1}</span> de <span className="text-white">{activeGallery.images.length}</span>
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5 max-w-[60vw] overflow-x-auto py-0.5 px-2 no-scrollbar">
              {activeGallery.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-1.5 transition-all duration-300 rounded-full shrink-0 cursor-pointer ${
                    i === currentImageIndex 
                      ? "w-6 bg-primary shadow-[0_0_10px_rgba(255,165,0,0.5)]" 
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Quick Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevImage}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={nextImage}
                className="px-3 py-1.5 rounded-xl bg-primary text-black hover:bg-amber-400 font-black uppercase text-[10px] tracking-wider transition-colors shadow-md cursor-pointer"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Page ---

export default function EstrelaGuiaSite() {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isImpactReportOpen, setIsImpactReportOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<{ url: string; title: string; docId?: string } | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "transparency" | "shows">("home");
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);

  const [docs, setDocs] = useState<TransparencyDoc[]>(() => {
    const saved = localStorage.getItem("estrela_guia_documents_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasOficio = parsed.some(d => 
            d.id === "oficio-332" || 
            d.id === "emenda-parlamentar" || 
            d.id === "oficio" ||
            d.name.toLowerCase().includes("332") || 
            d.name.toLowerCase().includes("emenda")
          );

          const updated = parsed.map(d => {
            if (
              d.id === "oficio-332" || 
              d.id === "emenda-parlamentar" || 
              d.id === "oficio" ||
              d.name.toLowerCase().includes("332") || 
              d.name.toLowerCase().includes("emenda")
            ) {
              return {
                ...d,
                id: "oficio-332",
                name: "OFÍCIO Nº 332/2026 - EMENDA PARLAMENTAR 2026",
                link: "/SEI_3158555_Oficio_332.pdf",
                backupLink: "https://drive.google.com/file/d/1wgwjiPAtaazA_-AsTgjznhci819qMMka/view?usp=sharing",
                desc: "",
                tag: "Ofício SEI • MinC"
              };
            }
            return d;
          });

          if (!hasOficio) {
            return [DEFAULT_DOCUMENTS[0], ...updated];
          }
          return updated;
        }
      } catch (e) {}
    }
    return DEFAULT_DOCUMENTS;
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isDocManagerOpen, setIsDocManagerOpen] = useState(false);

  const handleSaveDocs = (newDocs: TransparencyDoc[]) => {
    setDocs(newDocs);
    localStorage.setItem("estrela_guia_documents_config", JSON.stringify(newDocs));
  };

  const handleResetDocs = () => {
    setDocs(DEFAULT_DOCUMENTS);
    localStorage.removeItem("estrela_guia_documents_config");
  };

  const openPdf = (url: string, title: string, docId?: string) => {
    setActivePdf({ url, title, docId });
  };

  const handleOpenTransparency = () => {
    setCurrentView("transparency");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen selection:bg-primary selection:text-black">
      <TopBar />
      <Navbar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onOpenDonation={() => setIsDonationOpen(true)} 
      />
      <main>
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onOpenDocuments={handleOpenTransparency} 
                onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
              />
              <Features />
              <AboutSection onOpenImpactReport={() => setIsImpactReportOpen(true)} />
              <CounterSection />
              <ProjectsSection />
              <VideoSection />
              <UpcomingEventsSection />
              <Gallery onOpenGallery={(id) => setSelectedGalleryId(id)} />
              <Agenda />
              <Interactivity onOpenComments={() => setIsCommentsOpen(true)} />
              <TeamSection />
              <ManagementRecords />
              <CTA />
            </motion.div>
          )}

          {currentView === "transparency" && (
            <TransparencyPortal 
              key="transparency" 
              docs={docs} 
              onBack={() => setCurrentView("home")} 
              onViewPdf={openPdf}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            />
          )}

          {currentView === "shows" && (
            <ShowsEventosPage key="shows" onBack={() => setCurrentView("home")} onOpenGallery={(id) => setSelectedGalleryId(id)} />
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingDonationButton onOpen={() => setIsDonationOpen(true)} />
      <CommentModal isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <ImpactReportModal 
        isOpen={isImpactReportOpen} 
        onClose={() => setIsImpactReportOpen(false)} 
      />
      <PdfViewerModal 
        isOpen={!!activePdf} 
        onClose={() => setActivePdf(null)} 
        url={activePdf?.url || ""} 
        title={activePdf?.title || ""} 
        docId={activePdf?.docId}
      />
      <LightboxModal 
        selectedGalleryId={selectedGalleryId} 
        onClose={() => setSelectedGalleryId(null)} 
      />
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsDocManagerOpen(true);
        }}
      />
      <DocumentManagerModal
        isOpen={isDocManagerOpen}
        onClose={() => setIsDocManagerOpen(false)}
        docs={docs}
        onSaveDocs={handleSaveDocs}
        onResetDocs={handleResetDocs}
      />
    </div>
  );
}
