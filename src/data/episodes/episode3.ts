import type { Episode } from "../../types/types";

const episode3: Episode = {
  id: "ep3",
  title: "건강검진 결과 스미싱",
  startSceneId: "sms-arrive",
  scenes: [
    {
      id: "sms-arrive",
      kind: "choice",
      channel: "sms",
      sender: "건강검진센터",
      body: [
        {
          type: "text",
          value:
            "[건강검진센터]\n귀하의 건강검진 결과가 등록되었습니다.\n결과 확인을 위해 아래 링크를 이용해주세요.\n\n",
        },
        { type: "link", value: "http://health-result.kr", goTo: "fakesite" },
      ],
      options: [
        { id: "check-org", text: "기관 확인", goTo: "org-check" },
        { id: "delete", text: "삭제", goTo: "dtrc-safe" },
      ],
    },
    {
      id: "org-check",
      kind: "choice",
      channel: "app",
      sender: "발신기관 조회",
      body: [
        { type: "text", value: "이 번호는 공식 건강검진기관 안내와 다릅니다." },
      ],
      options: [
        { id: "block", text: "차단", goTo: "dtrc-safe" },
        { id: "report", text: "신고", goTo: "dtrc-safe" },
      ],
    },
    {
      id: "fakesite",
      kind: "fakesite",
      domain: "health-result.kr",
      headline: "본인 확인을 위해 인증이 필요합니다",
      fields: [
        { label: "이름", placeholder: "예: 홍길동" },
        { label: "생년월일", placeholder: "예: 19900101" },
      ],
      submitGoTo: "apk-lure",
      backGoTo: "sms-arrive",
    },
    {
      id: "apk-lure",
      kind: "choice",
      channel: "app",
      sender: "건강검진 결과 조회",
      body: [
        {
          type: "text",
          value:
            "결과 확인이 완료되었습니다.\n\n전용 앱을 설치하시면 검진 결과를 더 편리하게 확인하실 수 있습니다.\n\n",
        },
        {
          type: "link",
          value: "[건강검진 앱 설치 링크]",
          goTo: "apk-install-prompt",
        },
      ],
      options: [
        { id: "skip", text: "설치 없이 계속하기", goTo: "dtrc-safe" },
      ],
    },
    {
      id: "apk-install-prompt",
      kind: "choice",
      channel: "app",
      sender: "파일 다운로드",
      body: [
        {
          type: "text",
          value: "파일명: Health_Result.apk\n\n주의: 출처를 알 수 없는 앱입니다.",
        },
      ],
      options: [
        { id: "install", text: "설치", goTo: "installing" },
        { id: "cancel", text: "취소", goTo: "dtrc-safe" },
      ],
    },
    {
      id: "installing",
      kind: "install",
      appName: "Health_Result.apk",
      goTo: "apk-permission",
    },
    {
      id: "apk-permission",
      kind: "choice",
      channel: "app",
      sender: "앱 권한 요청",
      body: [{ type: "text", value: "전화\n문자\n주소록\n\n허용하시겠습니까?" }],
      options: [{ id: "allow", text: "허용", goTo: "damage" }],
    },
    {
      id: "damage",
      kind: "damage",
      events: [
        {
          channel: "sms",
          sender: "인증",
          text: "인증번호 요청: 123456",
        },
        {
          channel: "app",
          sender: "시스템",
          text: "알 수 없는 앱이 자꾸 저절로 실행됩니다.",
        },
        {
          channel: "sms",
          sender: "시스템",
          text: "오늘 하루에만 스팸 문자가 30건 넘게 발송되었습니다.",
        },
      ],
      goTo: "judge-quiz",
    },
    {
      id: "judge-quiz",
      kind: "quiz",
      question:
        "악성 앱 때문에 앱이 제멋대로 실행되고 스팸 문자가 쏟아진다.\n지금 가장 먼저 해야 할 행동은?",
      wrongFeedback: "더 시급한 조치가 필요해요. 다시 생각해보세요.",
      options: [
        {
          id: "delete-app",
          text: "① 앱 삭제",
          correct: true,
          goTo: "response",
        },
        { id: "keep-using", text: "② 계속 사용", correct: false, goTo: "" },
        {
          id: "ask-family",
          text: "③ 가족에게 도움 요청",
          correct: false,
          goTo: "",
        },
        { id: "report-first", text: "④ DTRC 신고", correct: false, goTo: "" },
      ],
    },
    {
      id: "response",
      kind: "response",
      actions: [
        { id: "change-password", label: "비밀번호 변경" },
        { id: "check-finance", label: "금융기관 확인" },
      ],
      goTo: "dtrc-recovered",
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
      goTo: "summary-safe",
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
      damageTypes: ["악성 앱 설치", "개인정보 유출"],
      goTo: "summary-recovered",
    },
    {
      id: "summary-safe",
      kind: "summary",
      incidentSummary: "범인은 당신의 건강 걱정을 이용했습니다.",
      whyFooled: [
        "건강검진기관을 사칭",
        "결과가 궁금한 불안 심리를 이용",
        "출처 불명의 앱 설치를 유도",
      ],
      tips: [
        "기관은 문자 링크로 결과를 제공하지 않음",
        "출처 불명의 앱 설치 금지",
        "앱 설치 전 요청 권한 확인",
      ],
      hypotheticalDamage: [
        "본인 명의로 인증번호가 요청되어 명의도용에 악용될 수 있습니다.",
        "악성 앱이 설치되어 제멋대로 실행될 수 있습니다.",
        "내 번호로 대량의 스팸 문자가 발송될 수 있습니다.",
      ],
    },
    {
      id: "summary-recovered",
      kind: "summary",
      incidentSummary: "범인은 당신의 건강 걱정을 이용했습니다.",
      whyFooled: [
        "건강검진기관을 사칭",
        "결과가 궁금한 불안 심리를 이용",
        "출처 불명의 앱 설치를 유도",
      ],
      tips: [
        "기관은 문자 링크로 결과를 제공하지 않음",
        "출처 불명의 앱 설치 금지",
        "앱 설치 전 요청 권한 확인",
      ],
    },
  ],
};

export default episode3;
