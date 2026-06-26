import type { Day } from "../types/types";

export const day1: Day = {
  id: 1,
  title: "의심 신호 탐지",
  goal: "수상한 메시지를 의심하는 습관",
  cases: [
    {
      id: "d1-c1",
      title: "택배 스미싱 의심 신고",
      difficulty: "easy",
      category: "스미싱 문자",
      starWeights: ["threatDetection", "verification"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "한 시민이 택배 배송 관련 문자를 받고 불안하다며 신고했습니다. 링크를 눌러야 할지 판단해 주세요.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "[CJ대한통운] 고객님 주소지 불일치로 상품이 배송 보류 중입니다. 아래 링크에서 주소를 확인해주세요.\n" },
          { kind: "clue", text: "http://cj-delivery-confirm.xyz/track", evidenceId: "ev-url" },
          { kind: "text", text: "\n\n발신: " },
          { kind: "clue", text: "010-3284-9921", evidenceId: "ev-sender" },
        ],
      },
      evidences: [
        {
          id: "ev-sender",
          title: "발신 번호",
          type: "text",
          content: "발신: 010-3284-9921 (개인 휴대폰 번호). 공식 택배사는 개인 번호로 문자를 보내지 않음.",
          isKey: true,
        },
        {
          id: "ev-url",
          title: "링크 URL",
          type: "url",
          content: "공식 도메인(cjlogistics.com)이 아닌 .xyz 사칭 주소.",
          isKey: true,
          meta: { realDomain: "cjlogistics.com", suspiciousPart: ".xyz" },
        },
      ],
      choices: [
        { id: "ch-report", text: "스미싱으로 신고하고 사용자에게 클릭 금지 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "위험 문자로 차단만 함", isCorrect: true, isBest: false, hint: "차단은 맞지만, 사용자에게 '왜 위험한지' 안내하면 더 좋아요." },
        { id: "ch-normal", text: "정상 문자로 판단", isCorrect: false, isBest: false, hint: "발신 번호와 링크 도메인을 다시 확인해 보세요." },
      ],
      learning: {
        realCase: "택배 사칭 스미싱은 가장 흔한 수법입니다. 공식 택배사는 문자에 주소 확인용 외부 링크를 넣지 않으며, 발신도 공식 번호를 씁니다.",
        prevention: "1) 문자 속 링크를 누르지 말 것  2) 발신 번호를 검색해 볼 것  3) 택배는 공식 앱·홈페이지에서 직접 조회할 것",
        reference: "한국인터넷진흥원(KISA) 보호나라 스미싱 안내",
      },
    },
  ],
};