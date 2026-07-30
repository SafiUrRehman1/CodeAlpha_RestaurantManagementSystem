import { jwtDecode } from "jwt-decode";

export function saveToken(token) {
    localStorage.setItem("token", token);
}
export function getToken() {
    return localStorage.getItem("token");
}

export function removeToken() {
    localStorage.removeItem("token");
}

export function getUser() {
    const token = getToken();

    if (!token) return null;

    try {
        const user = jwtDecode(token);

        if (user.exp * 1000 < Date.now()) {
            removeToken();
            return null;
        }

        return user;
    } catch {
        return null;
    }
}

export function getRole() {
    const user = getUser();

    if (!user) return null;

    return user[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
}
export function isLoggedIn() {
    return !!getToken();
}