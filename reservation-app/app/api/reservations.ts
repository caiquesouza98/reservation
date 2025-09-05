import apiRequest from "./client";

export async function getReservas(params: Record<string, any> = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
  );
  const query = new URLSearchParams(cleanParams).toString();
  return apiRequest(`/reservas${query ? "?" + query : ""}`);
}

export async function createReserva(roomId: number, startDate: string, endDate: string) {
  return apiRequest("/reservas", {
    method: "POST",
    body: JSON.stringify({ roomId, startDate, endDate }),
  });
}

export async function updateReserva(id: number, data: Partial<{ startDate: string; endDate: string }>) {
  return apiRequest(`/reservas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteReserva(id: number) {
  return apiRequest(`/reservas/${id}`, {
    method: "DELETE",
  });
}

export async function createRecorrencia(
  roomId: number,
  startDate: string,
  endDate: string,
  frequency: "daily" | "weekly",
  occurrences: number
) {
  return apiRequest("/reservas/recorrencia", {
    method: "POST",
    body: JSON.stringify({ roomId, startDate, endDate, frequency, occurrences }),
  });
}
