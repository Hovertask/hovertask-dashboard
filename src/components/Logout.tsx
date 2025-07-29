export default function Logout() {
	localStorage.removeItem("auth_token");
	window.location.reload();
	return null;
}
