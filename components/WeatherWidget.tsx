"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, MapPin, Clock } from "lucide-react";

interface WeatherWidgetProps {
  city: string;
}

export default function WeatherWidget({ city }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    // 1. Busca Lat/Lon da Cidade
    async function fetchData() {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) return;

        const { latitude, longitude, name } = geoData.results[0];

        // 2. Busca Clima + Fuso Horário (timezone)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        const weatherData = await weatherRes.json();

        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          code: weatherData.current.weather_code,
          city: name,
          timezone: weatherData.timezone, // Pegamos o fuso exato (ex: America/New_York)
        });
      } catch (error) {
        console.error("Erro ao buscar clima/hora:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [city]);

  // 3. Atualiza o relógio a cada segundo baseado no Fuso da cidade
  useEffect(() => {
    if (!weather?.timezone) return;

    const updateTime = () => {
      const now = new Date();
      // Formata a hora para o fuso horário da cidade pesquisada
      const timeString = now.toLocaleTimeString("pt-BR", {
        timeZone: weather.timezone,
        hour: "2-digit",
        minute: "2-digit",
      });
      setLocalTime(timeString);
    };

    updateTime(); // Atualiza na hora
    const interval = setInterval(updateTime, 1000); // E depois a cada 1s

    return () => clearInterval(interval);
  }, [weather]);

  if (loading) return <div className="animate-pulse bg-white/10 w-32 h-8 rounded-full" />;

  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all hover:bg-black/60">
      
      {/* Localização */}
      <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
        <MapPin size={14} className="text-ice-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {weather.city}
        </span>
      </div>

      {/* Horário Local */}
      {localTime && (
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
          <Clock size={14} className="text-ice-300" />
          <span className="text-xs font-mono font-bold text-ice-100">
            {localTime}
          </span>
        </div>
      )}

      {/* Temperatura */}
      <div className="flex items-center gap-1.5">
        <Sun size={14} className="text-yellow-400" />
        <span className="text-xs font-bold text-white">
          {weather.temp}°C
        </span>
      </div>
    </div>
  );
}