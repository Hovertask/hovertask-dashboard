// src/lib/echo.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// pusher-js may export as default in some bundlers — support both
const PusherConstructor: any = (Pusher as any)?.default ?? Pusher;

// expose Pusher globally so Echo can access it
(window as any).Pusher = PusherConstructor;

// read token from local storage (app uses `auth_token` elsewhere)
const token = localStorage.getItem("auth_token") || null;

// Use Reverb server host/port/path but connect with the Pusher JS client
const WS_HOST =
  import.meta.env.VITE_REVERB_HOST ||
  import.meta.env.VITE_PUSHER_HOST ||
  window.location.hostname;
const WS_PORT = Number(
  import.meta.env.VITE_REVERB_PORT ||
    import.meta.env.VITE_PUSHER_PORT ||
    6001
);
const WS_PATH =
  import.meta.env.VITE_REVERB_PATH ||
  import.meta.env.VITE_PUSHER_PATH ||
  "/reverb";
const WS_SCHEME =
  import.meta.env.VITE_REVERB_SCHEME ||
  import.meta.env.VITE_PUSHER_SCHEME ||
  (location.protocol === "https:" ? "https" : "http");
const FORCE_TLS = WS_SCHEME === "https";

export const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: WS_HOST,
  wsPort: WS_PORT,
  wssPort: WS_PORT,
  wsPath: WS_PATH,
  forceTLS: FORCE_TLS,
  enabledTransports: ["ws", "wss"],
  auth: {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      : { Accept: "application/json" },
  },
});

// ---- Logging helpers ----
function safeBindPusher(fn: (pusher: any) => void) {
  try {
    // Echo connector shape differs across builds, guard it
    const connector: any = (echo as any).connector;
    const pusher = connector && (connector as any).pusher;
    if (pusher) {
      fn(pusher);
    } else {
      console.warn("Echo connector/pusher not available for binding logs.");
    }
  } catch (e) {
    console.warn("Error while attempting to bind pusher logs:", e);
  }
}

// bind some pusher connection events for debug
safeBindPusher((pusher) => {
  // connection state changes
  pusher.connection.bind("state_change", (states: any) => {
    console.log("WS state change", states);
  });

  pusher.connection.bind("connected", () => {
    console.info("WebSocket connected (pusher/reverb).");
  });

  pusher.connection.bind("disconnected", () => {
    console.warn("WebSocket disconnected (pusher/reverb).");
  });

  pusher.connection.bind("error", (err: any) => {
    console.error("WebSocket error (pusher/reverb):", err);
  });

  // subscription error happens when auth fails for private channels
  pusher.connection.bind("failed", (err: any) => {
    console.error("Pusher connection failed:", err);
  });

  // Also log subscription errors globally
  pusher.bind_global &&
    pusher.bind_global &&
    typeof pusher.bind_global === "function" &&
    pusher.bind_global((event: string, data: any) => {
      // pusher.bind_global is not always available; this is defensive
      // avoid noisy output in prod — you can gate it by env if needed
       console.debug("PUSHER GLOBAL EVENT:", event, data);
    });
});

export default echo;