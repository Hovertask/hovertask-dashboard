// src/lib/echo.ts
import Echo from "laravel-echo";
import Reverb from "reverb-client";

// expose Reverb to window for any internals that expect it
(window as any).Reverb = Reverb;

// read token from local storage (app uses `auth_token` elsewhere)
const token = localStorage.getItem("auth_token") || null;

// Reverb / websocket config (use VITE_REVERB_* env vars)
const REVERB_KEY = import.meta.env.VITE_REVERB_APP_KEY || import.meta.env.VITE_PUSHER_APP_KEY || "";
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST || import.meta.env.VITE_PUSHER_HOST || window.location.hostname;
const REVERB_PORT = Number(import.meta.env.VITE_REVERB_PORT || import.meta.env.VITE_PUSHER_PORT || 6001);
const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME || import.meta.env.VITE_PUSHER_SCHEME || (location.protocol === "https:" ? "https" : "http");
const REVERB_PATH = import.meta.env.VITE_REVERB_PATH || "/reverb";

const reverbClient = new Reverb({
  broadcaster: "reverb",
  key: REVERB_KEY,
  wsHost: REVERB_HOST,
  wsPort: REVERB_PORT,
  wssPort: REVERB_PORT,
  wsPath: REVERB_PATH,
  forceTLS: REVERB_SCHEME === "https",
  scheme: REVERB_SCHEME,
  enabledTransports: ["ws", "wss"],
});

export const echo = new Echo({
  broadcaster: "reverb",
  client: reverbClient,
  // Only required for private/authenticated channels:
  auth: {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      : { Accept: "application/json" },
  },
});

export default echo;