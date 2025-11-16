import { echo } from "../lib/echo";
import  updateUserApi  from "./updateUserApi";

export function listenForUserUpdates(userId: number) {
    echo.channel(`user.${userId}`)
        .listen("wallet-updated", async () => {
            await updateUserApi(); // 👈 re-fetch the API only
        });
}
