const AUTH_KEY = "barbearia:auth:v1";

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; }
}

export function login(username, password) {
  // Demo simples. Trocar por backend depois.
  if (username === "admin" && password === "admin") {
    const session = { username, at: new Date().toISOString() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
