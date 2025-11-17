import Echo from "laravel-echo";

export const echo = new Echo({
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
