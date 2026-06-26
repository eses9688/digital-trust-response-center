import type { Day } from "../types/types";

export const day4: Day = {
  id: 4,
  title: "AI와 디지털 조작",
  goal: "눈에 보이는 정보도 검증하기",
  cases: [
    {
      id: "d4-c1",
      title: "딥페이크 투자 광고 신고",
      difficulty: "medium",
      category: "딥페이크",
      starWeights: ["verification", "criticalThinking"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "유명 기업인이 투자를 권유하는 영상이 SNS에 퍼지고 있습니다. 공식 영상과 비교해 진짜인지 판단해 주세요.",
      victim: {
        format: "video",
        compare: {
          left: { label: "공식 채널 인터뷰", caption: "[검증된 공식 유튜브 채널의 인터뷰 영상]", isFake: false },
          right: { label: "문제의 광고 영상", caption: "[익명 계정이 올린 투자 권유 영상]", isFake: true },
          clues: [
            { evidenceId: "ev-lipsync", label: "입모양", normalDesc: "말소리와 입모양이 자연스럽게 일치", fakeDesc: "말소리보다 입모양이 미세하게 늦고 어긋남" },
            { evidenceId: "ev-blink", label: "눈 깜빡임", normalDesc: "자연스러운 간격으로 눈을 깜빡임", fakeDesc: "거의 깜빡이지 않거나 부자연스러운 타이밍" },
          ],
        },
      },
      evidences: [
        { id: "ev-lipsync", title: "입모양 불일치", type: "compare", content: "광고 영상은 음성과 입모양이 어긋남. AI 합성 영상의 대표적 흔적.", isKey: true },
        { id: "ev-blink", title: "부자연스러운 눈 깜빡임", type: "compare", content: "딥페이크는 눈 깜빡임을 자연스럽게 재현하지 못하는 경우가 많음.", isKey: true },
        { id: "ev-source", title: "영상 출처", type: "text", content: "공식 인증 없는 개설 3일 된 익명 계정. 유명인 영상이 공식 채널이 아닌 곳에서 나오면 의심.", isKey: false },
      ],
      choices: [
        { id: "ch-report", text: "딥페이크로 신고하고 확산 방지 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-doubt", text: "의심스럽지만 판단 보류", isCorrect: false, isBest: false, hint: "비교에서 이미 조작 흔적이 확인됐어요. 보류보다 적극적인 신고가 필요해요." },
        { id: "ch-normal", text: "유명인이 나오므로 진짜로 판단", isCorrect: false, isBest: false, hint: "유명인 등장이 곧 진짜는 아니에요. 공식 영상과 비교해 보세요." },
      ],
      learning: {
        cardTitle: "선물하기 사칭",
        summary: "발신자 이름은 누구나 사칭할 수 있다",
        realCase: "유명인을 사칭한 딥페이크 투자 사기가 급증하고 있습니다. AI로 얼굴과 음성을 합성해 신뢰를 악용하며, 입모양·눈 깜빡임 등에서 미세한 흔적이 남습니다.",
        prevention: "1) 공식 채널에 같은 발언이 있는지 교차 확인  2) 입모양·표정의 부자연스러움 관찰  3) '보장된 고수익'은 일단 의심",
        reference: "방송통신위원회 딥페이크 대응 가이드",
      },
    },
  ],
};