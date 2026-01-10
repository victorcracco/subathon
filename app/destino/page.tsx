"use client";

import Link from "next/link";
import { MapPin, Navigation, Clock, Calendar, Car, ArrowRight, Share2, ExternalLink, HelpCircle } from "lucide-react";

// URL para abrir no celular (Nashville)
const GOOGLE_MAPS_LINK = "https://www.google.com/maps/place/Nashville,+TN";

// URL do Iframe (Embed) - Focado em Nashville
const MAP_EMBED_URL = "https://maps.google.com/maps?q=Nashville,+TN&z=12&output=embed";

export default function DestinoPage() {
  // DADOS ATUALIZADOS: EM NASHVILLE (Aguardando Próximo Destino)
  const tripData = {
    origin: "Nashville, TN",
    destination: "A Definir ❓",
    distance: "---",
    duration: "---",
    road: "Aguardando Rota",
    status: "Hospedados em Nashville"
  };

  // --- ESTILO DO MAPA (Gelo/Dark) ---
  const mapStyle = { filter: 'grayscale(100%) invert(100%) contrast(90%) brightness(95%) sepia(100%) hue-rotate(180deg) saturate(300%)' };

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
        <div className="flex items-center gap-8 bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl opacity-70">
           <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center justify-end gap-1"><Clock size={12}/> Tempo Estimado</p>
              <p className="text-2xl font-black text-slate-300">{tripData.duration}</p>
           </div>
           <div className="w-px h-12 bg-white/10"></div>
           <div className="text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><Car size={12}/> Distância</p>
              <p className="text-2xl font-black text-slate-300">{tripData.distance}</p>
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
                {/* STATUS: LARANJA (PAUSA) */}
                <div className="flex items-center gap-2 mb-6 bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-500/30">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">{tripData.status}</span>
                </div>
                
                {/* Timeline Visual da Rota */}
                <div className="relative pl-2">
                   {/* Linha PONTILHADA para indicar incerteza */}
                   <div className="absolute left-[7px] top-3 w-0.5 border-l-2 border-dashed border-slate-600 h-[105px]"></div>
                   
                   {/* ORIGEM (ATUAL) */}
                   <div className="flex items-start gap-4 mb-10 relative z-10">
                      <div className="w-4 h-4 rounded-full bg-ice-400 shrink-0 mt-1 shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
                      <div>
                         <p className="text-[10px] text-ice-400 font-bold uppercase mb-1">Localização Atual</p>
                         <h3 className="text-2xl font-bold text-white leading-none">{tripData.origin}</h3>
                      </div>
                   </div>

                   {/* DESTINO (MISTÉRIO) */}
                   <div className="flex items-start gap-4 relative z-10 opacity-60">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600 bg-black shrink-0 mt-1 flex items-center justify-center">
                         <HelpCircle size={10} className="text-slate-500"/>
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Próximo Destino</p>
                         <h3 className="text-3xl font-black text-slate-500 leading-none tracking-wide italic">? ? ?</h3>
                         <div className="flex items-center gap-2 mt-2 bg-black/40 px-3 py-1.5 rounded-lg w-fit border border-white/5">
                           <Car size={14} className="text-slate-500" />
                           <span className="text-xs text-slate-500 font-bold">Aguardando definição...</span>
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
             className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-slate-300 font-bold transition-all group"
           >
             <MapPin size={20} className="text-ice-400 group-hover:scale-110 transition-transform" />
             <span className="tracking-wider">Ver Localização no Maps</span>
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Base Atual</span>
           </div>
        </div>

      </div>
    </div>
  );
}