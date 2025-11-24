// src/features/notifications/listenForUserUpdates.js
import { echo } from "../lib/echo"; // adjust path to your echo file
import updateUserApi from "./updateUserApi";

/**
 * Listen for realtime events for a user and optionally notify the caller via callback.
 * Returns a cleanup function to stop listening.
 */
export function listenForUserUpdates(userId: any, onEvent?: (payload: any) => void) {
  if (!userId || !echo) return () => {};

  const channelName = `user.${userId}`;

  // Use public channel unless your server uses private/presence channels
  const ch = echo.channel(channelName);

  const walletHandler = async (payload: any) => {
    try {
      await updateUserApi(); // re-fetch user from your API
    } catch (err) {
      console.error("Failed to update user after wallet update", err);
    }
    if (onEvent) onEvent({ type: "wallet-updated", payload });
  };

  const genericHandler = (payload: any) => {
    // attempt to refresh user data when relevant
    // caller can decide how to handle the payload
    if (onEvent) onEvent({ type: "notification", payload });
  };

  // listen to common event names (server may use either)
  ch.listen('.wallet-updated', walletHandler);
  ch.listen('wallet-updated', walletHandler);
  ch.listen('.notification', genericHandler);
  ch.listen('notification', genericHandler);

  // Return cleanup function (use in useEffect)
  return () => {
    try {
      ch.stopListening('.wallet-updated');
      ch.stopListening('wallet-updated');
      ch.stopListening('.notification');
      ch.stopListening('notification');
      // leave the channel too
      echo.leaveChannel(channelName);
    } catch (e) {
      // ignore cleanup errors
    }
  };
}