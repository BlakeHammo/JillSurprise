// Strip trailing slash from the base URL so paths like /api/entries always work.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const api = {
  /** Verify admin password. Returns { success: boolean } */
  auth: (password) =>
    fetch(`${BASE}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }).then((r) => r.json()),

  /** Fetch all entries, sorted by date desc. */
  getEntries: () => fetch(`${BASE}/api/entries`).then((r) => r.json()),

  /** Upload a new entry. formData should include file + metadata fields. */
  createEntry: (formData, password) =>
    fetch(`${BASE}/api/entries`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${password}` },
      body: formData,
    }).then((r) => r.json()),

  /** Delete an entry by id. */
  deleteEntry: (id, password) =>
    fetch(`${BASE}/api/entries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${password}` },
    }).then((r) => r.json()),

  /** Build the URL for a stored media file. */
  mediaUrl: (filename) => `${BASE}/uploads/${filename}`,
};
