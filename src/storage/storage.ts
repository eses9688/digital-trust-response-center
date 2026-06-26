import type { PlayerProgress, CaseRecord, Ability } from "../types/types";

const STORAGE_KEY = "dtrc-progress";

function createInitialProgress(nickname: string): PlayerProgress {
  return {
    nickname,
    caseRecords: [],
    unlockedDays: [1],
    collectedCards: [],
    abilities: {
      threatDetection: 0,
      verification: 0,
      privacy: 0,
      response: 0,
      criticalThinking: 0,
    },
  };
}

export function saveProgress(progress: PlayerProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function loadProgress(): PlayerProgress | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  return JSON.parse(raw);
}

export function startNewGame(nickname: string): PlayerProgress {
  const fresh = createInitialProgress(nickname);
  saveProgress(fresh);
  return fresh;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function recordCaseResult(
  record: CaseRecord,
  earnedAbilities: Ability[]
): PlayerProgress {
  const progress = loadProgress() ?? startNewGame("분석관");

  const existing = progress.caseRecords.find((r) => r.caseId === record.caseId);
  if (!existing || record.stars > existing.stars) {
    progress.caseRecords = progress.caseRecords.filter((r) => r.caseId !== record.caseId);
    progress.caseRecords.push(record);

    const prevStars = existing?.stars ?? 0;
    const gained = record.stars - prevStars;
    for (const ability of earnedAbilities) {
      progress.abilities[ability] += gained * 10;
    }
  }

  saveProgress(progress);
  return progress;
}

// 학습 카드 수집. 새로 얻은 카드면 true 반환 (팝업 연출용)
export function collectCard(caseId: string): boolean {
  const progress = loadProgress() ?? startNewGame("분석관");
  if (progress.collectedCards.includes(caseId)) {
    return false; // 이미 가진 카드
  }
  progress.collectedCards.push(caseId);
  saveProgress(progress);
  return true; // 새 카드!
}

export function checkDayClear(dayId: number, caseIds: string[]): PlayerProgress {
  const progress = loadProgress() ?? startNewGame("분석관");
  const allCleared = caseIds.every((cid) => {
    const rec = progress.caseRecords.find((r) => r.caseId === cid);
    return rec && rec.stars >= 1;
  });
  if (allCleared) {
    const nextDay = dayId + 1;
    if (!progress.unlockedDays.includes(nextDay) && nextDay <= 7) {
      progress.unlockedDays.push(nextDay);
      saveProgress(progress);
    }
  }
  return progress;
}