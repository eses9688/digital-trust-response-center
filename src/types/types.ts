// ===== 콘텐츠 타입 (게임 데이터) =====

export type Ability =
  | "threatDetection"
  | "verification"
  | "privacy"
  | "response"
  | "criticalThinking";

export type Evidence = {
  id: string;
  title: string;
  type: "text" | "url" | "compare" | "hidden";
  content: string;
  isKey: boolean;
  meta?: {
    realDomain?: string;
    suspiciousPart?: string;
    compareLeft?: string;
    compareRight?: string;
    diffPoints?: string[];
    hiddenReason?: string;
  };
};

export type Choice = {
  id: string;
  text: string;
  isCorrect: boolean; // 사건 해결(⭐) 판정 — 정답 대응인가
  isBest: boolean; // 최적 대응(⭐⭐⭐) 판정 — 가장 좋은 선택인가
  hint: string;
};

// 메시지를 이루는 조각: 일반 텍스트 or 클릭 가능한 단서
export type MessageSegment =
  | { kind: "text"; text: string }
  | { kind: "clue"; text: string; evidenceId: string };

// 비교 영상 한 쪽
export type CompareSource = {
  label: string; // "공식 채널 인터뷰" / "문제의 광고 영상"
  caption: string; // 영상 자리에 들어갈 설명 (나중에 이미지로 교체)
  isFake: boolean; // 이쪽이 가짜인가
};

// 비교에서 찾아야 할 차이점 (클릭 단서)
export type CompareClue = {
  evidenceId: string; // 연결되는 evidence
  label: string; // "입모양" / "눈 깜빡임"
  normalDesc: string; // 정상 쪽 설명
  fakeDesc: string; // 가짜 쪽 설명 (이게 수상함)
};

export type VictimScene = {
  format: "sms" | "kakao" | "email" | "video" | "sns";
  segments?: MessageSegment[]; // 메시지형 (Stage 1~3)
  compare?: {
    // 비교형 (Stage 4)
    left: CompareSource;
    right: CompareSource;
    clues: CompareClue[];
  };
};

export type Learning = {
  realCase: string;
  prevention: string;
  reference: string;
};

// 사건 하나 (기존 Stage)
export type Case = {
  id: string; // "d1-c1" 같은 고유 id
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  briefing: string;
  victim: VictimScene;
  evidences: Evidence[];
  choices: Choice[];
  learning: Learning;
  starWeights: Ability[];
  starRules: { keyEvidenceNeeded: number };
};

// Day (Module) — 사건 묶음
export type Day = {
  id: number; // 1~7
  title: string; // "의심 신호 탐지"
  goal: string; // 교육 목표
  cases: Case[]; // 6개 (Day 7은 1개)
};

// ===== 플레이 기록 타입 (유저 데이터) =====

export type CaseRecord = {
  caseId: string; // "d1-c1"
  cleared: boolean;
  foundKeyEvidence: boolean;
  bestResponse: boolean;
  stars: number;
};

export type PlayerProgress = {
  nickname: string;
  caseRecords: CaseRecord[];
  unlockedDays: number[]; // Day 단위 잠금
  abilities: Record<Ability, number>;
};