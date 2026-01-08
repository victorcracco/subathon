"use client";

import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, MapPin, AlertCircle } from 'lucide-react';

interface WeatherProps {
  city: string;
}

export default function WeatherWidget({ city }: WeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      if (!city) return;

      try {
        setLoading(true);
        setError(false);
        console.log(`Buscando clima para: ${city}...`);
        
        // 1. Busca Latitude/Longitude (Geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            console.error("Cidade não encontrada na API.");
            setError(true);
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // 2. Busca Clima (Weather Forecast)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        setWeather({
            temp: weatherData.current_weather.temperature,
            code: weatherData.current_weather.weathercode,
            cityName: name
        });

      } catch (err) {
        console.error("Erro ao conectar com a API de clima:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city]);

  // Ícones baseados no WMO Code
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun size={16} className="text-yellow-500" />;
    if (code === 2 || code === 3) return <Cloud size={16} className="text-slate-400" />;
    if (code >= 45 && code <= 48) return <Cloud size={16} className="text-slate-500" />;
    if (code >= 51 && code <= 67) return <CloudRain size={16} className="text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={16} className="text-white" />;
    if (code >= 80 && code <= 82) return <CloudRain size={16} className="text-blue-500" />;
    if (code >= 95) return <CloudLightning size={16} className="text-yellow-400" />;
    return <Sun size={16} className="text-slate-300" />;
  };

  // Estado de Carregamento
  if (loading) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ml-4 animate-pulse">
        <MapPin size={14} className="text-slate-500" />
        <span className="text-xs font-bold text-slate-500 uppercase">{city}</span>
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
      </div>
    );
  }

  // Estado de Erro (Mostra algo discreto em vez de crashar)
  if (error || !weather) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 ml-4" title="Não foi possível carregar o clima">
        <MapPin size={14} className="text-red-400" />
        <span className="text-xs font-bold text-red-400 uppercase">{city}</span>
        <AlertCircle size={14} className="text-red-400" />
      </div>
    );
  }

  // Estado Sucesso
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-ice-400/30 transition-colors ml-4 group cursor-default">
      <div className="flex items-center gap-1.5 text-ice-400 border-r border-white/10 pr-2 mr-2">
        <MapPin size={14} />
        <span className="text-xs font-black uppercase tracking-wider text-white group-hover:text-ice-300 transition-colors">
            {weather.cityName}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {getWeatherIcon(weather.code)}
        <span className="text-xs font-bold text-white">{Math.round(weather.temp)}°C</span>
      </div>
    </div>
  );
}