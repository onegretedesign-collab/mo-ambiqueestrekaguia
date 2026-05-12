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

const TopBar = () => {
  return (
    <div className="hidden lg:block bg-black py-2 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-bold">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> Uberlândia, MG - Brasil</span>
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-black text-2xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">E</div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl leading-none uppercase">Estrela Guia</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] leading-normal">Moçambique</span>
          </div>
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

const Hero = ({ onOpenDonation }: { onOpenDonation: () => void }) => {
  return (
    <section id="início" className="relative h-[90vh] flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000" 
          className="w-full h-full object-cover opacity-40 grayscale"
          alt="Hero background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
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
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] text-white">
            AJUDE A <span className="text-primary">PRESERVAR</span> NOSSA HISTÓRIA
          </h1>
          <p className="text-xl text-white/50 mb-10 font-light leading-relaxed max-w-xl">
            O Terno de Moçambique Estrela Guia une tradição africana e impacto social. Sua contribuição mantém o Congado vivo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onOpenDonation}
              className="bg-primary hover:bg-orange-600 text-black px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-primary/20"
            >
              Doar Agora
            </button>
            <a href="#sobre-nós" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center">
              Quem Somos
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-28 right-0 w-1/3 h-24 bg-primary hidden xl:flex items-center justify-center gap-8 px-12 z-10"
      >
        <div className="text-black">
          <span className="block text-3xl font-black">2026</span>
          <span className="text-[10px] uppercase font-bold">Agenda Aberta</span>
        </div>
        <div className="w-px h-10 bg-black/20" />
        <div className="text-black flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold leading-tight">Membros<br/>Ativos</span>
          <span className="text-3xl font-black">80+</span>
        </div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  const pillars = [
    { title: "Educação", desc: "Oficinas de percussão e ritos para jovens.", icon: <Music className="w-8 h-8" /> },
    { title: "Assistência", desc: "Apoio alimentar e social a famílias da região.", icon: <Heart className="w-8 h-8" /> },
    { title: "Patrimônio", desc: "Preservação de instrumentos e trajes históricos.", icon: <Shield className="w-8 h-8" /> }
  ];

  return (
    <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
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

const AboutSection = () => {
  return (
    <section id="sobre-nós" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden border-2 border-primary/20 aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1523301343968-3e421cd79a95?q=80&w=1000" 
              alt="Sobre" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-20" />
          <div className="absolute -top-10 -left-10 w-32 h-32 border-t-4 border-l-4 border-primary/40 rounded-tl-[3rem]" />
          
          <div className="absolute -bottom-6 -left-6 bg-black p-8 rounded-3xl border border-white/5 shadow-2xl scale-90 sm:scale-100">
            <span className="block text-5xl font-black text-primary">24</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Anos de Fundação</span>
          </div>
        </div>

        <div>
           <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Quem Somos</span>
           <h2 className="text-5xl font-black mb-8 leading-tight">MAIS QUE UMA ONG,<br/>UMA <span className="text-primary italic">MISSÃO</span> CULTURAL.</h2>
           <p className="text-lg text-white/50 leading-relaxed mb-8">
             Fundada por Malaquias Preto, nossa organização atua como guardiã das tradições afro-brasileiras. Através do Terno de Moçambique Estrela Guia, transformamos a realidade de crianças e adolescentes em Uberlândia, oferecendo um espaço de fé, música e cidadania.
           </p>
           <ul className="space-y-4 mb-10">
             {["Fomento à Cultura Popular", "Combate ao Racismo Estrutural", "Segurança Alimentar Comunitária"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </div>
                  {item}
                </li>
             ))}
           </ul>
           <button className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-xs group">
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
      title: "Oficinas de Toque", 
      desc: "Ensino gratuito de instrumentos tradicionais: Patangome e Gunga.",
      image: "https://images.unsplash.com/photo-1514525253344-f814d07295bf?q=80&w=800"
    },
    { 
      title: "Mãos Amigas", 
      desc: "Distribuição mensal de cestas básicas e material escolar.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800"
    },
    { 
      title: "Voz da Memória", 
      desc: "Projeto de documentação oral das histórias dos mestres do Congado.",
      image: "https://images.unsplash.com/photo-1542601906960-daaa2303c990?q=80&w=800"
    }
  ];

  return (
    <section id="projetos" className="py-32 px-6 bg-[#030303]">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Nossas Causas</span>
        <h2 className="text-6xl font-black mb-6">PROJETOS EM DESTAQUE</h2>
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
              <div className="absolute bottom-10 left-10 right-10">
                 <h3 className="text-3xl font-black mb-3">{p.title}</h3>
                 <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2">{p.desc}</p>
                 <button className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group/btn">
                   Saiba Mais <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-2 transition-transform" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CounterSection = () => {
  const stats = [
    { label: "Membros", value: "85" },
    { label: "Projetos", value: "12" },
    { label: "Voluntários", value: "150" },
    { label: "Vidas Impactadas", value: "1.2k" }
  ];

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="grid grid-cols-6 h-full">
           {[...Array(6)].map((_, i) => <div key={i} className="border-r border-black" />)}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <div key={i} className="text-center text-black">
            <span className="block text-6xl font-black mb-2">{s.value}</span>
            <span className="text-xs font-black uppercase tracking-widest opacity-60">{s.label}</span>
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
        <div className="flex flex-wrap justify-center gap-6">
          <button className="bg-primary text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all">
            Fazer Doação Única
          </button>
          <button className="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
            Ser Doador Mensal
          </button>
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

  useEffect(() => {
    const unsubscribe = subscribeToEvents((fetchedEvents) => {
      if (fetchedEvents.length > 0) {
        setEvents(fetchedEvents);
      }
    });
    return () => unsubscribe();
  }, []);

  const displayEvents = events.length > 0 ? events : initialEvents;

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
      { name: "Malaquias Preto", role: "Capitão Fundador", bio: "Idealista e mestre dos ritos, conduz o Estrela Guia com sabedoria há duas décadas." },
      { name: "Direção de Projetos", role: "Gestão Estratégica", bio: "Responsável pela ponte entre a tradição e as ações sociais e editais." },
      { name: "Comunicação", role: "Relações Externas", bio: "Garante que nossa voz chegue à sociedade e novos parceiros." }
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
                  <div className="w-full h-full bg-linear-to-br from-white/10 to-transparent flex items-center justify-center">
                     <Users className="w-16 h-16 text-white/10 group-hover:text-primary transition-colors" />
                  </div>
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
          <h2 className="text-4xl font-bold">Registros de Gestão</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-12 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-bold mb-4">Transparência</h3>
            <p className="text-white/40">Relatórios de atividades disponibilizados para todos os membros e parceiros.</p>
          </div>
          <div className="p-12 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-bold mb-4">Histórico</h3>
            <p className="text-white/40">Arquivo digital de todas as ações sociais desde a nossa fundação.</p>
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

// --- Main Page ---

export default function EstrelaGuiaSite() {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen selection:bg-primary selection:text-black">
      <TopBar />
      <Navbar onOpenDonation={() => setIsDonationOpen(true)} />
      <main>
        <Hero onOpenDonation={() => setIsDonationOpen(true)} />
        <Features />
        <AboutSection />
        <CounterSection />
        <ProjectsSection />
        <VideoSection />
        <Gallery />
        <Agenda />
        <Interactivity onOpenComments={() => setIsCommentsOpen(true)} />
        <TeamSection />
        <ManagementRecords />
        <CTA />
      </main>
      <Footer />
      <CommentModal isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </div>
  );
}
