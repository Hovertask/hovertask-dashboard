import getAuthUser from "./getAuthUser";

export default async function refreshUserApi() {
    try {
        console.log("🔄 Refreshing /dashboard/user ...");
        const updated = await getAuthUser();
        console.log("✅ Updated user:", updated);
        return updated;
    } catch (e) {
        console.error("Failed to refresh user", e);
    }
}
