import type { PlayerProgress, CaseRecord, Ability } from "../types/types";

const STORAGE_KEY = "dtrc-progress";

// 초기 상태 (처음 시작하는 플레이어)
function createInitialProgress(nickname: string): PlayerProgress {
  return {
    nickname,
    caseRecords: [],
    unlockedDays: [1], // Day 1만 열린 상태로 시작
    abilities: {
      threatDetection: 0,
      verification: 0,
      privacy: 0,
      response: 0,
      criticalThinking: 0,
    },
  };
}

// 저장하기
export function saveProgress(progress: PlayerProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// 불러오기 (없으면 null)
export function loadProgress(): PlayerProgress | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  return JSON.parse(raw);
}

// 새 게임 시작
export function startNewGame(nickname: string): PlayerProgress {
  const fresh = createInitialProgress(nickname);
  saveProgress(fresh);
  return fresh;
}

// 진행 기록 초기화 (개발용)
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// 사건 결과 기록 (최고 별만 유지)
export function recordCaseResult(
  record: CaseRecord,
  earnedAbilities: Ability[]
): PlayerProgress {
  const progress = loadProgress() ?? startNewGame("분석관");

  const existing = progress.caseRecords.find((r) => r.caseId === record.caseId);
  if (!existing || record.stars > existing.stars) {
    progress.caseRecords = progress.caseRecords.filter((r) => r.caseId !== record.caseId);
    progress.caseRecords.push(record);

    // 능력치는 '최고 기록 갱신 시'에만, 별 차이만큼 누적
    const prevStars = existing?.stars ?? 0;
    const gained = record.stars - prevStars;
    for (const ability of earnedAbilities) {
      progress.abilities[ability] += gained * 10;
    }
  }

  saveProgress(progress);
  return progress;
}

// Day 클리어 여부 판정 + 다음 Day 해금
// (Day의 모든 사건을 별 1개 이상으로 깨면 다음 Day 오픈)
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