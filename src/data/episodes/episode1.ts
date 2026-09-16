import type { Episode } from "../../types/types";

const episode1: Episode = {
  id: "ep1",
  title: "이벤트 당첨 피싱 메일",
  startSceneId: "desktop",
  hubSceneId: "desktop",
  initialState: {
    visitedFakeSite: false,
    personalInfoLeaked: false,
    moneyLost: 0,
    reported: false,
    damaged: false,
  },
  evidence: [
    { id: "suspicious_sender", label: "발신자 주소가 공식 도메인과 다름" },
    { id: "suspicious_url", label: "비정상적인 URL" },
    { id: "personal_info_request", label: "개인정보 입력 요구" },
    { id: "urgency_pressure", label: "긴급성을 강조하는 문구" },
    { id: "no_official_event", label: "공식 사이트에 해당 이벤트 안내 없음" },
    { id: "domain_lookup_warning", label: "주소 검색 시 위험 경고 확인" },
    { id: "verified_business_info", label: "공식 사업자 정보로 실체 확인" },
    { id: "recently_registered_domain", label: "최근 등록된 도메인임을 확인" },
  ],
  scenes: [
    {
      id: "desktop",
      kind: "desktop",
      notificationText: "📧 새 메일이 도착했습니다",
      notificationGoTo: "inbox",
      apps: [
        { icon: "📧", label: "메일", goTo: "inbox" },
        { icon: "🌐", label: "브라우저", goTo: "browser" },
      ],
    },
    {
      id: "browser",
      kind: "browser",
      homeHint: "궁금한 걸 검색해보세요",
      suggestedQueries: ["놋데몰 공식 사이트", "notdemall-notice.com"],
      results: {
        "놋데몰 공식 사이트": {
          items: [
            {
              title: "놋데몰 공식 홈페이지",
              url: "notdemall.co.kr",
              snippet:
                "놋데몰의 공식 온라인 스토어입니다. 진행 중인 이벤트: 여름 세일 20% (경품 당첨 이벤트 안내 없음)",
              targetPageId: "official",
            },
            {
              title: "놋데몰 - 나무위키",
              url: "namu.wiki/w/놋데몰",
              snippet: "놋데몰은 2005년 설립된 온라인 쇼핑몰이다...",
            },
          ],
          effects: {
            evidenceGained: ["no_official_event"],
            footprint: { id: "search-official", label: "검색: 놋데몰 공식 사이트" },
          },
        },
        "notdemall-notice.com": {
          items: [
            {
              title: "⚠ 안전하지 않은 사이트일 수 있습니다",
              url: "notdemall-notice.com",
              snippet:
                "이 주소는 최근 등록되었고 공식 도메인과 다릅니다. 접속 시 개인정보 입력에 주의하세요.",
              targetPageId: "domain-info",
            },
          ],
          effects: {
            evidenceGained: ["domain_lookup_warning"],
            footprint: { id: "search-domain", label: "검색: notdemall-notice.com" },
          },
        },
      },
      pages: {
        official: {
          id: "official",
          url: "notdemall.co.kr",
          title: "놋데몰 공식 홈페이지",
          body: [
            {
              type: "text",
              value:
                "놋데몰 공식 온라인 스토어입니다.\n\n현재 진행 중인 이벤트: 여름 세일 20%\n(경품 당첨 이벤트 관련 안내는 없습니다.)\n\n",
            },
            {
              type: "link",
              value: "[이 업체가 진짜 놋데몰이 맞는지 사업자 정보 확인]",
              targetPageId: "business-info",
            },
          ],
          effects: { footprint: { id: "visited-official", label: "공식 홈페이지 방문 (notdemall.co.kr)" } },
        },
        "business-info": {
          id: "business-info",
          url: "notdemall.co.kr/company",
          title: "놋데몰 사업자 정보",
          body: [
            {
              type: "text",
              value:
                "상호명: (주)놋데몰\n사업자등록번호: 123-45-67890\n통신판매업신고: 2018-서울강남-01234\n대표전화: 1588-0000",
            },
          ],
          effects: {
            evidenceGained: ["verified_business_info"],
            footprint: { id: "visited-business-info", label: "사업자 정보 페이지 방문" },
          },
        },
        "domain-info": {
          id: "domain-info",
          url: "whois-lookup.example/notdemall-notice.com",
          title: "도메인 등록 정보 조회",
          body: [
            {
              type: "text",
              value:
                "도메인: notdemall-notice.com\n등록일: 3일 전\n등록자 정보: 비공개\n\n최근 등록된 도메인은 피싱에 자주 악용됩니다.",
            },
          ],
          effects: {
            evidenceGained: ["recently_registered_domain"],
            footprint: { id: "visited-domain-info", label: "도메인 등록 정보 조회 페이지 방문" },
          },
        },
      },
    },
    {
      id: "inbox",
      kind: "inbox",
      emails: [
        {
          id: "mail-1",
          sender: "놋데몰 이벤트팀",
          subject: "[당첨 안내] 축하드립니다! 고객님이 당첨되셨습니다",
          preview: "20만원 상당의 경품에 당첨되셨습니다. 지금 확인하세요...",
          goTo: "reading",
          effects: { evidenceGained: ["urgency_pressure"] },
        },
      ],
    },
    {
      id: "reading",
      kind: "reading",
      sender: "놋데몰 이벤트팀 <event@notdemall-notice.com>",
      subject: "[당첨 안내] 축하드립니다! 고객님이 당첨되셨습니다",
      date: "방금 전",
      backTo: "inbox",
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
          effects: {
            stateChanges: [{ type: "set", key: "visitedFakeSite", value: true }],
            evidenceGained: ["suspicious_url", "personal_info_request"],
            footprint: { id: "visited-fakesite", label: "가짜 사이트 방문 (notdemall-notice.com)" },
          },
        },
        {
          type: "text",
          value: "\n\n",
        },
        {
          type: "link",
          value: "[발신자 정보 확인]",
          goTo: "sender-check",
          effects: {
            evidenceGained: ["suspicious_sender"],
            footprint: { id: "checked-sender", label: "발신자 정보 확인" },
          },
        },
        {
          type: "text",
          value: "\n\n※ 정보 미입력 시 당첨이 자동 취소됩니다.",
        },
      ],
      reportGoTo: "dtrc",
    },
    {
      id: "sender-check",
      kind: "choice",
      channel: "email",
      sender: "발신자 정보",
      body: [
        {
          type: "text",
          value:
            "발신자 주소: event@notdemall-notice.com\n\n공식 놋데몰 도메인과 다릅니다.",
        },
      ],
      options: [{ id: "back", text: "돌아가기", goTo: "reading" }],
    },
    {
      id: "fakesite",
      kind: "fakesite",
      domain: "notdemall-notice.com",
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
      submitEffects: {
        stateChanges: [
          { type: "set", key: "personalInfoLeaked", value: true },
          { type: "set", key: "damaged", value: true },
        ],
        footprint: { id: "leaked-info", label: "개인정보 입력 (notdemall-notice.com)" },
      },
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
      goTo: "dtrc",
      goToEffects: {
        stateChanges: [{ type: "set", key: "moneyLost", value: 500000 }],
      },
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
      id: "perfect",
      title: "완벽한 대응",
      priority: 1,
      conditions: [
        { key: "visitedFakeSite", op: "eq", value: false },
        { key: "reported", op: "eq", value: true },
      ],
      incidentSummary:
        '의심스러운 이메일을 끝까지 열어보지 않고\n신고해 피해를 예방했습니다.',
      whyFooledLabel: "이 사건의 특징",
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
    },
    {
      id: "late",
      title: "늦은 대응",
      priority: 2,
      conditions: [
        { key: "visitedFakeSite", op: "eq", value: true },
        { key: "personalInfoLeaked", op: "eq", value: false },
        { key: "reported", op: "eq", value: true },
      ],
      incidentSummary:
        '가짜 사이트까지 접속했지만\n정보를 입력하기 전에 빠져나와 피해를 막았습니다.',
      whyFooledLabel: "이 사건의 특징",
      whyFooled: [
        "공짜 경품이라는 심리를 이용",
        "실제 쇼핑몰과 비슷한 발신자 주소",
        "정보 미입력 시 취소된다는 긴급성 강조",
      ],
      tips: [
        "다음부터는 링크를 아예 클릭하지 않는 것이 가장 안전",
        "발신자 주소는 클릭 전에 확인",
        "의심스러우면 공식 채널로 직접 확인",
      ],
    },
    {
      id: "leaked",
      title: "개인정보 유출",
      priority: 3,
      conditions: [{ key: "personalInfoLeaked", op: "eq", value: true }],
      incidentSummary:
        '"이벤트 당첨"을 미끼로 한 피싱에 속아\n개인정보를 입력하고 금전 피해까지 발생했습니다.',
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
    },
  ],
  learningCard: {
    cardTitle: "이벤트 당첨 피싱 메일",
    whyDangerous: [
      "공짜 경품이라는 심리를 이용",
      "실제 쇼핑몰과 비슷한 발신자 주소",
      "정보 미입력 시 취소된다는 긴급성 강조",
    ],
    prevention: [
      "발신자 주소 꼼꼼히 확인",
      "공식 앱/사이트로 직접 접속해 확인",
      "의심 메일은 열지 말고 신고",
    ],
    reference: "출처: 한국인터넷진흥원(KISA) 보호나라, 경찰청 사이버수사국",
  },
};

export default episode1;
