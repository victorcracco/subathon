"use client";

import { useEffect, useState } from "react";

// Definimos o tipo para cada floco de neve
interface Snowflake {
  id: number;
  top: string;
  left: string;
  width: string;
  height: string;
  animationDuration: string;
}

export default function SnowParticles() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Essa lógica só roda no navegador, resolvendo o erro de hidratação
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
    }));
    
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-30 animate-snow"
          style={{
            top: flake.top,
            left: flake.left,
            width: flake.width,
            height: flake.height,
            animationDuration: flake.animationDuration,
          }}
        />
      ))}
    </div>
  );
}