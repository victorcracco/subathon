"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  isSnowEnabled: boolean;
  toggleSnow: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Começa com true, mas tenta ler do localStorage depois
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);

  useEffect(() => {
    // Recupera a preferência do usuário ao carregar
    const storedPreference = localStorage.getItem('isSnowEnabled');
    if (storedPreference !== null) {
      setIsSnowEnabled(storedPreference === 'true');
    }
  }, []);

  const toggleSnow = () => {
    setIsSnowEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('isSnowEnabled', String(newValue)); // Salva a preferência
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isSnowEnabled, toggleSnow }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o contexto facilmente
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}