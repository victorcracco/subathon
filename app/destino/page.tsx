"use client";

import Link from "next/link";
import { MapPin, Navigation, Clock, Calendar, Car, ArrowRight, Share2, ExternalLink } from "lucide-react";

// URL para abrir no celular (Google Maps App)
const GOOGLE_MAPS_LINK = "https://www.google.com/maps/dir/Atlanta,+GA/Nashville,+TN";

// URL do Iframe (Embed) - Rota entre Atlanta e Nashville
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1672892.569949666!2d-86.83707576508386!3d34.93666657984407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20Ge%C3%B3rgia%2C%20EUA!3m2!1d33.748752!2d-84.38768449999999!4m5!1s0x8864ec3213eb903d%3A0x7d3fb9d0a1e9daa0!2sNashville%2C%20Tennessee%2C%20EUA!3m2!1d36.1626638!2d-86.7816016!5e0!3m2!1spt-BR!2sbr!4v1704840000000!5m2!1spt-BR!2sbr";

export default function DestinoPage() {
  // DADOS ATUALIZADOS: ATLANTA -> NASHVILLE
  const tripData = {
    origin: "Atlanta, GA",
    destination: "Nashville, TN",
    distance: "400 km (248 mi)",
    duration: "4h 00min",
    road: "I-75 N / I-24 W",
    status: "Em Progresso"
  };

  // --- ESCOLHA O ESTILO DO MAPA AQUI ---
  // OPÇÃO 1: Dark Mode Clássico (Ativado)
  const mapStyle = { filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(120%) saturate(100%)' };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center animate-fade-in">
      
      {/* HEADER DA PÁGINA */}
      <div className="w-full max-w-6xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2 flex items-center justify-center md:justify-start gap-3">
            <Navigation className="text-ice-400" size={36} /> 
            Rota da Viagem
          </h1>
          <p className="text-slate-400 text-sm font-bold">Acompanhe o trajeto oficial do Subathon</p>
        </div>

        {/* CARD RESUMO FLUTUANTE */}
        <div className="flex items-center gap-8 bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl">
           <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center justify-end gap-1"><Clock size={12}/> Tempo Estimado</p>
              <p className="text-2xl font-black text-white">{tripData.duration}</p>
           </div>
           <div className="w-px h-12 bg-white/10"></div>
           <div className="text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><Car size={12}/> Distância</p>
              <p className="text-2xl font-black text-ice-400">{tripData.distance}</p>
           </div>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL (MAPA + INFO) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA DA ESQUERDA: INFOS DETALHADAS */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* CARD DE STATUS DA ROTA */}
           <div className="bg-black/60 backdrop-blur-xl border border-ice-400/30 p-8 rounded-3xl relative overflow-hidden group shadow-[0_0_30px_rgba(96,165,250,0.1)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ice-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/30">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-400 text-xs font-bold uppercase tracking-widest">{tripData.status}</span>
                </div>
                
                {/* Timeline Visual da Rota */}
                <div className="relative pl-2">
                   {/* Linha conectora */}
                   <div className="absolute left-[7px] top-3 bottom-8 w-0.5 bg-gradient-to-b from-slate-600 via-ice-400 to-ice-400 h-[80%]"></div>
                   
                   {/* ORIGEM */}
                   <div className="flex items-start gap-4 mb-10 relative z-10">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500 bg-black shrink-0 mt-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Ponto de Partida</p>
                         <h3 className="text-2xl font-bold text-slate-300 leading-none">{tripData.origin}</h3>
                      </div>
                   </div>

                   {/* DESTINO */}
                   <div className="flex items-start gap-4 relative z-10">
                      <div className="w-4 h-4 rounded-full bg-ice-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] shrink-0 mt-1 flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                         <p className="text-[10px] text-ice-400 font-bold uppercase mb-1">Próximo Destino</p>
                         <h3 className="text-3xl font-black text-white leading-none tracking-wide">{tripData.destination}</h3>
                         <div className="flex items-center gap-2 mt-2 bg-black/40 px-3 py-1.5 rounded-lg w-fit border border-white/5">
                           <Car size={14} className="text-slate-400" />
                           <span className="text-xs text-slate-300 font-bold">Via {tripData.road}</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </div>

           {/* BOTÃO DE AÇÃO */}
           <a 
             href={GOOGLE_MAPS_LINK}
             target="_blank"
             className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-ice-900 hover:to-ice-800 border border-white/10 hover:border-ice-400/50 rounded-2xl text-white font-bold transition-all group shadow-lg hover:shadow-ice-400/20 hover:-translate-y-1"
           >
             <ExternalLink size={20} className="text-ice-400 group-hover:scale-110 transition-transform" />
             <span className="tracking-wider">Abrir Rota no Google Maps</span>
           </a>
        </div>

        {/* COLUNA DA DIREITA: O MAPA */}
        <div className="lg:col-span-2 h-[500px] lg:h-auto bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
           
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-0 pointer-events-none"></div>

           <iframe 
             src={MAP_EMBED_URL}
             className="w-full h-full relative z-10 transition-all duration-500"
             style={mapStyle} 
             allowFullScreen
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
           ></iframe>

           <div className="absolute inset-0 pointer-events-none border-[8px] border-black/40 rounded-3xl z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
           
           <div className="absolute bottom-4 left-4 z-30 bg-black/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Visualização do Trajeto</span>
           </div>
        </div>

      </div>
    </div>
  );
}