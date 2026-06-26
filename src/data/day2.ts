import type { Day } from "../types/types";

export const day2: Day = {
  id: 2,
  title: "출처 검증",
  goal: "공식처럼 보여도 확인하는 습관",
  cases: [
    {
      id: "d2-c1",
      title: "피싱 메일 의심 신고",
      difficulty: "easy",
      category: "피싱 메일",
      starWeights: ["verification", "threatDetection"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "은행에서 온 듯한 '계정 정지 안내' 메일을 받은 시민이 신고했습니다. 첨부된 링크를 눌러야 할지 판단해 주세요.",
      victim: {
        format: "email",
        segments: [
          { kind: "text", text: "보낸사람: 국민은행 <" },
          { kind: "clue", text: "security@kb-star.net", evidenceId: "ev-sender" },
          { kind: "text", text: ">\n제목: [긴급] 계정이 일시 정지되었습니다\n\n고객님의 계정에서 비정상 로그인이 감지되어 정지되었습니다. 24시간 내 아래 링크에서 본인 인증을 완료하지 않으면 계정이 영구 삭제됩니다.\n▶ 본인 인증하기: " },
          { kind: "clue", text: "http://kb-star.net/verify", evidenceId: "ev-url" },
        ],
      },
      evidences: [
        {
          id: "ev-sender",
          title: "발신자 이메일 주소",
          type: "text",
          content: "security@kb-star.net — 국민은행 공식 도메인은 kbstar.com입니다. 'kb-star.net'은 사칭 도메인.",
          isKey: true,
        },
        {
          id: "ev-url",
          title: "링크 도메인",
          type: "url",
          content: "http://kb-star.net/verify — 공식 도메인과 미묘하게 다른 사칭 주소.",
          isKey: true,
          meta: { realDomain: "kbstar.com", suspiciousPart: "kb-star.net" },
        },
      ],
      choices: [
        { id: "ch-report", text: "피싱 메일로 신고하고 사용자에게 링크 클릭 금지 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "스팸 처리만 함", isCorrect: true, isBest: false, hint: "스팸 차단도 맞지만, 같은 수법에 당하지 않도록 사용자 안내가 필요해요." },
        { id: "ch-normal", text: "은행 공식 메일로 판단", isCorrect: false, isBest: false, hint: "발신 도메인을 다시 확인해 보세요. 공식 도메인과 미묘하게 달라요." },
      ],
      learning: {
        cardTitle: "정부지원금 사칭",
        summary: "조건 없는 거액 지급과 긴급 문구는 사기 신호",
        realCase: "금융기관 사칭 피싱 메일은 공식과 거의 똑같은 디자인에, 도메인만 미묘하게 다릅니다(kbstar.com vs kb-star.net). 시간 압박 문구로 판단을 흐립니다.",
        prevention: "1) 발신 도메인을 공식 사이트와 글자 단위로 비교  2) 메일 속 링크 대신 공식 앱·홈페이지로 직접 접속  3) '긴급', '정지', '삭제' 같은 압박 문구를 경계",
        reference: "금융보안원 피싱 메일 대응 안내",
      },
    },
  ],
};