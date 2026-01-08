"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTwitchUsers } from '@/app/actions'; 
import StreamPlayer from '@/components/stream/StreamPlayer';
import { MessageSquare, Play, Snowflake, Check, ArrowLeft, Home, X, PanelRightOpen, Maximize2, Minimize2, Plus, Minus, Menu, LogOut } from 'lucide-react';

const IMAGES = {
  STEREO: "https://files.kick.com/images/user/751972/profile_image/conversion/81c97a63-7038-4a6a-ac9c-4e10b9b71537-fullsize.webp",
};

const CHANNELS = [
  { id: 'sheviii2k', name: 'Shevii2k', platform: 'twitch' },
  { id: 'jonvlogs', name: 'Jon Vlogs', platform: 'twitch' },
  { id: 'linsjr', name: 'LinsJr', platform: 'twitch' },
  { id: 'stereonline', name: 'Stereo', platform: 'kick', customImage: IMAGES.STEREO },
] as const;

export default function MultilivePage() {
  const [viewMode, setViewMode] = useState<'selection' | 'watch'>('selection');
  const [selectedChannels, setSelectedChannels] = useState<typeof CHANNELS[number][]>([]);
  const [activeChats, setActiveChats] = useState<string[]>([]);
  
  // ESTADOS DE TELA
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false); 
  const [usersData, setUsersData] = useState<any[]>([]);
  const [twitchParentQuery, setTwitchParentQuery] = useState('');

  useEffect(() => {
    async function loadAvatars() {
      const twitchLogins = CHANNELS.filter(c => c.platform === 'twitch').map(c => c.id);
      if (twitchLogins.length > 0) {
        const data = await getTwitchUsers(twitchLogins);
        setUsersData(data);
      }
    }
    loadAvatars();
    setSelectedChannels([CHANNELS[0], CHANNELS[1]]);

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isIp = /^[0-9]+(\.[0-9]+)+$/.test(hostname);
      const domain = isIp ? 'localhost' : hostname;
      setTwitchParentQuery(`parent=${domain}`);
    }
  }, []);

  const getAvatar = (channel: typeof CHANNELS[number]) => {
    if ((channel as any).customImage) return (channel as any).customImage;
    const user = usersData.find((u: any) => u.login.toLowerCase() === channel.id.toLowerCase());
    return user ? user.profile_image_url : null;
  };

  const toggleSelection = (channel: typeof CHANNELS[number]) => {
    const isSelected = !!selectedChannels.find(c => c.id === channel.id);
    if (isSelected) {
      if (selectedChannels.length > 1) { 
        setSelectedChannels(prev => prev.filter(c => c.id !== channel.id));
        setActiveChats(prev => prev.filter(c => c !== channel.id));
      }
    } else {
      if (selectedChannels.length < 4) setSelectedChannels(prev => [...prev, channel]);
    }
  };

  const handleStartWatching = () => {
    if (selectedChannels.length > 0) {
      setActiveChats([selectedChannels[0].id]);
      setViewMode('watch');
      setIsChatSidebarOpen(true);
    }
  };

  const toggleChat = (channelId: string) => {
    setIsChatSidebarOpen(true);
    setActiveChats(prev => {
      if (prev.includes(channelId)) return prev.filter(id => id !== channelId);
      return [...prev, channelId];
    });
  };

  const getChannelName = (id: string) => {
    const channel = CHANNELS.find(c => c.id === id);
    return channel ? channel.name : id;
  };

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
    <div className={`transition-all duration-300 ${
      isImmersiveMode 
        ? 'fixed inset-0 !z-[2147483647] bg-black w-screen h-screen flex flex-col overflow-hidden' 
        : 'min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center relative z-10'
    }`}>
      
      {/* BOTÃO FLUTUANTE DE EMERGÊNCIA (Canto inferior esquerdo) */}
      {viewMode === 'watch' && (
        <button 
          onClick={() => setIsImmersiveMode(!isImmersiveMode)}
          className={`fixed bottom-6 left-6 z-[2147483647] p-3 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl border transition-all duration-300 group flex items-center gap-0 overflow-hidden hover:pr-4 hover:w-auto ${isImmersiveMode ? 'bg-white/10 text-white border-white/20 w-12 hover:bg-white/20' : 'bg-ice-400 text-black border-ice-400 w-12 hover:w-32'}`}
          title={isImmersiveMode ? "Sair do Modo Imersivo" : "Modo Tela Cheia"}
        >
          {isImmersiveMode ? <LogOut size={20} /> : <Maximize2 size={20} />}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2 font-bold text-xs uppercase">
            {isImmersiveMode ? 'Sair' : 'Tela Cheia'}
          </span>
        </button>
      )}

      {/* CONTAINER PRINCIPAL */}
      <div className={`flex flex-col overflow-hidden shadow-2xl transition-all duration-500 ease-in-out ${
        isImmersiveMode 
          ? 'w-full h-full rounded-none border-none' 
          : 'relative w-full max-w-[95vw] h-[85vh] border border-white/10 rounded-2xl bg-black/80 backdrop-blur-xl'
      }`}>
        
        {/* HEADER INTERNO */}
        {!isImmersiveMode && (
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-xl shrink-0 h-14 transition-all">
            <div className="flex items-center gap-4 w-full">
              {/* ESQUERDA: Botões de Voltar */}
              {viewMode === 'watch' ? (
                  <button onClick={() => setViewMode('selection')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 border border-white/5">
                    <ArrowLeft size={14} /> <span className="hidden sm:inline">Voltar</span>
                  </button>
              ) : (
                  <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 border border-white/5">
                    <Home size={14} /> <span className="hidden sm:inline">Home</span>
                  </Link>
              )}
              
              {/* CENTRO: Título */}
              <div className="flex-1 flex items-center justify-center gap-2">
                <Snowflake className="text-ice-400 animate-spin-slow" size={18} />
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-ice-300 uppercase tracking-widest hidden sm:block">
                  {viewMode === 'selection' ? 'Montar Multilive' : 'Ao Vivo'}
                </h2>
              </div>

              {/* DIREITA: Botões de Ação (AQUI ESTÁ O BOTÃO QUE FALTAVA) */}
              <div className="flex items-center gap-2">
                  
                  {/* Botão EXPANDIR TELA (Restaurado) */}
                  {viewMode === 'watch' && (
                    <button 
                      onClick={() => setIsImmersiveMode(true)} 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border bg-ice-400/10 text-ice-400 border-ice-400/30 hover:bg-ice-400/20"
                      title="Expandir Tela"
                    >
                      <Maximize2 size={14} /> <span className="hidden sm:inline">Expandir</span>
                    </button>
                  )}

                  {/* Botão CHAT */}
                  {viewMode === 'watch' && !isChatSidebarOpen && (
                      <button onClick={() => setIsChatSidebarOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors text-xs font-bold border border-white/10">
                        <PanelRightOpen size={14} /> <span className="hidden sm:inline">Chat</span>
                      </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODO SELEÇÃO --- */}
        {viewMode === 'selection' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 overflow-y-auto bg-gradient-to-b from-black/20 to-black/60">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-white">Escolha as telas</h3>
                <p className="text-ice-200">Selecione até 4 canais.</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                {CHANNELS.map((channel) => {
                   const isSelected = !!selectedChannels.find(c => c.id === channel.id);
                   const avatar = getAvatar(channel);

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
                         <div className="icicles-top opacity-50" />
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-transform overflow-hidden ${isSelected ? 'ring-2 ring-ice-400 scale-110' : 'bg-slate-800'}`}>
                            {avatar ? <img src={avatar} alt={channel.name} className="w-full h-full object-cover" /> : <span className="text-slate-500">{channel.name[0]}</span>}
                         </div>
                         <span className={`font-bold uppercase tracking-wider text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>{channel.name}</span>
                         {isSelected && <div className="absolute top-2 right-2 bg-ice-400 text-black p-0.5 rounded-full"><Check size={12} strokeWidth={4} /></div>}
                      </button>
                   );
                })}
             </div>

             <button onClick={handleStartWatching} disabled={selectedChannels.length === 0} className="mt-4 px-10 py-4 bg-gradient-to-r from-ice-500 to-ice-400 hover:to-white text-black font-black text-lg uppercase tracking-widest rounded-full shadow-lg hover:shadow-ice-400/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3">
                <Play fill="black" size={20} /> Assistir Agora
             </button>
          </div>
        )}

        {/* --- MODO ASSISTIR --- */}
        {viewMode === 'watch' && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black/50 overflow-hidden relative">
            
            {/* Grid de Vídeo */}
            <div className={`flex-1 grid ${getGridClass()} p-0.5 gap-0.5 overflow-hidden h-full transition-all duration-300`}>
              {selectedChannels.map((channel) => {
                const isChatActive = activeChats.includes(channel.id);

                return (
                  <div key={channel.id} className="relative group border border-white/10 bg-black w-full h-full overflow-hidden">
                    <StreamPlayer channel={channel.id} platform={channel.platform} muted={false} />
                    
                    <button 
                      onClick={() => toggleChat(channel.id)} 
                      className={`absolute top-2 right-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all z-10 flex items-center gap-1 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 ${isChatActive && isChatSidebarOpen ? 'bg-ice-400 text-black' : 'bg-black/60 text-white hover:bg-white/20'}`}
                    >
                      {isChatActive && isChatSidebarOpen ? <Minus size={12} /> : <Plus size={12} />} 
                      {isChatActive && isChatSidebarOpen ? 'Fechar Chat' : 'Abrir Chat'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Sidebar de Chat */}
            {isChatSidebarOpen && activeChats.length > 0 && (
              <div className="hidden lg:flex w-80 flex-col border-l border-white/10 bg-[#0e0e10] shrink-0 transition-all duration-300 h-full">
                 <div className="flex-1 flex flex-col h-full overflow-hidden">
                   {activeChats.map((chatId) => (
                     <div key={chatId} className="flex flex-col border-b border-white/10 last:border-b-0" style={{ height: `${100 / activeChats.length}%` }}>
                        <div className="p-2 bg-white/5 text-[10px] font-bold text-center border-b border-white/10 text-ice-200 flex items-center justify-between h-8 shrink-0">
                           <span className="flex items-center gap-1 ml-2"><MessageSquare size={12} /> {getChannelName(chatId)}</span>
                           <button onClick={() => toggleChat(chatId)} className="hover:bg-white/10 p-1 rounded text-slate-400 hover:text-white" title="Fechar este chat"><X size={12} /></button>
                        </div>
                        
                        {twitchParentQuery && (
                          <iframe
                             src={`https://www.twitch.tv/embed/${chatId}/chat?${twitchParentQuery}&darkpopout`}
                             className="flex-1 w-full h-full"
                             sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
                          />
                        )}
                     </div>
                   ))}
                 </div>

                 <button 
                   onClick={() => setIsChatSidebarOpen(false)} 
                   className="h-6 w-full flex items-center justify-center bg-black hover:bg-white/10 border-t border-white/10 text-slate-500 hover:text-white text-[10px] uppercase font-bold"
                 >
                   Esconder Barra Lateral
                 </button>
              </div>
            )}

            {!isChatSidebarOpen && activeChats.length > 0 && (
               <button onClick={() => setIsChatSidebarOpen(true)} className="absolute top-1/2 right-0 -translate-y-1/2 bg-black/80 p-2 rounded-l-xl border-y border-l border-white/20 text-ice-400 hover:bg-white/10 transition-all z-20">
                 <PanelRightOpen size={20} />
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}