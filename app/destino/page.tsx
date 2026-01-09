"use client";

import Link from "next/link";
import { MapPin, Navigation, Clock, Calendar, Car, ArrowRight, Share2, ExternalLink } from "lucide-react";

export default function DestinoPage() {
  // Dados da Viagem (Baseado na rota Orlando -> Atlanta)
  const tripData = {
    origin: "Orlando, FL",
    destination: "Atlanta, GA",
    distance: "705 km (438 mi)",
    duration: "6h 45min",
    road: "I-75 N",
    status: "Em Progresso"
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center">
      
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
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Tempo Estimado</p>
              <p className="text-xl font-black text-white">{tripData.duration}</p>
           </div>
           <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
           <div className="text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Distância</p>
              <p className="text-xl font-black text-ice-400">{tripData.distance}</p>
           </div>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL (MAPA + INFO) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA DA ESQUERDA: INFOS DETALHADAS */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* CARD DE STATUS */}
           <div className="bg-black/60 backdrop-blur-xl border border-ice-400/30 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-ice-400/20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-400 text-xs font-bold uppercase tracking-widest">{tripData.status}</span>
                </div>
                
                {/* ORIGEM */}
                <div className="flex items-start gap-4 mb-6 relative">
                   <div className="flex flex-col items-center gap-1 mt-1">
                      <div className="w-3 h-3 rounded-full border-2 border-slate-500 bg-black"></div>
                      <div className="w-0.5 h-12 bg-gradient-to-b from-slate-500 to-ice-400"></div>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Origem</p>
                      <h3 className="text-xl font-bold text-slate-300">{tripData.origin}</h3>
                      <p className="text-xs text-slate-600">Saindo da base</p>
                   </div>
                </div>

                {/* DESTINO */}
                <div className="flex items-start gap-4">
                   <div className="flex flex-col items-center gap-1 mt-1">
                      <MapPin className="text-ice-400 fill-ice-400/20" size={16} />
                   </div>
                   <div>
                      <p className="text-xs text-ice-400 font-bold uppercase mb-1">Destino Atual</p>
                      <h3 className="text-2xl font-black text-white">{tripData.destination}</h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Car size={12} /> Via {tripData.road}
                      </p>
                   </div>
                </div>
              </div>
           </div>

           {/* BOTÕES DE AÇÃO */}
           <a 
             href={`https://www.google.com/maps/dir/${tripData.origin}/${tripData.destination}`}
             target="_blank"
             className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl text-white font-bold transition-all group"
           >
             <ExternalLink size={18} className="text-ice-400 group-hover:scale-110 transition-transform" />
             Abrir no Google Maps
           </a>

        </div>

        {/* COLUNA DA DIREITA: O MAPA */}
        <div className="lg:col-span-2 h-[500px] lg:h-auto bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
           
           {/* OVERLAY DE CARREGANDO (Decorativo) */}
           <div className="absolute inset-0 bg-black flex items-center justify-center z-0">
              <div className="text-slate-600 font-bold text-sm animate-pulse">Carregando satélite...</div>
           </div>

           {/* IFRAME DO MAPA COM FILTRO DARK MODE */}
           {/* O truque está na classe 'invert grayscale contrast-125 invert-hue' 
              Isso inverte as cores do mapa claro do Google para parecer um mapa dark customizado.
           */}
           <iframe 
             src="https://maps.google.com/maps?q=from+Orlando,+FL+to+Atlanta,+GA&t=&z=7&ie=UTF8&iwloc=&output=embed"
             className="w-full h-full relative z-10 opacity-90 hover:opacity-100 transition-opacity"
             style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
             allowFullScreen
             loading="lazy"
           ></iframe>

           {/* Efeito de vidro por cima (Opcional, para dar textura) */}
           <div className="absolute inset-0 pointer-events-none border-[6px] border-black/20 rounded-3xl z-20 shadow-inner"></div>
           
           {/* Etiqueta Flutuante */}
           <div className="absolute bottom-4 left-4 z-30 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-white uppercase">Ao Vivo</span>
           </div>
        </div>

      </div>
    </div>
  );
}