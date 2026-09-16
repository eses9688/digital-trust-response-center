import type { Episode } from "../../types/types";

const episode2: Episode = {
  id: "ep2",
  title: "택배 배송조회 스미싱",
  startSceneId: "sms-arrive",
  initialState: {
    damaged: false,
    reported: false,
  },
  evidence: [
    { id: "wrong_sender_number", label: "발신번호가 공식 택배사 안내와 다름" },
    { id: "fake_url", label: "정식 도메인이 아닌 배송조회 링크" },
    { id: "personal_info_request", label: "과도한 개인정보(주소·전화번호) 요구" },
  ],
  scenes: [
    {
      id: "sms-arrive",
      kind: "choice",
      channel: "sms",
      sender: "발신번호 unknown",
      body: [
        {
          type: "text",
          value:
            "[배송 안내]\n고객님의 택배가 배송 예정입니다.\n주소 정보 오류로 인해 배송이 보류되었습니다.\n아래 링크에서 배송지를 확인해주세요.\n\n",
        },
        {
          type: "link",
          value: "http://delivery-check.kr",
          goTo: "fakesite",
          effects: {
            evidenceGained: ["fake_url", "personal_info_request"],
            footprint: { id: "visited-fakesite", label: "가짜 사이트 방문 (delivery-check.kr)" },
          },
        },
      ],
      options: [
        {
          id: "check-sender",
          text: "보낸 번호 확인",
          goTo: "sender-check",
          effects: {
            evidenceGained: ["wrong_sender_number"],
            footprint: { id: "checked-sender", label: "발신번호 확인" },
          },
        },
        { id: "delete", text: "삭제하기", goTo: "dtrc-safe" },
      ],
    },
    {
      id: "sender-check",
      kind: "choice",
      channel: "app",
      sender: "발신번호 조회",
      body: [
        {
          type: "text",
          value: "발신번호: 010-XXXX-XXXX\n\n공식 택배사 번호와 일치하지 않습니다.",
        },
      ],
      options: [
        { id: "block", text: "차단", goTo: "dtrc-safe" },
        { id: "report", text: "신고", goTo: "dtrc-safe" },
      ],
    },
    {
      id: "fakesite",
      kind: "fakesite",
      domain: "delivery-check.kr",
      headline: "배송을 계속하려면 본인 확인이 필요합니다",
      fields: [
        { label: "이름", placeholder: "예: 홍길동" },
        { label: "전화번호", placeholder: "숫자만 입력" },
        { label: "주소", placeholder: "예: 서울시 ..." },
      ],
      submitGoTo: "damage",
      submitEffects: {
        stateChanges: [{ type: "set", key: "damaged", value: true }],
        footprint: { id: "submitted-info", label: "개인정보 입력 (delivery-check.kr)" },
      },
      backGoTo: "sms-arrive",
    },
    {
      id: "damage",
      kind: "damage",
      events: [
        {
          channel: "sms",
          sender: "은행",
          text: "새로운 기기에서 로그인이 시도되었습니다.",
        },
        {
          channel: "call",
          sender: "스팸 의심",
          text: "모르는 번호로 스팸 전화가 계속 걸려옵니다.",
        },
        {
          channel: "app",
          sender: "쇼핑몰 알림",
          text: "입력한 정보로 다른 쇼핑몰에서도 회원가입이 시도되었습니다.",
        },
      ],
      goTo: "judge-quiz",
    },
    {
      id: "judge-quiz",
      kind: "quiz",
      question: "현재 가장 먼저 해야 할 행동은?",
      wrongFeedback: "그 대응으로는 피해를 막을 수 없어요. 다시 생각해보세요.",
      options: [
        { id: "wait", text: "① 그냥 기다린다", correct: false, goTo: "" },
        {
          id: "revisit",
          text: "② 링크에 다시 접속한다",
          correct: false,
          goTo: "",
        },
        {
          id: "change-password",
          text: "③ 비밀번호 변경 및 신고한다",
          correct: true,
          goTo: "dtrc-recovered",
        },
        {
          id: "delete-only",
          text: "④ 문자만 삭제한다",
          correct: false,
          goTo: "",
        },
      ],
    },
    {
      id: "dtrc-safe",
      kind: "dtrc",
      intro: "이 문자를 신고하시겠습니까?",
      incidentTypes: [
        { label: "스미싱", description: "문자메시지 속 링크를 이용한 사기" },
        { label: "피싱", description: "이메일을 이용해 개인정보나 금전을 노리는 사기" },
        { label: "중고거래 사기", description: "중고거래 플랫폼에서 발생하는 사기" },
      ],
      goTo: "ending",
      reportEffects: {
        stateChanges: [{ type: "set", key: "reported", value: true }],
        footprint: { id: "reported", label: "DTRC에 신고함" },
      },
    },
    {
      id: "dtrc-recovered",
      kind: "dtrc",
      intro: "이 문자를 신고하시겠습니까?",
      incidentTypes: [
        { label: "스미싱", description: "문자메시지 속 링크를 이용한 사기" },
        { label: "피싱", description: "이메일을 이용해 개인정보나 금전을 노리는 사기" },
        { label: "중고거래 사기", description: "중고거래 플랫폼에서 발생하는 사기" },
      ],
      damageTypes: ["개인정보 입력", "의심 링크 접속"],
      goTo: "ending",
      reportEffects: {
        stateChanges: [{ type: "set", key: "reported", value: true }],
        footprint: { id: "reported", label: "DTRC에 신고함" },
      },
    },
    {
      id: "ending",
      kind: "ending",
    },
  ],
  endings: [
    {
      id: "safe",
      title: "안전한 대응",
      priority: 1,
      conditions: [
        { key: "damaged", op: "eq", value: false },
        { key: "reported", op: "eq", value: true },
      ],
      incidentSummary:
        '이번 사고는 "택배 배송 지연"을 미끼로 한\n스미싱 문자였습니다.',
      whyFooled: [
        "실제 택배를 기다리는 심리를 이용",
        "배송 보류라는 긴급성 강조",
        "가짜 사이트로 유도",
      ],
      tips: [
        "문자 속 링크는 클릭 전 주소부터 확인",
        "택배사는 문자 링크로 개인정보를 요구하지 않음",
        "의심스러운 문자는 신고",
      ],
      hypotheticalDamage: [
        "새로운 기기에서 로그인이 시도되었을 수 있습니다.",
        "모르는 번호로 스팸 전화가 계속 걸려왔을 수 있습니다.",
        "입력한 정보로 다른 사이트에서도 회원가입이 시도되었을 수 있습니다.",
      ],
    },
    {
      id: "recovered",
      title: "피해 복구 대응",
      priority: 2,
      conditions: [
        { key: "damaged", op: "eq", value: true },
        { key: "reported", op: "eq", value: true },
      ],
      incidentSummary:
        '이번 사고는 "택배 배송 지연"을 미끼로 한\n스미싱 문자였습니다.',
      whyFooled: [
        "실제 택배를 기다리는 심리를 이용",
        "배송 보류라는 긴급성 강조",
        "가짜 사이트로 유도",
      ],
      tips: [
        "문자 속 링크는 클릭 전 주소부터 확인",
        "택배사는 문자 링크로 개인정보를 요구하지 않음",
        "의심스러운 문자는 신고",
      ],
    },
  ],
  learningCard: {
    cardTitle: "택배 배송조회 스미싱",
    whyDangerous: [
      "실제 택배를 기다리는 심리를 이용",
      "배송 보류라는 긴급성 강조",
      "가짜 사이트로 유도",
    ],
    prevention: [
      "문자 속 링크는 클릭 전 주소부터 확인",
      "택배사는 문자 링크로 개인정보를 요구하지 않음",
      "의심스러운 문자는 신고",
    ],
    reference: "출처: 한국인터넷진흥원(KISA) 보호나라, 경찰청 사이버수사국",
  },
};

export default episode2;
