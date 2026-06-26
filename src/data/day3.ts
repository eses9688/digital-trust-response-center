import type { Day } from "../types/types";

export const day3: Day = {
  id: 3,
  title: "개인정보 보호",
  goal: "무엇을 제공하면 안 되는지 판단",
  cases: [
    {
      id: "d3-c1",
      title: "자녀 사칭 송금 요청 신고",
      difficulty: "easy",
      category: "가족 사칭 메신저",
      starWeights: ["threatDetection", "response"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "자녀가 메신저로 급하게 돈을 보내달라고 한다며 한 시민이 신고했습니다. 진짜 자녀가 맞는지 판단해 주세요.",
      victim: {
        format: "kakao",
        segments: [
          { kind: "text", text: "[알 수 없음] 엄마~ 나 동훈이. 폰 액정 깨져서 수리 맡기고 임시폰으로 연락해\n" },
          { kind: "text", text: "[알 수 없음] 지금 급하게 결제할 게 있는데 내 카드가 안 돼서 그래\n" },
          { kind: "text", text: "[알 수 없음] 80만원만 먼저 보내줄 수 있어? 이따 바로 줄게\n" },
          { kind: "text", text: "[알 수 없음] 내 계좌는 지금 막혀서, 친구 계좌로 보내줘. 신한 110-***-****** " },
          { kind: "clue", text: "박철수", evidenceId: "ev-account" },
          { kind: "text", text: "\n\n수신 번호: " },
          { kind: "clue", text: "010-5547-2231 (저장 안 된 번호)", evidenceId: "ev-number" },
        ],
      },
      evidences: [
        {
          id: "ev-number",
          title: "발신 번호",
          type: "text",
          content: "저장된 자녀 번호가 아닌 모르는 번호. '폰이 고장나 임시폰'이라는 설명은 번호 변경을 정당화하는 전형적 수법.",
          isKey: true,
        },
        {
          id: "ev-account",
          title: "송금 계좌 명의",
          type: "text",
          content: "계좌 명의가 본인이 아닌 제3자(박철수). '친구 계좌로 보내달라'는 요구는 대포통장을 이용하는 사기의 전형적 신호.",
          isKey: true,
        },
      ],
      choices: [
        { id: "ch-report", text: "송금 전에 자녀에게 직접 전화로 본인 확인하도록 안내하고 사칭 신고", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "수상하니 일단 차단", isCorrect: true, isBest: false, hint: "차단도 필요하지만, 진짜 자녀가 위급할 수도 있으니 '직접 전화로 본인 확인'을 먼저 안내하는 게 핵심이에요." },
        { id: "ch-normal", text: "자녀이니 송금하도록 안내", isCorrect: false, isBest: false, hint: "번호가 평소와 다르고 계좌 명의도 본인이 아니에요. 송금 전 본인 확인이 필요해요." },
      ],
      learning: {
        cardTitle: "청첩장 APK 스미싱",
        summary: ".apk 설치 유도는 악성 앱의 전형",
        realCase: "메신저로 자녀를 사칭해 '폰 고장'을 핑계로 부모에게 송금을 요구하는 수법입니다. 임시폰·낯선 번호로 접근하며, 검증할 틈을 주지 않으려 급박함을 강조합니다.",
        prevention: "1) 송금 전 반드시 알고 있던 번호로 직접 전화해 본인 확인  2) 계좌 명의가 자녀 본인과 일치하는지 확인  3) '급하다'는 압박일수록 한 박자 멈추고 검증",
        reference: "경찰청 메신저 피싱 예방 안내",
      },
    },
  ],
};