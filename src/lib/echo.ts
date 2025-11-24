// src/lib/echo.js
import Echo from 'laravel-echo';


// Optional: token if you use token auth for private channels
const token = localStorage.getItem('auth_token') || null;

const reverbClient = new Echo({
  broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    wsPath: "/reverb",
    forceTLS: true,
    scheme: import.meta.env.VITE_REVERB_SCHEME,
    enabledTransports: ["ws", "wss"],
});

export const echo = new Echo({
  broadcaster: 'reverb',
  client: reverbClient,
  // Only required for private/authenticated channels:
  auth: {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      : { Accept: 'application/json' },
  },
  // debugging
  // enableConsoleLogger: true, // depends on Echo wrapper, optional
});

export default echo;