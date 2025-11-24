// src/features/notifications/listenForUserUpdates.ts
import { echo } from "../lib/echo";
import updateUserApi from "./updateUserApi";

/**
 * Listen for realtime events for a user and optionally notify the caller via callback.
 * Returns a cleanup function to stop listening.
 */
export function listenForUserUpdates(
  userId: any,
  onEvent?: (payload: any) => void
) {
  if (!userId || !echo) {
    console.warn("listenForUserUpdates: missing userId or echo not initialized");
    return () => {};
  }

  const publicChannelName = `user.${userId}`; // your UserWalletUpdated event
  const privateChannelName = `App.Models.User.${userId}`; // Laravel Notification private channel

  // Public event channel (server uses Channel("user.{id}"))
  const publicCh = echo.channel(publicChannelName);
  publicCh
    .subscribed(() => {
      console.info(`Subscribed to public channel: ${publicChannelName}`);
    })
    .error((err: any) => {
      console.error(`Subscription error on ${publicChannelName}:`, err);
    });

  // Private notifications channel - will hit broadcasting/auth (if using private)
  let privateCh: any = null;
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
  }

  const walletHandler = async (payload: any) => {
    console.log("Realtime wallet-updated received:", payload);
    try {
      await updateUserApi();
      console.info("User reload after wallet update successful");
    } catch (err) {
      console.error("Failed to refresh user after wallet update:", err);
      // optionally forward this error to a remote logging endpoint
    }
    if (onEvent) onEvent({ type: "wallet-updated", payload });
  };

  const notificationHandler = (notification: any) => {
    console.log("Realtime Laravel Notification received:", notification);
    if (onEvent) onEvent({ type: "notification", payload: notification });
  };

  // listen to server event name set via broadcastAs('wallet-updated')
  try {
    publicCh.listen(".wallet-updated", walletHandler);
    publicCh.listen("wallet-updated", walletHandler);
  } catch (e) {
    console.error("Failed to attach wallet-updated listeners on public channel:", e);
  }

  // listen for Laravel Notifications broadcast to private channel
  if (privateCh) {
    try {
      // built-in Notification helper on Echo
      privateCh.notification(notificationHandler);

      // also listen for low-level BroadcastNotificationCreated shape if needed
      privateCh.listen(
        ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
        (e: any) => {
          console.log("BroadcastNotificationCreated event payload:", e);
        }
      );
    } catch (e) {
      console.error("Failed to attach notification listeners on private channel:", e);
    }
  }

  // Return cleanup function (use in useEffect)
  return () => {
    try {
      publicCh.stopListening(".wallet-updated");
      publicCh.stopListening("wallet-updated");
      echo.leaveChannel(publicChannelName);
    } catch (e) {
      console.warn("Error cleaning up public channel listeners", e);
    }

    if (privateCh) {
      try {
        privateCh.stopListening(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated");
        // stop notification listeners — Echo doesn't expose stopListening for .notification, so leaving channel is enough
        echo.leaveChannel(privateChannelName);
      } catch (e) {
        console.warn("Error cleaning up private channel listeners", e);
      }
    }
  };
}