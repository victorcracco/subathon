// Integração segura usando Client Credentials Flow
const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;

async function getAccessToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
    method: 'POST',
    cache: 'no-store' // Sempre pegar token novo se necessário
  });
  const data = await res.json();
  return data.access_token;
}

export async function getLiveStatus(userLogins: string[]) {
  const token = await getAccessToken();
  const query = userLogins.map(u => `user_login=${u}`).join('&');
  
  const res = await fetch(`https://api.twitch.tv/helix/streams?${query}`, {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${token}`
    },
    next: { revalidate: 60 } // Cache por 60s
  });
  
  return res.json();
}

export async function getTopClips(broadcasterIds: string[]) {
   // Lógica similar para endpoint /clips
   // Kick não possui API pública oficial estável para clips, usaremos mock ou placeholder.
}