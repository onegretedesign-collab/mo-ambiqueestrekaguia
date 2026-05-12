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
  X
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
          <p className="text-white/40 max-w-2xl leading-relaxed">
            Acesso público aos documentos oficiais, estatutos e relatórios de atividades da nossa organização. Compromisso real com a comunidade e nossos apoiadores.
          </p>
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
          <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          <a href="#" className="hover:text-primary transition-colors">Youtube</a>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ onOpenDonation }: { onOpenDonation: () => void }) => {
  return (
    <nav className="sticky top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-display font-black text-lg md:text-xl uppercase text-white tracking-tight">
            Moçambique Estrela Guia
          </span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {["Início", "Sobre Nós", "Projetos", "Agenda", "Galeria"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(" ", "-")}`} 
              className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
          <button 
            onClick={onOpenDonation}
            className="bg-primary hover:bg-orange-600 text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/10 hover:shadow-primary/30 active:scale-95"
          >
            Doar Agora
          </button>
        </div>
      </div>
    </nav>
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
          <h1 className="text-lg md:text-2xl font-black mb-4 leading-tight text-white whitespace-nowrap">
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
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden border-2 border-primary/20 aspect-square">
            <img 
              src="https://i.postimg.cc/Dws1wQsM/LOGO-PONTO-DE-CULTURA-MOC-AMBIQUE-ESTRELA-GUIA.png" 
              alt="Logo Ponto de Cultura" 
              className="w-full h-full object-contain p-8 bg-white/5"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-20" />
          <div className="absolute -top-10 -left-10 w-32 h-32 border-t-4 border-l-4 border-primary/40 rounded-tl-[3rem]" />
          
          <div className="absolute -bottom-6 -left-6 bg-black p-8 rounded-3xl border border-white/5 shadow-2xl scale-90 sm:scale-100">
            <span className="block text-5xl font-black text-primary text-center">2002</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block text-center">Ano de Fundação</span>
          </div>
        </div>

        <div>
           <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Quem Somos</span>
           <h2 className="text-5xl font-black mb-8 leading-tight uppercase">História e Resistência</h2>
           <p className="text-xl text-white font-light leading-relaxed mb-8 border-l-4 border-primary pl-6">
             "Fundado em 2002 no bairro São Jorge, preservamos a tradição do Congado e transformamos vidas através da cultura e inclusão social."
           </p>
           <p className="text-sm text-white/40 leading-relaxed mb-8">
             Fundada em 2002 por <span className="inline-flex items-center gap-2 bg-white/5 pr-4 pl-1 py-1 rounded-full border border-white/10 mx-1 align-middle"><img src="https://i.postimg.cc/RVhnhWqj/CAPITAO-MALAQUIAS-FOTO.png" className="w-8 h-8 rounded-full object-cover" alt="Malaquias Preto" referrerPolicy="no-referrer" /><span className="text-white font-bold">Malaquias Preto</span></span> e sua esposa <span className="text-white font-bold">Iara Aparecida Ferreira (Madrinha Iara)</span>, nossa organização atua como guardiã das tradições e promotora da dignidade humana.
           </p>
           <ul className="grid grid-cols-2 gap-4 mb-10">
             {["Cultura", "Esporte", "Educação", "Social"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </div>
                  {item}
                </li>
             ))}
           </ul>
           <button 
            onClick={onOpenImpactReport}
            className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-xs group"
           >
             Ver Relatório de Impacto <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-black transition-all"><ChevronRight className="w-4 h-4" /></div>
           </button>
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
      desc: "Dança (Afro/Street), Percussão, Artesanato, Grafite, Culinária, Zumba, Balé, Cavaco, Violão, Barbeiro e Contação de História.",
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
            { label: "Histórias", icon: "📚" }
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-3 block">{s.label}</span>
            <span className="block text-6xl md:text-8xl font-black tracking-tighter leading-none">{s.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const VideoSection = () => {
  return (
    <section className="py-40 relative flex items-center justify-center overflow-hidden">
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
        
        <div className="overflow-x-auto rounded-3xl border border-white/5 shadow-2xl">
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
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1547427845-12ca7a659779?q=80&w=1000",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000",
    "https://images.unsplash.com/photo-1542601906960-daaa2303c990?q=80&w=1000",
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000",
    "https://images.unsplash.com/photo-1514525253344-f814d07295bf?q=80&w=1000"
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="galeria" className="py-24 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-2 h-12 bg-primary rounded-full" />
          <h2 className="text-4xl font-bold uppercase tracking-tight font-display">Galeria de Ações</h2>
        </div>
        <p className="text-white/40 mb-12 font-medium">Clique nas imagens para ampliar e ver detalhes das nossas atividades.</p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 h-[600px]"
        >
          {images.map((img, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ flex: i === 2 ? 1.5 : 1.3 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setSelectedImage(img)}
              className={`relative overflow-hidden rounded-[2rem] border border-white/10 flex-1 h-full cursor-pointer group shadow-2xl`}
            >
              <motion.img 
                src={img} 
                alt="Galeria" 
                initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                whileHover={{ scale: 1, filter: "grayscale(0%)" }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 contrast-125 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[10px] uppercase font-black tracking-widest text-primary">Estrela Guia 2026</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-6 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-10 right-10 p-4 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={selectedImage}
              alt="Ampliado"
              className="max-w-full max-h-full rounded-3xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
      { name: "Direção Coletiva", role: "Gestão Estratégica", bio: "Responsável pela ponte entre a tradição e as ações sociais, editais e parcerias externas." }
    ];
  
    return (
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-2 h-12 bg-primary rounded-full" />
            <h2 className="text-4xl font-bold font-display uppercase tracking-widest">Equipe Diretiva</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
            <div>
              <span className="block font-black text-white">PIX (CNPJ)</span>
              <span className="text-xs text-white/40">12.345.678/0001-90</span>
            </div>
            <button className="text-primary font-bold text-xs uppercase tracking-widest group-hover:underline">Copiar</button>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <span className="block font-black text-white mb-2">Transferência Bancária</span>
            <div className="text-xs text-white/40 space-y-1">
              <p>Banco do Brasil</p>
              <p>Agência: 1234-5</p>
              <p>Conta: 67890-X</p>
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
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-black text-black text-xl">E</div>
              <span className="font-display font-black text-xl tracking-tighter uppercase">Estrela Guia</span>
            </div>
            <p className="text-white/40 leading-relaxed italic">"Resistência que canta, fé que guia. Patrimônio imaterial de Uberlândia."</p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Contatos</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <Globe className="w-5 h-5 text-primary" /> estrelaguia.org
              </a>
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5 text-primary" /> @moçambiqueestrelaguia
              </a>
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <MapPin className="w-5 h-5 text-primary" /> Rua do Dólar, 290 - Bairro São Jorge, Uberlândia-MG
              </a>
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
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

// --- Main Page ---

export default function EstrelaGuiaSite() {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isImpactReportOpen, setIsImpactReportOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "transparency">("home");

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
      <Navbar onOpenDonation={() => setIsDonationOpen(true)} />
      <main>
        <AnimatePresence mode="wait">
          {currentView === "home" ? (
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
              <Gallery />
              <Agenda />
              <Interactivity onOpenComments={() => setIsCommentsOpen(true)} />
              <TeamSection />
              <ManagementRecords />
              <CTA />
            </motion.div>
          ) : (
            <TransparencyPortal key="transparency" onBack={() => setCurrentView("home")} onViewPdf={openPdf} />
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
    </div>
  );
}
