import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  FileText, 
  Link as LinkIcon, 
  Check, 
  Upload, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink, 
  Trash2, 
  Plus, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { TransparencyDoc } from "../types/events";
import { parseDriveUrl, isDriveUrl } from "../utils/driveUtils";

interface DocumentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  docs: TransparencyDoc[];
  onSaveDocs: (docs: TransparencyDoc[]) => void;
  onResetDocs: () => void;
  initialSelectedId?: string;
}

const PRELOADED_FILES = [
  { name: "OFÍCIO Nº 332/2026 - EMENDA PARLAMENTAR 2026 (PDF Original)", path: "/SEI_3158555_Oficio_332.pdf" },
  { name: "Estatuto Social (PDF Original)", path: "/estatuto.pdf" },
  { name: "Relatório de Atividades (PDF Oficial)", path: "/relatorio.pdf" },
  { name: "Ata de Eleição e Posse (PDF Oficial)", path: "/ata-eleicao.pdf" },
  { name: "Cartão CNPJ (Receita Federal)", path: "/cnpj.pdf" },
  { name: "Certidões Negativas (Receita/PGFN)", path: "/certidoes.pdf" },
  { name: "Transparência Governamental (Gov Federal)", path: "/transparencia.pdf" }
];

export const DocumentManagerModal = ({
  isOpen,
  onClose,
  docs,
  onSaveDocs,
  onResetDocs,
  initialSelectedId
}: DocumentManagerModalProps) => {
  const [localDocs, setLocalDocs] = useState<TransparencyDoc[]>(docs);
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId || docs[0]?.id || "");
  const [showDriveTutorial, setShowDriveTutorial] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with prop when opened
  if (!isOpen) return null;

  const currentDoc = localDocs.find(d => d.id === selectedId) || localDocs[0];
  const driveInfo = currentDoc ? parseDriveUrl(currentDoc.link) : null;
  const isDrive = currentDoc ? isDriveUrl(currentDoc.link) : false;

  const handleUpdateCurrent = (updates: Partial<TransparencyDoc>) => {
    if (!currentDoc) return;
    setLocalDocs(prev => prev.map(d => d.id === currentDoc.id ? { ...d, ...updates } : d));
  };

  const handleAddDoc = () => {
    const newId = `doc-${Date.now()}`;
    const newDoc: TransparencyDoc = {
      id: newId,
      name: "Novo Documento",
      desc: "Descrição do documento oficial",
      tag: "Documento",
      link: "/estatuto.pdf",
      isCustom: true
    };
    setLocalDocs(prev => [...prev, newDoc]);
    setSelectedId(newId);
  };

  const handleDeleteCurrent = () => {
    if (!currentDoc) return;
    if (localDocs.length <= 1) return;
    const remaining = localDocs.filter(d => d.id !== currentDoc.id);
    setLocalDocs(remaining);
    setSelectedId(remaining[0].id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read local file as data URL so it can be viewed and downloaded directly
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        handleUpdateCurrent({
          link: result,
          tag: file.type.includes("pdf") ? "PDF Carregado" : "Arquivo"
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    onSaveDocs(localDocs);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm("Deseja restaurar os documentos e links originais do sistema?")) {
      onResetDocs();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-[#0E1017] rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                Gerenciar Arquivos & Links dos Botões
              </h2>
              <p className="text-xs text-white/50 font-normal">
                Configure os links do Google Drive, arquivos locais ou adicione novos botões na Transparência.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDriveTutorial(!showDriveTutorial)}
              className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Dica Google Drive</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Drive Helper Tutorial Banner */}
        <AnimatePresence>
          {showDriveTutorial && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 text-xs text-amber-200 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <p className="font-bold text-amber-300">
                    Por que links do Google Drive às vezes não abrem e como resolver:
                  </p>
                  <p className="text-amber-200/80 leading-relaxed">
                    1. <strong>Privacidade do Google:</strong> No Google Drive, você precisa clicar com o botão direito no arquivo &rarr; <strong>Compartilhar</strong> &rarr; em &ldquo;Acesso geral&rdquo; trocar de &ldquo;Restrito&rdquo; para <strong>&ldquo;Qualquer pessoa com o link&rdquo;</strong>.
                  </p>
                  <p className="text-amber-200/80 leading-relaxed">
                    2. <strong>Segurança de Iframe:</strong> O Google bloqueia que sites externos embutam seus arquivos em telas fechadas. Nosso sistema <strong>converte automaticamente</strong> seu link do Drive para permitir <strong>Download Direto</strong> e <strong>Abertura em Nova Aba</strong> sem bloqueios!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body: Left sidebar list, Right editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left list of buttons */}
          <div className="w-full md:w-80 border-r border-white/10 p-4 space-y-2 overflow-y-auto shrink-0 bg-black/40">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Botões Cadastrados ({localDocs.length})
              </span>
              <button
                onClick={handleAddDoc}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            <div className="space-y-1.5">
              {localDocs.map((doc) => {
                const isSelected = doc.id === currentDoc?.id;
                const docIsDrive = isDriveUrl(doc.link);

                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedId(doc.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-primary text-black border-primary font-bold shadow-lg shadow-primary/20"
                        : "bg-white/[0.02] border-white/5 hover:border-white/20 text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black uppercase tracking-tight truncate">
                        {doc.name}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? "text-black/70" : "text-white/40"}`}>
                        {docIsDrive ? "Google Drive" : doc.link.startsWith("data:") ? "Arquivo Carregado" : "Arquivo PDF Local"}
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      isSelected ? "bg-black/20 text-black" : "bg-white/5 text-white/50"
                    }`}>
                      {doc.tag || "PDF"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Editor Form */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0E1017]">
            {currentDoc ? (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-primary">
                      Configuração do Botão: {currentDoc.name}
                    </h3>
                    <p className="text-xs text-white/50">
                      Altere o título, texto e o link do arquivo associado.
                    </p>
                  </div>
                  {currentDoc.isCustom && (
                    <button
                      onClick={handleDeleteCurrent}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Excluir este botão"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir Botão
                    </button>
                  )}
                </div>

                {/* Name & Tag Inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      Título do Botão
                    </label>
                    <input
                      type="text"
                      value={currentDoc.name}
                      onChange={(e) => handleUpdateCurrent({ name: e.target.value })}
                      placeholder="Ex: Estatuto Social"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      Etiqueta / Badge
                    </label>
                    <input
                      type="text"
                      value={currentDoc.tag}
                      onChange={(e) => handleUpdateCurrent({ tag: e.target.value })}
                      placeholder="Ex: Estatuto • 6 Págs"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Descrição do Documento
                  </label>
                  <input
                    type="text"
                    value={currentDoc.desc}
                    onChange={(e) => handleUpdateCurrent({ desc: e.target.value })}
                    placeholder="Ex: Resumo institucional e diretrizes"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium focus:border-primary focus:outline-none"
                  />
                </div>

                {/* File Link Configuration Section */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-primary" /> Link do Arquivo (Google Drive, URL ou PDF)
                    </label>
                    {isDrive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Link do Google Drive
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={currentDoc.link}
                    onChange={(e) => handleUpdateCurrent({ link: e.target.value })}
                    placeholder="Cole aqui o link do Google Drive (ex: https://drive.google.com/file/d/...)"
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                  />

                  {/* Google Drive Status & Preview Feedback */}
                  {driveInfo ? (
                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs">
                        <Check className="w-4 h-4" /> ID do Google Drive reconhecido: <span className="font-mono text-[11px] text-white/80">{driveInfo.id}</span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        O sistema configurou automaticamente os links de download direto e visualização segura para este botão.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a
                          href={driveInfo.viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-bold"
                        >
                          <ExternalLink className="w-3 h-3" /> Testar no Google Drive
                        </a>
                        <span className="text-white/20">•</span>
                        <a
                          href={driveInfo.downloadUrl}
                          className="inline-flex items-center gap-1 text-[11px] text-white/70 hover:text-white font-bold"
                        >
                          Testar Download Direto
                        </a>
                      </div>
                    </div>
                  ) : isDrive ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                      Link do Drive inserido. Certifique-se de que o arquivo esteja compartilhado como &ldquo;Qualquer pessoa com o link&rdquo;.
                    </div>
                  ) : null}

                  {/* Or select from official preloaded files */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                      Ou selecione um dos arquivos oficiais restaurados:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PRELOADED_FILES.map((pf) => (
                        <button
                          key={pf.path}
                          type="button"
                          onClick={() => handleUpdateCurrent({ link: pf.path, tag: "PDF Oficial" })}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                            currentDoc.link === pf.path
                              ? "bg-primary text-black border-primary"
                              : "bg-white/5 border-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          {pf.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Or upload from device */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Ou anexe um arquivo do seu computador:
                    </span>
                    <label className="cursor-pointer px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>Carregar Arquivo</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Optional Backup Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                    Link de Espelho / Backup (Opcional)
                  </label>
                  <input
                    type="text"
                    value={currentDoc.backupLink || ""}
                    onChange={(e) => handleUpdateCurrent({ backupLink: e.target.value })}
                    placeholder="Link alternativo de segurança (Google Drive ou web)"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-white/40 hover:text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões Oficiais
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider flex-1 sm:flex-none text-center"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-8 py-2.5 rounded-xl bg-primary hover:bg-orange-500 text-black font-black uppercase text-xs tracking-wider transition-all shadow-lg shadow-primary/20 flex-1 sm:flex-none text-center flex items-center justify-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Salvo com Sucesso!
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
