"use client";

import { Inter } from 'next/font/google';
import { useTheme } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SnowParticles from '@/components/effects/SnowParticles';
import FrostOverlay from '@/components/effects/FrostOverlay';

const inter = Inter({ subsets: ['latin'] });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSnowEnabled } = useTheme();

  return (
    <body className={`${inter.className} min-h-screen overflow-x-hidden text-slate-100 selection:bg-ice-400 selection:text-black`}>
      {/* Renderização Condicional da Neve */}
      {isSnowEnabled && <SnowParticles />}
      <FrostOverlay />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-10 min-h-[calc(100vh-80px)]">
        {children}
      </main>
      
      <Footer />
    </body>
  );
}