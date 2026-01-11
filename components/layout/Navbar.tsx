"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Snowflake, CloudSnow, CloudOff, ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import WeatherWidget from "@/components/WeatherWidget"; 

const NAV_ITEMS = [
  { label: "Lives", path: "/" },
  { label: "Multilive", path: "/multilive" },
  { label: "Destino", path: "/destino" },
  { label: "Clips", path: "/clips" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar visibilidade
  const { isSnowEnabled, toggleSnow } = useTheme();

  const currentLocation = "Denver";

  return (
    <>
      {/* Container Principal com transição de slide */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-500 ease-in-out supports-[backdrop-filter]:bg-black/60 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* ESQUERDA: LOGO + WIDGET CLIMA */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group mr-4">
                <div className={`p-2 rounded-full transition-colors ${isSnowEnabled ? 'bg-ice-400/20' : 'bg-slate-800'}`}>
                  <Snowflake className={`w-6 h-6 transition-colors ${isSnowEnabled ? 'text-ice-400 animate-pulse' : 'text-slate-500'}`} />
                </div>
                <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-ice-200 to-ice-500 filter drop-shadow-sm">
                  SUBATHON
                </span>
              </Link>

              {/* Widget Clima (Se estiver na Home ou Multilive, mostra. Senão, mostra apenas na Home se preferir) */}
              <div className="hidden sm:block">
                  <WeatherWidget city={currentLocation} />
              </div>
            </div>

            {/* CENTRO/DIREITA: LINKS E TOGGLE */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center space-x-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                        isActive 
                          ? "text-ice-400 bg-ice-400/10 shadow-[0_0_15px_rgba(96,165,250,0.2)]" 
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Botão de Neve (Desktop) */}
              <div className="pl-6 border-l border-white/10">
                <button
                  onClick={toggleSnow}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    isSnowEnabled 
                      ? 'bg-ice-400/20 border-ice-400/50 text-ice-300' 
                      : 'bg-slate-900/50 border-white/10 text-slate-500 hover:text-slate-300'
                  }`}
                  title={isSnowEnabled ? "Desativar Neve" : "Ativar Neve"}
                >
                  {isSnowEnabled ? <CloudSnow size={18} /> : <CloudOff size={18} />}
                  <span className="text-xs font-bold uppercase">{isSnowEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* MOBILE CONTROLS */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleSnow} className="text-slate-500">
                {isSnowEnabled ? <CloudSnow size={20} className="text-ice-400" /> : <CloudOff size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 animate-fade-in">
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      isActive
                        ? "bg-ice-400/20 text-ice-400 border border-ice-400/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* --- BOTÃO DE TOGGLE DO NAVBAR (Aba Puxadora) --- */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-50">
           <button 
             onClick={() => setIsVisible(!isVisible)}
             className="bg-black/80 backdrop-blur-md border border-t-0 border-white/20 text-slate-400 hover:text-ice-400 hover:bg-black w-12 h-6 flex items-center justify-center rounded-b-xl shadow-lg transition-all group"
             title={isVisible ? "Esconder Menu" : "Mostrar Menu"}
           >
             {isVisible ? (
               <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
             ) : (
               <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
             )}
           </button>
        </div>
      </nav>
      
      {/* Botão flutuante caso o menu esteja escondido (Opcional, segurança extra) */}
      {!isVisible && (
        <div className="fixed top-0 left-0 right-0 h-4 z-40 group hover:bg-ice-400/5 transition-colors cursor-pointer" onClick={() => setIsVisible(true)} />
      )}
    </>
  );
}