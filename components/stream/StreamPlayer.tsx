"use client";
import { useEffect, useState } from 'react';

interface PlayerProps {
  channel: string;
  platform: 'twitch' | 'kick';
  muted?: boolean;
}

export default function StreamPlayer({ channel, platform, muted = true }: PlayerProps) {
  const [parentQuery, setParentQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname; // Retorna "localhost" ou "192.168.0.110"
      
      // Lista segura de domínios. 
      // Se você estiver no localhost, só precisamos dele.
      // Se estiver no IP, precisamos do IP.
      const domains = new Set(['localhost']);
      
      if (hostname !== 'localhost') {
        domains.add(hostname);
      }

      // Converte para string: parent=localhost&parent=192.168.0.110
      const query = Array.from(domains).map(d => `parent=${d}`).join('&');
      setParentQuery(query);
      
      // Debug no console para você ver o que está sendo gerado
      console.log('Twitch Player Parent:', query);
    }
  }, []);

  if (platform === 'twitch' && !parentQuery) {
    return <div className="w-full h-full bg-black flex items-center justify-center text-slate-500">Carregando Player...</div>;
  }

  return (
    <div className="relative w-full h-full bg-black">
      {platform === 'twitch' ? (
        <iframe
          src={`https://player.twitch.tv/?channel=${channel}&${parentQuery}&muted=${muted}&autoplay=true`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen" 
        />
      ) : (
        <iframe
          src={`https://player.kick.com/${channel}`}
          className="w-full h-full"
          allowFullScreen
        />
      )}
    </div>
  );
}