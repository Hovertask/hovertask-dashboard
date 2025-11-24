// src/lib/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// pusher-js may export as default in some bundlers — support both
const PusherConstructor: any = (Pusher as any)?.default ?? Pusher;

// expose Pusher globally so Echo can access it
(window as any).Pusher = PusherConstructor;

// read token from local storage (app uses `auth_token` elsewhere)
const token = localStorage.getItem('auth_token') || null;

// Use Reverb server host/port/path but connect with the Pusher JS client
// (this works if your Reverb server implements the Pusher protocol)
const WS_HOST = import.meta.env.VITE_REVERB_HOST || import.meta.env.VITE_PUSHER_HOST || window.location.hostname;
const WS_PORT = Number(import.meta.env.VITE_REVERB_PORT || import.meta.env.VITE_PUSHER_PORT || 6001);
const WS_PATH = import.meta.env.VITE_REVERB_PATH || import.meta.env.VITE_PUSHER_PATH || '/reverb';
const WS_SCHEME = import.meta.env.VITE_REVERB_SCHEME || import.meta.env.VITE_PUSHER_SCHEME || (location.protocol === 'https:' ? 'https' : 'http');
const FORCE_TLS = WS_SCHEME === 'https';
//const PUSHER_KEY = import.meta.env.VITE_PUSHER_APP_KEY || import.meta.env.VITE_REVERB_APP_KEY || 'local';

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: WS_HOST,
  wsPort: WS_PORT,
  wssPort: WS_PORT,
  wsPath: WS_PATH,
  forceTLS: FORCE_TLS,
  enabledTransports: ['ws', 'wss'],
  auth: {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      : { Accept: 'application/json' },
  },
});

export default echo;