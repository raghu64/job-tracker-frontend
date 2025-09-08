import { AuthUser } from "../types/models";

// Define the auth user key
const AUTH_USER_KEY = "authUser";


// Get auth user from storage
export function getAuthUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Validate user structure if needed
    if (!parsed.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

// Set auth user to storage
export function setAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Remove auth user from storage
export function removeAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}
