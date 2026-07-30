import type { Episode } from "../../types/types";

const episode1: Episode = {
  id: "ep1",
  title: "이벤트 당첨 피싱 메일",
  startSceneId: "desktop",
  scenes: [
    {
      id: "desktop",
      kind: "desktop",
      notificationText: "📧 새 메일이 도착했습니다",
      goTo: "inbox",
    },
    {
      id: "inbox",
      kind: "inbox",
      emails: [
        {
          id: "mail-1",
          sender: "OO쇼핑몰 이벤트팀",
          subject: "[당첨 안내] 축하드립니다! 고객님이 당첨되셨습니다",
          preview: "20만원 상당의 경품에 당첨되셨습니다. 지금 확인하세요...",
          goTo: "reading",
        },
      ],
    },
    {
      id: "reading",
      kind: "reading",
      sender: "OO쇼핑몰 이벤트팀 <event@oo-shopping-notice.com>",
      subject: "[당첨 안내] 축하드립니다! 고객님이 당첨되셨습니다",
      date: "방금 전",
      body: [
        {
          type: "text",
          value:
            "축하합니다!\n\n고객님께서 20만원 상당의 경품에 당첨되셨습니다.\n경품 수령을 위해 아래 링크에서 본인 확인 정보를 입력해주세요.\n\n",
        },
        {
          type: "link",
          value: "[경품 수령 링크 바로가기]",
          goTo: "fakesite",
        },
        {
          type: "text",
          value: "\n\n※ 정보 미입력 시 당첨이 자동 취소됩니다.",
        },
      ],
      reportGoTo: "dtrc",
    },
    {
      id: "fakesite",
      kind: "fakesite",
      headline: "본인 확인 후 경품을 보내드립니다",
      fields: [
        { label: "이름", placeholder: "예: 홍길동" },
        { label: "휴대폰 번호", placeholder: "숫자만 입력", verify: true },
        {
          label: "계좌번호 (경품 수령 실패 시 환불용)",
          placeholder: "숫자만 입력",
        },
      ],
      submitGoTo: "damage",
      backGoTo: "reading",
    },
    {
      id: "damage",
      kind: "damage",
      events: [
        {
          channel: "sms",
          sender: "은행",
          text: "해외에서 로그인되었습니다.",
        },
        {
          channel: "sms",
          sender: "은행",
          text: "소액결제가 승인되었습니다.",
        },
        {
          channel: "sms",
          sender: "은행",
          text: "계좌에서 50만원이 출금되었습니다.",
        },
      ],
      goTo: "failure",
    },
    {
      id: "failure",
      kind: "failure",
      message: "개인정보가 유출되어 피해가 발생했습니다.",
      hint: "발신자 이메일 주소나 링크 주소를 다시 확인해보세요.",
      restartSceneId: "desktop",
    },
    {
      id: "dtrc",
      kind: "dtrc",
      intro: "이 메일을 신고하시겠습니까?",
      incidentTypes: [
        { label: "피싱", description: "이메일을 이용해 개인정보나 금전을 노리는 사기" },
        { label: "스미싱", description: "문자메시지 속 링크를 이용한 사기" },
        { label: "중고거래 사기", description: "중고거래 플랫폼에서 발생하는 사기" },
      ],
      goTo: "summary",
    },
    {
      id: "summary",
      kind: "summary",
      incidentSummary:
        '이번 사고는 "이벤트 당첨"을 미끼로 한\n피싱 메일이었습니다.',
      whyFooled: [
        "공짜 경품이라는 심리를 이용",
        "실제 쇼핑몰과 비슷한 발신자 주소",
        "정보 미입력 시 취소된다는 긴급성 강조",
      ],
      tips: [
        "발신자 주소 꼼꼼히 확인",
        "공식 앱/사이트로 직접 접속해 확인",
        "의심 메일은 열지 말고 신고",
      ],
      hypotheticalDamage: [
        "해외에서 로그인되었을 수 있습니다.",
        "소액결제가 승인되었을 수 있습니다.",
        "계좌에서 50만원이 출금되었을 수 있습니다.",
      ],
    },
  ],
};

export default episode1;
