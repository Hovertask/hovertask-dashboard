import Echo from "laravel-echo";

export const echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: "backend.hovertask.com",
    wsPort: 443,
    wssPort: 443,
    wsPath: "/reverb",
    forceTLS: true,
});
