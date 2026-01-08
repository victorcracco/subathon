"use server";

// Cache simples para token
let accessToken = '';
let tokenExpiry = 0;

// Gera o Token de acesso
async function getTwitchToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
      method: 'POST',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!data.access_token) throw new Error('Falha ao pegar token');

    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error("Erro Twitch Token:", error);
    return null;
  }
}

// 1. Busca Lives Online (Status e Viewers)
export async function getTwitchStreams(userLogins: string[]) {
  const token = await getTwitchToken();
  if (!token) return [];

  const query = userLogins.map(u => `user_login=${u}`).join('&');

  try {
    const res = await fetch(`https://api.twitch.tv/helix/streams?${query}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
      next: { revalidate: 30 }
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro Twitch Streams:", error);
    return [];
  }
}

// 2. Busca Dados do Usuário (Avatar e ID Numérico)
export async function getTwitchUsers(userLogins: string[]) {
  const token = await getTwitchToken();
  if (!token) return [];

  const query = userLogins.map(u => `login=${u}`).join('&');

  try {
    const res = await fetch(`https://api.twitch.tv/helix/users?${query}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
      next: { revalidate: 86400 } // Cache de 24h (Avatar muda pouco)
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro Twitch Users:", error);
    return [];
  }
}

// 3. Busca Clips (ATUALIZADO: Aceita dias dinâmicos e busca 100 clips)
export async function getTwitchClips(broadcasterIds: string[], days: number) {
  const token = await getTwitchToken();
  if (!token) return [];

  // Calcular data de início baseada nos dias passados
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startedAt = startDate.toISOString();

  try {
    const requests = broadcasterIds.map(id => 
      // Mudanças aqui: first=100 e started_at dinâmico
      fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=100&started_at=${startedAt}`, {
        headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
        next: { revalidate: 60 } // Cache reduzido para 1 min para atualizar mais rápido
      }).then(r => r.json())
    );

    const results = await Promise.all(requests);
    
    // Junta todos os clips em um array único e ordena por views
    const allClips = results.flatMap(r => r.data || []);
    return allClips.sort((a: any, b: any) => b.view_count - a.view_count);

  } catch (error) {
    console.error("Erro Twitch Clips:", error);
    return [];
  }
}