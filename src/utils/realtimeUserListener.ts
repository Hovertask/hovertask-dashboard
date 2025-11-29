import { echo } from "../lib/echo";
import refreshUserApi from "./updateUserApi";

export function listenForUserUpdates(
  userId: any,
  onEvent?: (payload: any) => void
) {
  if (!userId || !echo) {
    console.warn("listenForUserUpdates: missing userId or echo not initialized");
    return () => {};
  }

  const publicChannelName = `user.${userId}`;
  //const privateChannelName = `App.Models.User.${userId}`;

  const publicCh = echo.channel(publicChannelName);
  publicCh
    .subscribed(() => {
      console.info(`Subscribed to public channel: ${publicChannelName}`);
    })
    .error((err: any) => {
      console.error(`Subscription error on ${publicChannelName}:`, err);
    });

  /*let privateCh: any = null;
  try {
    privateCh = echo.private(privateChannelName);
    privateCh.subscribed(() => {
      console.info(`Subscribed to private channel: ${privateChannelName}`);
    });
    privateCh.error((err: any) => {
      console.error(`Subscription error on ${privateChannelName}:`, err);
    });
  } catch (e) {
    console.warn("Failed to subscribe to private notifications channel:", e);
  }*/

  const walletHandler = async (payload: any) => {
    console.log("Realtime wallet-updated received:", payload);
    try {
      await refreshUserApi();; // original logicawait refreshUserA
     
      console.info("User reload after wallet update successful");
    } catch (err) {
      console.error("Failed to refresh user after wallet update:", err);
    }

    if (onEvent) onEvent({ type: "wallet-updated", payload });
  };

  /*const notificationHandler = (notification: any) => {
    console.log("Realtime Laravel Notification received:", notification);
    if (onEvent) onEvent({ type: "notification", payload: notification });
  };*/

  try {
    publicCh.listen(".wallet-updated", walletHandler);
    publicCh.listen("wallet-updated", walletHandler);
  } catch (e) {
    console.error("Failed to attach wallet-updated listeners on public channel:", e);
  }

  /*if (privateCh) {
    try {
      privateCh.notification(notificationHandler);

      privateCh.listen(
        ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
        (e: any) => {
          console.log("BroadcastNotificationCreated event payload:", e);
        }
      );
    } catch (e) {
      console.error("Failed to attach notification listeners on private channel:", e);
    }
  }*/

  return () => {
    try {
      publicCh.stopListening(".wallet-updated");
      publicCh.stopListening("wallet-updated");
      echo.leaveChannel(publicChannelName);
    } catch (e) {
      console.warn("Error cleaning up public channel listeners", e);
    }

    /*if (privateCh) {
      try {
        privateCh.stopListening(
          ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated"
        );
        echo.leaveChannel(privateChannelName);
      } catch (e) {
        console.warn("Error cleaning up private channel listeners", e);
      }
    }*/
  };
}
