export default function Footer() {
  return (
    <footer className="w-full py-8 mt-10 border-t border-white/5 bg-black/20 text-center text-slate-500 text-sm">
      <div className="flex flex-col gap-2">
        <p className="font-bold text-slate-400">❄️ SUBATHON 2026 ❄️</p>
        <p>Todos os dados do site são públicos, obtidos através da API oficial da Twitch.</p>
        
        {/* CRÉDITOS DISCRETOS */}
        <p className="mt-4 text-xs opacity-50 hover:opacity-100 transition-opacity duration-300">
          Desenvolvido por{' '}
          <a 
            href="https://www.instagram.com/victorcracco/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-ice-400 border-b border-transparent hover:border-ice-400 transition-colors pb-0.5"
          >
            Victor
          </a>
        </p>
      </div>
    </footer>
  );
}