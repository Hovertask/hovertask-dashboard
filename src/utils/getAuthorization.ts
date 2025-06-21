export default function getAuthorization() {
	return `Bearer ${localStorage.getItem("auth_token")}`;
}
