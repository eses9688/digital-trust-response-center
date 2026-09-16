const STORAGE_KEY = "dtrc.collectedCards";

export function loadCollectedCards(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCollectedCard(episodeId: string): void {
  const current = loadCollectedCards();
  if (current.includes(episodeId)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, episodeId]));
}
