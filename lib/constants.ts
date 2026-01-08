export const CHANNELS = [
  { id: 'sheviiioficial', name: 'Shevchenko', platform: 'twitch' },
  { id: 'jonvlogs', name: 'Jon Vlogs', platform: 'twitch' },
  { id: 'linsjr', name: 'Lins', platform: 'twitch' },
  { id: 'stereonline', name: 'Stereo', platform: 'kick' },
] as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'localhost';