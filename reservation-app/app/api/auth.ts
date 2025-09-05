import apiRequest from "./client"

export async function login(email: string, password: string) {
  const data = await apiRequest<{ token: string; user: any, header: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  return data.user
}

export async function register(name: string, email: string, password: string) {
  const data = await apiRequest<{ id: number; name: string; email: string; role: string }>("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })

  const user = await login(email, password)
  return user
}

export function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}
