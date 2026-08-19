// Shared localStorage keys so Settings and Opportunities agree on where
// the SAM.gov API key and the user's NAICS profile live. This is a
// client-only app with no backend/database, so localStorage is the only
// persistence layer available.

export const STORAGE_KEYS = {
  SAM_API_KEY: 'bidboss_sam_api_key',
  NAICS_CODES: 'bidboss_naics_codes',
}

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage unavailable (private mode, etc.) — fail silently, the
    // app still works, it just won't remember settings across reloads.
  }
}
