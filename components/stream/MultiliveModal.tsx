"use client";

import { useState, useEffect } from 'react';
import { CHANNELS } from '@/lib/constants';
import StreamPlayer from '@/components/stream/StreamPlayer';
import { X, MessageSquare, Play, Snowflake, Check, ArrowLeft } from 'lucide-react';

interface MultiliveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiliveModal({ isOpen, onClose }: MultiliveModalProps) {
  // Estado para controlar se estamos SELECIONANDO ou ASSISTINDO
  const [viewMode, setViewMode] = useState<'selection' | 'watch'>('selection');
  
  const [selectedChannels, setSelectedChannels] = useState<typeof CHANNELS[number][]>([]);
  const [activeChat, setActiveChat] = useState<string>('');

  // Reinicia o modal quando abre
  useEffect(() => {
    if (isOpen) {
      setViewMode('selection');
      // Pré-seleciona os 2 primeiros por padrão
      setSelectedChannels([CHANNELS[0], CHANNELS[1]]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Função para marcar/desmarcar canais na seleção
  const toggleSelection = (channel: typeof CHANNELS[number]) => {
    const isSelected = !!selectedChannels.find(c => c.id === channel.id);
    if (isSelected) {
      setSelectedChannels(prev => prev.filter(c => c.id !== channel.id));
    } else {
      if (selectedChannels.length < 4) {
        setSelectedChannels(prev => [...prev, channel]);
      }
    }
  };

  const handleStartWatching = () => {
    if (selectedChannels.length > 0) {
      setActiveChat(selectedChannels[0].id);
      setViewMode('watch');
    }
  };

  // Define o tamanho das colunas baseado no número de selecionados
  const getGridClass = () => {
    switch (selectedChannels.length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-2';
      default: return 'grid-cols-1';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop Escuro Blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* O BLOCO DE GELO (Container Principal) */}
      <div className="ice-block-modal relative w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden transition-all duration-500">
        
        {/* --- CABEÇALHO DO MODAL --- */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center gap-3">
             {viewMode === 'watch' && (
                <button onClick={() => setViewMode('selection')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                   <ArrowLeft className="text-white" />
                </button>
             )}
             <Snowflake className="text-ice-400 animate-spin-slow" />
             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-ice-300 uppercase tracking-widest">
               {viewMode === 'selection' ? 'Montar Multilive' : 'Ao Vivo'}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors text-white">
            <X size={28} />
          </button>
        </div>

        {/* --- CONTEÚDO: MODO SELEÇÃO --- */}
        {viewMode === 'selection' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 animate-fade-in">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-white">Quem você quer assistir?</h3>
                <p className="text-ice-200">Selecione até 4 canais simultâneos.</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                {CHANNELS.map((channel) => {
                   const isSelected = !!selectedChannels.find(c => c.id === channel.id);
                   return (
                      <button 
                        key={channel.id}
                        onClick={() => toggleSelection(channel)}
                        className={`group relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden ${
                           isSelected 
                             ? 'bg-ice-400/20 border-ice-400 shadow-[0_0_30px_rgba(96,165,250,0.3)] scale-105' 
                             : 'bg-black/40 border-white/10 hover:border-white/50 hover:bg-white/5'
                        }`}
                      >
                         {/* Efeito de Gelo no Topo do Botão */}
                         <div className="icicles-top w-full absolute top-0 left-0 h-2" />
                         
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-transform ${isSelected ? 'bg-ice-400 text-black scale-110' : 'bg-slate-800 text-slate-500'}`}>
                            {channel.name[0]}
                         </div>
                         <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                            {channel.name}
                         </span>
                         
                         {isSelected && (
                            <div className="absolute top-3 right-3 bg-ice-400 text-black p-1 rounded-full">
                               <Check size={14} strokeWidth={4} />
                            </div>
                         )}
                      </button>
                   );
                })}
             </div>

             <button 
                onClick={handleStartWatching}
                disabled={selectedChannels.length === 0}
                className="mt-4 px-12 py-5 bg-gradient-to-r from-ice-500 to-ice-400 hover:to-white text-black font-black text-xl uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
             >
                <Play fill="black" size={24} />
                Iniciar Transmissão
             </button>
          </div>
        )}

        {/* --- CONTEÚDO: MODO ASSISTIR (GRID) --- */}
        {viewMode === 'watch' && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black/50">
            {/* Grid de Vídeo */}
            <div className={`flex-1 grid ${getGridClass()} p-1 gap-1 overflow-y-auto`}>
              {selectedChannels.map((channel) => (
                <div key={channel.id} className="relative group border border-white/10 bg-black h-full min-h-[200px]">
                  <StreamPlayer channel={channel.id} platform={channel.platform} muted={false} />
                  
                  {/* Botão para ativar chat deste player */}
                  <button 
                    onClick={() => setActiveChat(channel.id)}
                    className={`absolute top-2 right-2 p-2 rounded text-xs font-bold uppercase transition-all z-10 flex items-center gap-2 ${activeChat === channel.id ? 'bg-ice-400 text-black' : 'bg-black/60 text-white hover:bg-white/20'}`}
                  >
                    <MessageSquare size={14} />
                    {activeChat === channel.id ? 'Chat Ativo' : 'Ver Chat'}
                  </button>
                </div>
              ))}
            </div>

            {/* Chat Lateral */}
            <div className="hidden lg:flex w-80 flex-col border-l border-white/10 bg-[#0e0e10]">
               <div className="p-3 bg-white/5 text-xs font-bold text-center border-b border-white/10 text-ice-200">
                  CHAT: {activeChat.toUpperCase()}
               </div>
               {activeChat && (
                 <iframe
                    src={`https://www.twitch.tv/embed/${activeChat}/chat?parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&darkpopout`}
                    className="flex-1 w-full"
                 />
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}