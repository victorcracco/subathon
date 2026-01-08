"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getTwitchUsers, getTwitchClips } from "@/app/actions"; 
import { Play, Home, Loader2, Eye, Filter, Calendar, Snowflake, ArrowLeft, X } from "lucide-react";

const CHANNELS = [
  { id: 'sheviii2k', name: 'Shevii2k' },
  { id: 'jonvlogs', name: 'Jon Vlogs' },
  { id: 'linsjr', name: 'LinsJr' },
  { id: 'marcove', name: 'Marcove' }, 
  { id: 'stereonline', name: 'Stereo' },
];

export default function ClipsPage() {
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [timeFilter, setTimeFilter] = useState<number>(1); 
  const [streamerFilter, setStreamerFilter] = useState<string>('all');
  const [activeClip, setActiveClip] = useState<string | null>(null);

  useEffect(() => {
    fetchClips();
  }, [timeFilter]); 

  const fetchClips = async () => {
    setLoading(true);
    try {
      const logins = CHANNELS.map(c => c.id);
      const users = await getTwitchUsers(logins);
      const userIds = users.map((u: any) => u.id);

      if (userIds.length > 0) {
        const data = await getTwitchClips(userIds, timeFilter);
        setClips(data);
      }
    } catch (error) {
      console.error("Erro ao buscar clips", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClips = useMemo(() => {
    if (streamerFilter === 'all') return clips;
    const channel = CHANNELS.find(c => c.id === streamerFilter);
    if (!channel) return clips;
    
    return clips.filter(c => 
      c.broadcaster_name.toLowerCase().includes(channel.name.toLowerCase()) || 
      c.broadcaster_name.toLowerCase() === channel.id.toLowerCase()
    );
  }, [clips, streamerFilter]);

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center">
      
      {/* MODAL CLIP COM BOTÃO DE FECHAR */}
      {activeClip && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setActiveClip(null)}>
           <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-ice-400/30 shadow-[0_0_50px_rgba(96,165,250,0.3)]" onClick={(e) => e.stopPropagation()}>
             {/* BOTÃO X PARA FECHAR */}
             <button 
                onClick={() => setActiveClip(null)} 
                className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg group"
             >
                <X size={20} className="group-hover:scale-110 transition-transform" />
             </button>
             
             <iframe src={`${activeClip}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`} className="w-full h-full" allowFullScreen />
           </div>
        </div>
      )}

      {/* CONTAINER PRINCIPAL */}
      <div className="w-full max-w-[1400px]">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-ice-400/10 rounded-xl border border-ice-400/20">
               <Snowflake className="text-ice-400" size={24} />
             </div>
             <h1 className="text-3xl font-black text-white tracking-wide uppercase">Galeria de Clips</h1>
           </div>

           <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-white/20">
             <Home size={16} /> Voltar para Home
           </Link>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10 py-4 mb-8 -mx-4 px-4 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shadow-2xl">
           <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-2 flex items-center gap-1"><Calendar size={12}/> Período:</span>
              {[1, 7, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeFilter(days)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${
                    timeFilter === days 
                      ? 'bg-ice-400 text-black border-ice-400' 
                      : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {days === 1 ? 'Últimas 24h' : `${days} Dias`}
                </button>
              ))}
           </div>

           <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-2 flex items-center gap-1"><Filter size={12}/> Canal:</span>
              <button
                 onClick={() => setStreamerFilter('all')}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${
                   streamerFilter === 'all'
                     ? 'bg-white text-black border-white' 
                     : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                 }`}
               >
                 Todos
               </button>
               {CHANNELS.map((channel) => (
                 <button
                   key={channel.id}
                   onClick={() => setStreamerFilter(channel.id)}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${
                     streamerFilter === channel.id
                       ? 'bg-ice-400 text-black border-ice-400' 
                       : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                   }`}
                 >
                   {channel.name}
                 </button>
               ))}
           </div>
        </div>

        {/* GRID DE CLIPS */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-slate-500 gap-3">
             <Loader2 size={40} className="animate-spin text-ice-400" />
             <p className="font-bold text-sm">Carregando momentos épicos...</p>
          </div>
        ) : filteredClips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
             {filteredClips.map((clip) => (
               <div 
                 key={clip.id} 
                 className="group cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/80 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5 hover:border-ice-400/30 flex flex-col" 
                 onClick={() => setActiveClip(clip.embed_url)}
               >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                     <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                     
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100">
                        <div className="w-10 h-10 rounded-full bg-ice-400/90 flex items-center justify-center text-black shadow-lg transform scale-75 group-hover:scale-100 transition-all">
                          <Play size={18} fill="black" />
                        </div>
                     </div>

                     <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold border border-white/10">
                        {new Date(clip.created_at).toLocaleDateString('pt-BR')}
                     </div>
                     <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-bold">
                        {Math.round(clip.duration)}s
                     </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-200 text-sm leading-snug line-clamp-2 group-hover:text-ice-300 transition-colors mb-2" title={clip.title}>
                      {clip.title}
                    </h3>
                    
                    <div className="mt-auto flex items-center justify-between text-xs pt-3 border-t border-white/5">
                       <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-white transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-ice-400"></span>
                          <span className="font-bold truncate max-w-[100px]">{clip.broadcaster_name}</span>
                       </div>
                       <div className="flex items-center gap-1 text-slate-500 group-hover:text-ice-200 transition-colors font-medium bg-black/20 px-1.5 py-0.5 rounded">
                          <Eye size={12}/> {clip.view_count.toLocaleString()}
                       </div>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <Play size={24} className="text-slate-600" />
             </div>
             <p className="text-white font-bold">Nenhum clip encontrado nas últimas 24h.</p>
             <p className="text-slate-500 text-sm">Tente aumentar o período para 7 ou 30 Dias.</p>
          </div>
        )}
      </div>
    </div>
  );
}