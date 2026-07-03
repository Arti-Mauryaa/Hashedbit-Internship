const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      (body && Array.isArray(body.errors) && body.errors.join(' ')) ||
      (body && body.message) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export async function fetchAppointments(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  const url = `${API_BASE_URL}/appointments${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchAppointment(id) {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}`);
  return handleResponse(res);
}

export async function createAppointment(payload) {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateAppointment(id, payload) {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateAppointmentStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteAppointment(id) {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
