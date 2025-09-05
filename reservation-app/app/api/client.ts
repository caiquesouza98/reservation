const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  return response.json();
}

export default apiRequest;
