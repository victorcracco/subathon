"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import StreamPlayer from "@/components/stream/StreamPlayer";
import { getTwitchStreams, getTwitchUsers, getTwitchClips } from "@/app/actions"; 
import WeatherWidget from "@/components/WeatherWidget"; 
import { Play, Users, Radio, LayoutGrid, Loader2, Eye, Twitter, Instagram, Youtube, X, Twitch, MapPin, Navigation, Car } from "lucide-react";

// --- IMAGENS ---
const IMAGES = {
  STEREO: "https://files.kick.com/images/user/751972/profile_image/conversion/81c97a63-7038-4a6a-ac9c-4e10b9b71537-fullsize.webp",
};

const MAP_URL = "https://rtirl.com/twitch:119611214";

const KickIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 hover:text-white transition-colors"><path d="M3 3h18v18H3V3zm13.5 13.5L12.75 12l3.75-4.5h-3.3l-2.7 3.6v-3.6h-3v9h3v-3.3l2.7 3.3h3.3z"/></svg>
);

// --- CANAIS DA LIVE ---
const CHANNELS = [
  { id: 'sheviii2k', name: 'Shevii2k', platform: 'twitch' },
  { id: 'jonvlogs', name: 'Jon Vlogs', platform: 'twitch' },
  { id: 'linsjr', name: 'LinsJr', platform: 'twitch' },
  { id: 'stereonline', name: 'Stereo', platform: 'kick', customImage: IMAGES.STEREO },
] as const;

// --- LISTA DE PARTICIPANTES ---
const PARTICIPANTS = [
  { 
    name: "Jon Vlogs", imageFallback: "J", twitchId: "jonvlogs", 
    carModel: "RAM Rebel", 
    links: [{ type: 'twitch', url: 'https://twitch.tv/jonvlogs' }, { type: 'youtube', url: 'https://youtube.com/@JonVlogs' }, { type: 'instagram', url: 'https://instagram.com/jonvlogs' }]
  },
  { 
    name: "Marcove", imageFallback: "M", twitchId: "marcove", 
    carModel: "RAM Rebel", 
    links: [{ type: 'instagram', url: 'https://instagram.com/marcovebb' }, { type: 'twitch', url: 'https://twitch.tv/marcove' }]
  },
  { 
    name: "Sheviii2k", imageFallback: "S", twitchId: "sheviii2k", 
    carModel: "Toyota 4Runner", 
    links: [{ type: 'instagram', url: 'https://instagram.com/sheviii2k' }, { type: 'twitch', url: 'https://twitch.tv/sheviii2k' }, { type: 'youtube', url: 'https://youtube.com/@sheviii2k' }]
  },
  { 
    name: "LinsJr", imageFallback: "L", twitchId: "linsjr", 
    carModel: "Lexus GX 470", 
    links: [{ type: 'instagram', url: 'https://instagram.com/jrliinss' }, { type: 'twitch', url: 'https://twitch.tv/linsjr' }, { type: 'youtube', url: 'https://www.youtube.com/@LinsJunior' }]
  },
  { 
    name: "Stereo", imageFallback: "S", twitchId: "stereonline", customImage: IMAGES.STEREO,
    carModel: "Chevrolet Silverado", 
    links: [{ type: 'instagram', url: 'https://instagram.com/stereonline' }, { type: 'youtube', url: 'https://youtube.com/stereonline' }, { type: 'kick', url: 'https://kick.com/stereonline' }]
  },
];

const SocialIcon = ({ type }: { type: string }) => {
  switch(type) {
    case 'twitch': return <Twitch size={16} className="text-purple-400 hover:text-white transition-colors"/>;
    case 'youtube': return <Youtube size={16} className="text-red-500 hover:text-white transition-colors"/>;
    case 'instagram': return <Instagram size={16} className="text-pink-500 hover:text-white transition-colors"/>;
    case 'x': return <Twitter size={16} className="text-blue-400 hover:text-white transition-colors"/>;
    case 'kick': return <KickIcon />;
    default: return null;
  }
};

export default function Home() {
  // --- CORREÇÃO AQUI: Adicionei <typeof CHANNELS[number]> para o TypeScript aceitar qualquer canal ---
  const [activeChannel, setActiveChannel] = useState<typeof CHANNELS[number]>(CHANNELS[0]);
  
  const [liveData, setLiveData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [clips, setClips] = useState<any[]>([]);
  
  const [clipTimeFilter, setClipTimeFilter] = useState<number>(60); 
  const [clipStreamerFilter, setClipStreamerFilter] = useState<string>('all'); 
  const [isLoadingClips, setIsLoadingClips] = useState(false);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const currentLocation = "Orlando"; 

  useEffect(() => {
    async function initData() {
      const channelLogins = CHANNELS.filter(c => c.platform === 'twitch').map(c => c.id);
      const participantLogins = PARTICIPANTS.map(p => p.twitchId).filter(Boolean);
      const allLogins = Array.from(new Set([...channelLogins, ...participantLogins]));

      if (allLogins.length > 0) {
        const users = await getTwitchUsers(allLogins);
        setUsersData(users);
        const streams = await getTwitchStreams(channelLogins);
        setLiveData(streams);
        fetchClips(channelLogins, 60);
      }
    }
    initData();
  }, []);

  const fetchClips = async (logins: string[], days: number) => {
    setIsLoadingClips(true);
    let currentUsers = usersData;
    
    if (currentUsers.length === 0) {
       currentUsers = await getTwitchUsers(logins);
       setUsersData(currentUsers);
    }
    
    const userIds = currentUsers.filter((u: any) => logins.includes(u.login)).map((u: any) => u.id);
    
    if (userIds.length > 0) {
      const fetchedClips = await getTwitchClips(userIds, days);
      setClips(fetchedClips.slice(0, 20)); // Limite de 20 clips
    }
    setIsLoadingClips(false);
  };

  const handleTimeFilter = (days: number) => {
    setClipTimeFilter(days);
    const logins = CHANNELS.filter(c => c.platform === 'twitch').map(c => c.id);
    fetchClips(logins, days);
  };

  const filteredClipsDisplay = useMemo(() => {
    if (clipStreamerFilter === 'all') return clips;
    const selectedUser = usersData.find((u: any) => u.login === clipStreamerFilter);
    if (selectedUser) return clips.filter(c => c.broadcaster_id === selectedUser.id);
    return [];
  }, [clips, clipStreamerFilter, usersData]);

  const getAvatar = (login: string, customImage?: string) => {
    if (customImage) return customImage;
    const user = usersData.find((u: any) => u.login.toLowerCase() === login.toLowerCase());
    return user ? user.profile_image_url : null;
  };

  const getChannelStatus = (channelId: string, platform: string) => {
    if (platform === 'kick') return { isOnline: true, viewers: 0 };
    const stream = liveData.find((s: any) => s.user_login.toLowerCase() === channelId.toLowerCase());
    return stream ? { isOnline: true, viewers: stream.viewer_count } : { isOnline: false, viewers: 0 };
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20 pt-6">
      
      {/* MODAL CLIP (Z-Index Máximo) */}
      {activeClip && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setActiveClip(null)}>
           <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-ice-400/30 shadow-[0_0_50px_rgba(96,165,250,0.3)]">
             <iframe src={`${activeClip}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`} className="w-full h-full" allowFullScreen />
             <button onClick={() => setActiveClip(null)} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"><X size={20}/></button>
           </div>
        </div>
      )}

      {/* MODAL MAPA (Z-INDEX 99999) */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
           <div className="relative w-full max-w-6xl h-[85vh] bg-slate-900 rounded-3xl overflow-hidden border border-ice-400/50 shadow-[0_0_50px_rgba(96,165,250,0.4)] flex flex-col">
             <div className="bg-black/60 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10 absolute top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-ice-400/20 flex items-center justify-center animate-pulse"><Navigation className="text-ice-400" size={20} /></div>
                   <div><h3 className="font-black text-white text-lg leading-tight uppercase tracking-wider">Rastreamento</h3><p className="text-ice-300 text-xs font-bold">Ao Vivo</p></div>
                </div>
                <button onClick={() => setIsMapOpen(false)} className="bg-white/10 hover:bg-red-500/80 text-white p-2 rounded-full transition-colors cursor-pointer z-50"><X size={24} /></button>
             </div>
             <iframe src={MAP_URL} className="w-full h-full" allow="geolocation" />
           </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-4">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ice-400/10 border border-ice-400/30 text-ice-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(96,165,250,0.2)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_#ef4444]"></span> Ao Vivo Agora
         </div>
         <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-ice-300 drop-shadow-sm leading-tight italic">SUBATHON</h1>
      </div>

      {/* GRID PRINCIPAL (LIVE) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 flex flex-col gap-3">
             {CHANNELS.map((channel) => {
               const isActive = activeChannel.id === channel.id;
               const status = getChannelStatus(channel.id, channel.platform);
               const avatar = getAvatar(channel.id, (channel as any).customImage);
               return (
                 <button key={channel.id} onClick={() => setActiveChannel(channel)} className={`relative overflow-hidden p-3 rounded-xl border text-left transition-all duration-300 group ${isActive ? 'bg-ice-400/10 border-ice-400/50 shadow-[0_0_20px_rgba(96,165,250,0.15)] translate-x-2' : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                   <div className="icicles-top" />
                   <div className="flex items-center justify-between relative z-10 pt-2">
                     <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 overflow-hidden transition-colors ${status.isOnline ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'border-white/10'}`}>
                          {avatar ? <img src={avatar} className="w-full h-full object-cover"/> : channel.name[0]}
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{channel.name}</h3>
                          {status.isOnline ? <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">● {channel.platform === 'kick' ? 'Kick Live' : `${status.viewers.toLocaleString()} views`}</span> : <span className="text-[10px] uppercase text-slate-500">{channel.platform} • Offline</span>}
                        </div>
                     </div>
                     {isActive && <Radio size={18} className="text-ice-400 animate-pulse" />}
                   </div>
                 </button>
               )
             })}
             <div className="grid grid-cols-2 gap-2 mt-2">
                <Link href="/multilive" className="w-full py-4 bg-gradient-to-r from-ice-500 to-ice-400 hover:to-white text-black font-black uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-1 group text-center text-[10px]">
                  <LayoutGrid size={24} className="group-hover:rotate-90 transition-transform mb-1" /> Abrir Multilive
                </Link>
                <button onClick={() => setIsMapOpen(true)} className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-ice-900 hover:to-ice-800 text-white border border-white/10 hover:border-ice-400/50 font-black uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-1 group text-center text-[10px]">
                  <MapPin size={24} className="text-ice-400 group-hover:scale-110 transition-transform mb-1" /> Rastrear Viagem
                </button>
             </div>
        </div>
        <div className="lg:col-span-8">
           <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black group">
             <div className="icicles-top opacity-50" />
             <StreamPlayer channel={activeChannel.id} platform={activeChannel.platform} muted={false} key={activeChannel.id} />
           </div>
        </div>
      </section>

      {/* TOP CLIPS */}
      <section className="pt-10 border-t border-white/10">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 gap-4">
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Play className="fill-ice-400 text-ice-400" size={24} /> Top Clips
           </h2>
           <Link href="/clips" className="text-sm font-bold text-ice-400 hover:text-white transition-colors">Ver Galeria Completa &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {isLoadingClips ? (
             <div className="col-span-4 text-center py-12 text-slate-500 flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 animate-spin text-ice-400"/> Carregando clips...</div>
           ) : filteredClipsDisplay.length > 0 ? (
             filteredClipsDisplay.slice(0, 20).map((clip) => (
               <div key={clip.id} className="group cursor-pointer" onClick={() => setActiveClip(clip.embed_url)}>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10 group-hover:border-ice-400/50 transition-all shadow-lg">
                     <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"><div className="w-12 h-12 rounded-full bg-ice-400/90 flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform"><Play size={20} fill="black" /></div></div>
                     <div className="icicles-top opacity-50" />
                     <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-bold">{Math.round(clip.duration)}s</div>
                  </div>
                  <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 group-hover:text-ice-300 transition-colors">{clip.title}</h3>
                  <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                     <span className="text-ice-200">{clip.broadcaster_name}</span>
                     <span className="flex items-center gap-1"><Eye size={10}/> {clip.view_count.toLocaleString()}</span>
                  </div>
               </div>
             ))
           ) : (
             <div className="col-span-4 text-center py-10 text-slate-600 bg-white/5 rounded-xl border border-white/5">Nenhum clip encontrado.</div>
           )}
        </div>
      </section>

      {/* PARTICIPANTES */}
      <section className="border-t border-white/10 pt-10">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Users className="text-ice-400 w-8 h-8" /> Participantes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {PARTICIPANTS.map((participant) => {
            const avatar = getAvatar(participant.twitchId, (participant as any).customImage);
            return (
              <div key={participant.name} className="glass-panel p-4 rounded-xl flex flex-col items-center text-center group hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="w-24 h-24 rounded-full border-4 border-ice-400/20 mb-3 overflow-hidden shadow-2xl bg-slate-800 flex items-center justify-center relative group-hover:border-ice-400/50 transition-colors z-10">
                   {avatar ? <img src={avatar} className="w-full h-full object-cover" alt={participant.name} /> : <span className="text-2xl font-bold text-slate-500">{participant.imageFallback}</span>}
                </div>
                
                <h3 className="font-bold text-white mb-2 text-base tracking-wide z-10">{participant.name}</h3>
                
                {/* INFO DO CARRO */}
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 mb-4 z-10">
                  <Car size={14} className="text-ice-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{participant.carModel}</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-auto z-10">
                  {participant.links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" className="p-2 bg-black/40 rounded-lg hover:bg-white/10 transition-colors border border-white/5 text-slate-400 hover:text-white" title={link.type}><SocialIcon type={link.type} /></a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  );
}