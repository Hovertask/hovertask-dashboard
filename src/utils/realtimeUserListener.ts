import { echo } from "../lib/echo";
import { refreshUserApi } from "./updateUserApi";

export function listenForUserUpdates(userId: number) {
    echo.channel(`user.${userId}`)
        .listen("wallet-updated", async () => {
            await refreshUserApi(); // 👈 re-fetch the API only
        });
}
