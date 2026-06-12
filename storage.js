const KEY = 'caliperometry_clients';

export function loadClients() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveClients(clients) {
  try {
    localStorage.setItem(KEY, JSON.stringify(clients));
  } catch (e) {
    console.warn('localStorage unavailable', e);
  }
}
