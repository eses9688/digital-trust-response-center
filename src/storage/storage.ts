import type { PlayerProgress, StageRecord, Ability } from "../types/types";

const STORAGE_KEY = "dtrc-progress";

// 초기 상태 (처음 시작하는 플레이어)
function createInitialProgress(nickname: string): PlayerProgress {
  return {
    nickname,
    stageRecords: [],
    unlockedStages: [1], // Stage 1만 열린 상태로 시작
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

export function recordStageResult(
  record: StageRecord,
  earnedAbilities: Ability[]
): PlayerProgress {
  const progress = loadProgress() ?? startNewGame("분석관");

  // 기존 기록 찾기 (최고 별만 유지)
  const existing = progress.stageRecords.find((r) => r.stageId === record.stageId);
  if (!existing || record.stars > existing.stars) {
    progress.stageRecords = progress.stageRecords.filter((r) => r.stageId !== record.stageId);
    progress.stageRecords.push(record);
  }

  // 클리어 시 다음 Stage 해금 (별 1개 이상)
  if (record.stars >= 1) {
    const next = record.stageId + 1;
    if (!progress.unlockedStages.includes(next) && next <= 7) {
      progress.unlockedStages.push(next);
    }
  }

  // 능력치 누적 (별 1개당 해당 능력 +10)
  for (const ability of earnedAbilities) {
    progress.abilities[ability] += record.stars * 10;
  }

  saveProgress(progress);
  return progress;
}

// clr 함수
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}