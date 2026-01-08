"use client";

export default function FrostOverlay() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {/* Vinheta de Gelo (Bordas Brancas/Azuladas) */}
      <div 
        className="absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle at center, transparent 50%, rgba(130, 200, 255, 0.2) 80%, rgba(200, 230, 255, 0.5) 100%)'
        }}
      />
      
      {/* Textura de Ruído (Granulação de gelo) */}
      <div className="absolute inset-0 opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Brilho Superior (Reflexo do Sol na Neve) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-ice-400/10 blur-[100px] rounded-full" />
    </div>
  );
}