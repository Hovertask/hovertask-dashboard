import getAuthUser from "./getAuthUser";
import store from "../redux/store";
import { setAuthUser } from "../redux/slices/auth";

export default async function refreshUserApi() {
  try {
    console.log("🔄 Refreshing /dashboard/user ...");

    // fetch updated user
    const updated = await getAuthUser();

    if (updated) {
      console.log("✅ Updated user:", updated);

      // 🔥 THIS IS THE IMPORTANT FIX →
      // Update Redux so UI re-renders everywhere
      store.dispatch(setAuthUser(updated));
    }

    return updated;
  } catch (e) {
    console.error("Failed to refresh user", e);
  }
}
