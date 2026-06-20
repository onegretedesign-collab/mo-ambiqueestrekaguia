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
  ExternalLink
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { subscribeToComments, addComment, type Comment } from "../services/commentService";
import { subscribeToEvents, type Event } from "../services/eventService";

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

const PdfViewerModal = ({ isOpen, onClose, url, title }: { isOpen: boolean; onClose: () => void; url: string; title: string }) => {
  if (!isOpen) return null;

  // Normalize Google Drive links for iframe display
  const displayUrl = url.includes('drive.google.com') && url.includes('/view') 
    ? url.replace('/view', '/preview') 
    : url;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-full max-w-5xl bg-[#111] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <span className="text-sm font-black uppercase tracking-widest text-white/80">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={url} 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-primary"
              title="Abrir em Nova Aba"
            >
              <Download className="w-5 h-5" />
            </a>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white">
          <iframe 
            src={displayUrl.includes('drive.google.com') ? displayUrl : `${displayUrl}#toolbar=0`} 
            className="w-full h-full"
            title={title}
          />
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
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
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

const TransparencyPortal = ({ onBack, onViewPdf }: { onBack: () => void; onViewPdf: (url: string, title: string) => void; key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-32 pb-20 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-12 hover:gap-4 transition-all"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para o Início
        </button>

        <div className="mb-20">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Institucional</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-none uppercase">Portal da<br/><span className="text-primary italic">Transparência</span></h1>
          <p className="text-white/40 max-w-2xl leading-relaxed mb-6">
            Acesso público aos documentos oficiais, estatutos e relatórios de atividades da nossa organização. Compromisso real com a comunidade e nossos apoiadores.
          </p>
          <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">Entidade Mantenedora:</p>
            <p className="text-sm text-white font-bold">Terno Moçambique Estrela Guia</p>
            <p className="text-xs text-white/40 mt-1 font-mono">CNPJ: 06.207.190/0001-07</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Estatuto Social", link: "https://drive.google.com/file/d/1Za_dweUtnxDlr0elU2uA0e5z8u-ftskq/view?usp=sharing", desc: "Regimento interno e diretrizes" },
            { name: "Relatório de Atividades", link: "/relatorio.pdf", desc: "Resumo anual de ações" },
            { name: "Ata de Eleição", link: "/transparencia.pdf", desc: "Composição da diretoria" },
            { name: "Cartão CNPJ", link: "/cnpj.pdf", desc: "Identificação Jurídica" },
            { name: "Certidões Negativas", link: "/certidoes.pdf", desc: "Regularidade Fiscal" },
            { name: "Transparência", link: "https://drive.google.com/file/d/1Z-Iod8dLGchF58aHlqThavU3RgMfQgO3/view?usp=sharing", desc: "Ações planejadas para o ano" }
          ].map((doc, i) => (
            <motion.button 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onViewPdf(doc.link, doc.name)}
              className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary transition-all text-left overflow-hidden min-h-[200px] flex flex-col justify-between"
            >
               <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="w-6 h-6 text-primary" />
               </div>
               
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-lg">
                 <FileText className="w-7 h-7" />
               </div>

               <div>
                 <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors mb-2 uppercase tracking-tight">{doc.name}</h3>
                 <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">{doc.desc}</p>
               </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 text-center">
          <p className="text-white/20 text-xs uppercase tracking-widest font-bold">
            Dúvidas sobre nossa gestão? Entre em contato pelo e-mail <span className="text-primary">contato@estrelaguia.org</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TopBar = () => {
  return (
    <div className="hidden lg:block bg-black py-2 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-bold">
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
      const sections = ["início", "sobre-nós", "projetos", "agenda", "galeria"];
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
      <nav className="sticky top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={(e) => { handleItemClick(e, menuItems[0]); }}>
            <span className="font-display font-black text-lg md:text-xl uppercase text-white tracking-tight hover:text-primary transition-colors">
              Moçambique Estrela Guia
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                onClick={(e) => handleItemClick(e, item)}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isItemActive(item) ? "text-primary" : "text-white/70 hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            ))}
            <button 
              onClick={onOpenDonation}
              className="bg-primary hover:bg-orange-600 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/10 hover:shadow-primary/30 active:scale-95 animate-pulse"
            >
              Doar Agora
            </button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-white/70 hover:text-primary transition-colors"
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

const Hero = ({ onOpenDocuments }: { onOpenDocuments: () => void }) => {
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
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onOpenDocuments}
              className="bg-primary hover:bg-orange-600 text-black px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-primary/20"
            >
              PORTAL DA TRANSPARÊNCIA
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
      "https://drive.google.com/file/d/1fb0XTgYjm6Q8lwbk_TnTfBR6SeUeodtq/view?usp=sharing",
      "https://drive.google.com/file/d/1RGESiFfQyjzIbPecuAF_mpA68UruO3g0/view?usp=sharing",
      "https://drive.google.com/file/d/14DVFafrB9xmJuCHDZciQrZ6ziHa1djPu/view?usp=sharing",
      "https://drive.google.com/file/d/15gvlxD_yTIt-4_N2Uyn3fX9T8pgBlQOW/view?usp=sharing",
      "https://drive.google.com/file/d/1HrFus24gjej45p0Yd2DO1nEQuXokJg74/view?usp=sharing",
      "https://drive.google.com/file/d/1fFdYOU7k51sSlQ6s1QeyicwZdIfG0Eiy/view?usp=sharing"
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
  galleryId: number;
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
                      if (event.id === 2) {
                        onOpenGallery(event.galleryId);
                      }
                    }}
                    className={`relative overflow-hidden aspect-[4/3] rounded-[2.5rem] border border-white/10 bg-black shadow-3xl select-none ${event.id === 2 ? "cursor-pointer group" : "cursor-default"}`}
                  >
                    <img 
                      src={event.cover} 
                      alt={event.title}
                      className={`w-full h-full object-cover grayscale brightness-75 transition-all duration-700 ${event.id === 2 ? "group-hover:grayscale-0 group-hover:brightness-95 group-hover:scale-105" : ""}`} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent opacity-60" />
                    
                    {/* Pulsing visual helper */}
                    {event.id === 2 ? (
                      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#FFA500]/90 flex items-center gap-2 group-hover:bg-primary group-hover:text-black transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#FFA500] animate-pulse group-hover:bg-black" />
                        Ver Galeria Completa
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
                  <div className="flex items-center gap-3">
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
                    {event.id === 2 ? (
                      <button 
                        onClick={() => onOpenGallery(event.galleryId)}
                        className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-primary hover:text-black hover:border-transparent px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-primary transition-colors cursor-pointer"
                      >
                        <span>Explorar Fotos</span>
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
const isVideoUrl = (url: string) => {
  return url.includes("drive.google.com") || url.endsWith(".mp4") || url.includes("video");
};

const isHorizontalVideo = (url: string) => {
  return url.includes("1fFdYOU7k51sSlQ6s1QeyicwZdIfG0Eiy") || url.includes("horizontal");
};

const getGoogleDriveEmbedUrl = (url: string) => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
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
        className="fixed inset-0 z-[160] bg-black/98 md:backdrop-blur-3xl flex items-center justify-center"
        onClick={onClose}
      >
        <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-20 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 max-w-xs md:max-w-md">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">{activeGallery.date}</span>
          <h2 className="text-lg lg:text-2xl font-black text-white uppercase tracking-tighter truncate">{activeGallery.title}</h2>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1 mb-2">
            <MapPin className="w-3 h-3 text-primary" /> {activeGallery.location}
          </div>
          {isVideoUrl(activeGallery.images[currentImageIndex]) ? (
            <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <Video className="w-3 h-3 shrink-0" /> Vídeo do Evento
            </span>
          ) : (
            <span className="bg-white/10 text-white/70 border border-white/5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Foto do Evento
            </span>
          )}
        </div>

        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-20 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,165,0,0.2)" }}
            whileActive={{ scale: 0.9 }}
            className="p-4 border border-white/10 rounded-full text-white bg-black/40 backdrop-blur-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const url = activeGallery.images[currentImageIndex];
              if (isVideoUrl(url)) {
                window.open(url, '_blank');
              } else {
                handleDownload(url);
              }
            }}
            title={isVideoUrl(activeGallery.images[currentImageIndex]) ? "Abrir no Google Drive" : "Download Imagem"}
          >
            {isVideoUrl(activeGallery.images[currentImageIndex]) ? (
              <ExternalLink className="w-5 h-5 lg:w-6 lg:h-6" />
            ) : (
              <Download className="w-5 h-5 lg:w-6 lg:h-6" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileActive={{ scale: 0.9 }}
            className="p-4 border border-white/10 rounded-full text-white bg-black/40 backdrop-blur-md transition-colors"
            onClick={onClose}
            title="Fechar"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6" />
          </motion.button>
        </div>
        
        {/* Main interactive area */}
        <div className="relative w-full h-full flex items-center justify-center">
          <button 
            onClick={prevImage}
            className="absolute left-4 lg:left-8 p-4 text-white hover:text-primary transition-all z-35 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 lg:w-12 lg:h-12 rotate-180" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center p-4 lg:p-12"
            >
              {isVideoUrl(activeGallery.images[currentImageIndex]) ? (
                <div 
                  className={
                    isHorizontalVideo(activeGallery.images[currentImageIndex])
                      ? "relative w-[min(90vw,800px)] md:w-[min(85vw,960px)] aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_100px_rgba(255,165,0,0.2)] flex items-center justify-center"
                      : "relative w-[min(90vw,360px)] md:w-[min(85vw,420px)] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_100px_rgba(255,165,0,0.2)] flex items-center justify-center"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    src={getGoogleDriveEmbedUrl(activeGallery.images[currentImageIndex])}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={activeGallery.images[currentImageIndex]}
                  alt={`Foto ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-lg animate-fade-in"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={nextImage}
            className="absolute right-4 lg:right-8 p-4 text-white hover:text-primary transition-all z-35 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 lg:w-12 lg:h-12" />
          </button>
        </div>

        {/* Pagination overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 bg-black/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/5">
          <div className="flex gap-1.5">
            {activeGallery.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(i);
                }}
                className={`h-1 transition-all duration-500 rounded-full ${
                  i === currentImageIndex 
                    ? "w-6 bg-primary shadow-[0_0_10px_rgba(255,165,0,0.5)]" 
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
            {currentImageIndex + 1} / {activeGallery.images.length}
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
  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "transparency" | "shows">("home");
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);

  const openPdf = (url: string, title: string) => {
    setActivePdf({ url, title });
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
              <Hero onOpenDocuments={handleOpenTransparency} />
              <Features />
              <AboutSection onOpenImpactReport={() => setIsImpactReportOpen(true)} />
              <CounterSection />
              <ProjectsSection />
              <VideoSection />
              <Gallery onOpenGallery={(id) => setSelectedGalleryId(id)} />
              <Agenda />
              <Interactivity onOpenComments={() => setIsCommentsOpen(true)} />
              <TeamSection />
              <ManagementRecords />
              <CTA />
            </motion.div>
          )}

          {currentView === "transparency" && (
            <TransparencyPortal key="transparency" onBack={() => setCurrentView("home")} onViewPdf={openPdf} />
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
      />
      <LightboxModal 
        selectedGalleryId={selectedGalleryId} 
        onClose={() => setSelectedGalleryId(null)} 
      />
    </div>
  );
}
