import type { Day } from "../types/types";

export const day1: Day = {
  id: 1,
  title: "의심 신호 탐지",
  goal: "수상한 메시지를 의심하라",
  cases: [
    // ===== Case 1 (튜토리얼): 택배 스미싱 =====
    {
      id: "d1-c1",
      title: "택배 배송 보류 문자",
      difficulty: "easy",
      category: "택배 스미싱",
      starWeights: ["threatDetection", "verification"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "한 시민이 택배 배송 관련 문자를 받고 불안하다며 신고했습니다. 링크를 눌러야 할지 판단해 주세요.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "[CJ대한통운] 고객님 주소지 불일치로 상품이 배송 보류 중입니다. 아래 링크에서 주소를 확인해주세요.\n" },
          { kind: "clue", text: "http://link.ly/cj-track", evidenceId: "ev-url" },
          { kind: "text", text: "\n\n발신: " },
          { kind: "clue", text: "010-3284-9921", evidenceId: "ev-sender" },
        ],
      },
      evidences: [
        { id: "ev-sender", title: "발신 번호", type: "text", content: "발신: 010-3284-9921 (개인 휴대폰 번호). 공식 택배사는 개인 번호로 문자를 보내지 않음.", isKey: true },
        { id: "ev-url", title: "단축 URL", type: "url", content: "link.ly로 시작하는 단축 주소. 진짜 목적지를 숨기는 전형적 수법으로, 공식 택배사는 단축 URL을 쓰지 않음.", isKey: true, meta: { realDomain: "cjlogistics.com", suspiciousPart: "link.ly" } },
      ],
      choices: [
        { id: "ch-report", text: "스미싱으로 신고하고 사용자에게 클릭 금지 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "위험 문자로 차단만 함", isCorrect: true, isBest: false, hint: "차단은 맞지만, 사용자에게 '왜 위험한지' 안내하면 더 좋아요." },
        { id: "ch-normal", text: "정상 문자로 판단", isCorrect: false, isBest: false, hint: "발신 번호와 단축 URL을 다시 확인해 보세요." },
      ],
      learning: {
        cardTitle: "택배 스미싱",
        summary: "단축 URL과 개인 발신번호를 의심하라",
        realCase: "택배 사칭 스미싱은 가장 흔한 수법입니다. 공식 택배사는 문자에 주소 확인용 외부 링크나 단축 URL을 넣지 않으며, 발신도 공식 번호를 씁니다.",
        prevention: "1) 문자 속 링크, 특히 단축 URL을 누르지 말 것  2) 발신 번호를 검색해 볼 것  3) 택배는 공식 앱·홈페이지에서 직접 조회할 것",
        reference: "한국인터넷진흥원(KISA) 보호나라 스미싱 안내",
      },
    },

    // ===== Case 2: 정부지원금 =====
    {
      id: "d1-c2",
      title: "정부지원금 지급 안내 문자",
      difficulty: "easy",
      category: "정부지원금 사칭",
      starWeights: ["threatDetection", "verification"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "'정부지원금 대상자로 선정됐다'는 문자를 받은 시민이 신고했습니다. 진짜 정부 안내인지 판단해 주세요.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "[국민지원금] 축하합니다! 고객님은 긴급 생활지원금 " },
          { kind: "clue", text: "300만원 즉시 지급 대상", evidenceId: "ev-benefit" },
          { kind: "text", text: "으로 선정되었습니다. " },
          { kind: "clue", text: "오늘 18시까지 미신청 시 자동 취소", evidenceId: "ev-urgency" },
          { kind: "text", text: "됩니다.\n신청: " },
          { kind: "clue", text: "http://gov-support24.com", evidenceId: "ev-url" },
        ],
      },
      evidences: [
        { id: "ev-benefit", title: "과도한 혜택", type: "text", content: "조건 없이 '300만원 즉시 지급'. 실제 정부지원금은 자격 심사를 거치며, 문자로 거액을 즉시 약속하지 않음.", isKey: true },
        { id: "ev-urgency", title: "긴급성 문구", type: "text", content: "'오늘 18시까지 미신청 시 취소' — 판단할 시간을 주지 않고 서두르게 만드는 전형적 압박 수법.", isKey: true },
        { id: "ev-url", title: "비공식 주소", type: "url", content: "정부 안내는 gov.kr 도메인을 사용. 'gov-support24.com'은 정부를 사칭한 가짜 주소.", isKey: false, meta: { realDomain: "gov.kr", suspiciousPart: "gov-support24.com" } },
      ],
      choices: [
        { id: "ch-report", text: "스미싱으로 신고하고 정부 안내는 gov.kr에서 확인하도록 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "광고 문자로 차단만 함", isCorrect: true, isBest: false, hint: "차단도 맞지만, 같은 수법에 속지 않도록 '공식 경로 확인'을 안내하면 더 좋아요." },
        { id: "ch-normal", text: "지원금 안내이니 신청하도록 안내", isCorrect: false, isBest: false, hint: "조건 없는 거액 지급과 긴급 문구는 사기 신호예요. 주소도 정부 공식이 아니에요." },
      ],
      learning: {
        cardTitle: "정부지원금 사칭",
        summary: "조건 없는 거액 지급과 긴급 문구는 사기 신호",
        realCase: "정부지원금을 사칭해 가짜 신청 사이트로 유도하고 개인정보·계좌를 탈취하는 수법입니다. 실제 정부지원금은 자격 심사가 있고, 공식 안내는 gov.kr과 정부24를 통해 이뤄집니다.",
        prevention: "1) 조건 없이 거액을 즉시 준다는 문자는 의심  2) '오늘까지'식 긴급 문구에 휘둘리지 말 것  3) 지원금은 gov.kr·정부24 공식 경로에서 직접 확인",
        reference: "행정안전부·KISA 정부지원금 사칭 스미싱 주의 안내",
      },
    },

    // ===== Case 3: 모바일 청첩장 =====
    {
      id: "d1-c3",
      title: "모바일 청첩장 문자",
      difficulty: "medium",
      category: "스미싱 (APK)",
      starWeights: ["threatDetection", "verification"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "지인이 보낸 듯한 모바일 청첩장 문자를 받은 시민이 '앱을 깔라'고 해서 이상하다며 신고했습니다.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "저희 결혼합니다 💍 모바일 청첩장을 확인해 주세요!\n청첩장 보기: " },
          { kind: "clue", text: "http://wedding-invite.cc/inv.apk", evidenceId: "ev-apk" },
          { kind: "text", text: "\n\n발신: " },
          { kind: "clue", text: "010-7782-4413 (저장되지 않은 번호)", evidenceId: "ev-sender" },
        ],
      },
      evidences: [
        { id: "ev-apk", title: "APK 설치 파일", type: "url", content: "링크가 .apk 파일로 끝남. 청첩장을 보는 데 앱 설치는 필요 없음. APK는 악성 앱일 가능성이 높음.", isKey: true, meta: { suspiciousPart: ".apk" } },
        { id: "ev-sender", title: "발신 번호", type: "text", content: "저장되지 않은 모르는 번호. 진짜 지인이라면 보통 저장된 번호로 옴.", isKey: true },
      ],
      choices: [
        { id: "ch-report", text: "악성 앱 유포 스미싱으로 신고하고 절대 설치하지 말라고 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-call", text: "혹시 모르니 지인에게 직접 전화로 확인하라고 안내", isCorrect: true, isBest: false, hint: "본인 확인은 좋은 습관이에요. 다만 .apk 링크는 명백한 악성 신호라 신고까지 안내하면 더 좋아요." },
        { id: "ch-normal", text: "청첩장이니 설치해서 확인하도록 안내", isCorrect: false, isBest: false, hint: "청첩장은 앱 설치가 필요 없어요. .apk 설치 유도는 악성 앱의 전형이에요." },
      ],
      learning: {
        cardTitle: "청첩장 APK 스미싱",
        summary: ".apk 설치 유도는 악성 앱의 전형",
        realCase: "모바일 청첩장·부고장을 사칭해 악성 앱(APK) 설치를 유도하는 스미싱입니다. 설치하면 문자·연락처·금융정보가 탈취되고 추가 스미싱에 악용됩니다.",
        prevention: "1) 청첩장·부고장 링크가 .apk로 끝나면 절대 설치 금지  2) 모르는 번호의 링크는 열지 말 것  3) 출처가 의심되면 발신자에게 직접 전화로 확인",
        reference: "경찰청·KISA 모바일 청첩장 스미싱 주의보",
      },
    },

    // ===== Case 4: 카카오 선물하기 사칭 =====
    {
      id: "d1-c4",
      title: "카카오 선물하기 사칭 문자",
      difficulty: "medium",
      category: "선물하기 사칭",
      starWeights: ["threatDetection", "verification"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "친구가 기프티콘을 보냈다는 문자를 받은 시민이, 평소와 달라 이상하다며 신고했습니다.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "[카카오선물하기] " },
          { kind: "clue", text: "민지", evidenceId: "ev-name" },
          { kind: "text", text: "님이 선물을 보냈습니다 🎁 스타벅스 기프티콘이 도착했어요!\n수락하기: " },
          { kind: "clue", text: "http://kakao-gift.net/receive", evidenceId: "ev-url" },
        ],
      },
      evidences: [
        { id: "ev-name", title: "발신자 이름", type: "text", content: "'민지'라는 이름이 떠도, 실제 카카오 선물하기는 앱 알림으로 오지 문자로 외부 링크를 보내지 않음. 이름은 누구나 사칭 가능.", isKey: true },
        { id: "ev-url", title: "가짜 도메인", type: "url", content: "카카오 공식은 kakao.com 계열. 'kakao-gift.net'은 카카오를 사칭한 가짜 주소.", isKey: true, meta: { realDomain: "kakao.com", suspiciousPart: "kakao-gift.net" } },
      ],
      choices: [
        { id: "ch-report", text: "사칭 스미싱으로 신고하고, 선물은 카카오톡 앱에서 확인하도록 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-call", text: "친구에게 직접 물어보라고 안내", isCorrect: true, isBest: false, hint: "확인은 좋아요. 다만 도메인이 명백히 가짜라 신고까지 안내하면 더 좋아요." },
        { id: "ch-normal", text: "친구 선물이니 링크에서 수락하도록 안내", isCorrect: false, isBest: false, hint: "이름은 사칭할 수 있어요. 도메인이 카카오 공식이 아니에요." },
      ],
      learning: {
        cardTitle: "선물하기 사칭",
        summary: "발신자 이름은 누구나 사칭할 수 있다",
        realCase: "지인 이름을 띄워 신뢰를 얻고 가짜 선물 수락 페이지로 유도해 정보를 탈취하는 수법입니다. 카카오 선물하기는 앱 내 알림으로 전달되며, 문자 속 외부 링크로 수락을 요구하지 않습니다.",
        prevention: "1) 보낸 사람 이름만 믿지 말 것(누구나 입력 가능)  2) 선물·쿠폰은 공식 앱에서 직접 확인  3) 도메인이 공식인지 글자 단위로 비교",
        reference: "카카오·KISA 선물하기 사칭 스미싱 안내",
      },
    },

    // ===== Case 5: 카드 결제 실패 =====
    {
      id: "d1-c5",
      title: "카드 결제 승인 문자",
      difficulty: "medium",
      category: "결제 사칭",
      starWeights: ["threatDetection", "response"],
      starRules: { keyEvidenceNeeded: 2 },
      briefing:
        "'해외에서 고액이 결제됐다'는 문자를 받고 놀란 시민이 신고했습니다. 문구에 적힌 번호로 전화해야 할지 판단해 주세요.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "[신한카드] 해외 결제 승인 " },
          { kind: "clue", text: "USD 1,250 (₩1,680,000)", evidenceId: "ev-amount" },
          { kind: "text", text: "\n본인 결제가 아닐 경우 즉시 신고: " },
          { kind: "clue", text: "1599-8842 (고객센터)", evidenceId: "ev-callback" },
        ],
      },
      evidences: [
        { id: "ev-amount", title: "고액 결제 알림", type: "text", content: "큰 금액으로 불안과 공포를 유발해, 침착하게 확인하기 전에 안내된 번호로 전화하게 만드는 사회공학 기법.", isKey: true },
        { id: "ev-callback", title: "문자 속 연락처", type: "text", content: "문자에 적힌 번호로 전화하면 사기범에게 연결됨. 진짜 카드사 번호는 카드 뒷면·공식 앱에서 확인해야 함.", isKey: true },
      ],
      choices: [
        { id: "ch-official", text: "문자 속 번호 대신 카드 뒷면의 공식 번호로 직접 확인하도록 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "스미싱으로 차단만 함", isCorrect: true, isBest: false, hint: "차단도 맞지만, 실제 결제 여부를 '공식 번호로 확인'하도록 안내하면 더 안전해요." },
        { id: "ch-call", text: "놀랐을 테니 문자 속 고객센터로 전화하도록 안내", isCorrect: false, isBest: false, hint: "문자에 적힌 번호가 함정이에요. 카드사 번호는 카드 뒷면·공식 앱에서 확인해야 해요." },
      ],
      learning: {
        cardTitle: "결제 미끼문자",
        summary: "문자 속 번호 말고 공식 번호로 확인하라",
        realCase: "가짜 해외 결제 문자로 공포를 유발한 뒤, 문자 속 '고객센터' 번호로 전화하게 만들어 보이스피싱으로 연결하는 수법입니다. 이를 미끼 문자라고 합니다.",
        prevention: "1) 결제 문자에 놀라도 문자 속 번호로 전화하지 말 것  2) 카드 뒷면·공식 앱의 번호로 직접 확인  3) 실제 결제 내역은 카드사 앱에서 조회",
        reference: "금융감독원 미끼문자·보이스피싱 주의 안내",
      },
    },

    // ===== Final Case: 해외결제 + 배송조회 복합 =====
    {
      id: "d1-c6",
      title: "해외 결제 + 배송조회 복합 문자",
      difficulty: "hard",
      category: "복합 스미싱",
      starWeights: ["threatDetection", "verification", "criticalThinking"],
      starRules: { keyEvidenceNeeded: 3 },
      briefing:
        "한 시민이 '해외 주문 배송 조회' 문자를 받았는데, 주문한 적이 없다며 신고했습니다. 여러 단서를 종합해 판단해 주세요.",
      victim: {
        format: "sms",
        segments: [
          { kind: "text", text: "[국제배송] 고객님의 해외 주문 " },
          { kind: "clue", text: "USD 980 결제 완료", evidenceId: "ev-amount" },
          { kind: "text", text: ", 통관 보류 상태입니다. " },
          { kind: "clue", text: "24시간 내 미확인 시 자동 반송", evidenceId: "ev-urgency" },
          { kind: "text", text: "됩니다.\n배송조회: " },
          { kind: "clue", text: "http://intl-parcel.io/track.apk", evidenceId: "ev-apk" },
          { kind: "text", text: "\n발신: " },
          { kind: "clue", text: "+63 917-xxx (해외 번호)", evidenceId: "ev-sender" },
        ],
      },
      evidences: [
        { id: "ev-amount", title: "주문하지 않은 결제", type: "text", content: "주문한 적 없는 해외 결제 내역으로 불안을 유발. 결제 사실 자체가 허위인 경우가 많음.", isKey: true },
        { id: "ev-urgency", title: "긴급성 문구", type: "text", content: "'24시간 내 미확인 시 반송' — 침착하게 확인할 시간을 빼앗는 압박.", isKey: true },
        { id: "ev-apk", title: "APK 배송조회 링크", type: "url", content: "배송조회 링크가 .apk 설치 파일. 조회에 앱 설치는 불필요하며 악성 앱일 가능성이 높음.", isKey: true, meta: { suspiciousPart: ".apk" } },
        { id: "ev-sender", title: "해외 발신 번호", type: "text", content: "+63(필리핀 등) 해외 번호. 국내 택배·통관 안내가 해외 번호로 오는 것은 비정상.", isKey: false },
      ],
      choices: [
        { id: "ch-report", text: "복합 스미싱으로 신고하고 링크 클릭·앱 설치 절대 금지 안내", isCorrect: true, isBest: true, hint: "" },
        { id: "ch-block", text: "위험 문자로 차단만 함", isCorrect: true, isBest: false, hint: "차단도 맞지만, 여러 위험 신호가 겹친 사건이라 신고와 함께 상세 안내가 필요해요." },
        { id: "ch-normal", text: "배송 문제일 수 있으니 조회 링크를 확인하도록 안내", isCorrect: false, isBest: false, hint: "주문하지 않은 결제, 긴급 문구, .apk 링크, 해외 번호까지 — 위험 신호가 한꺼번에 겹쳐 있어요." },
      ],
      learning: {
        cardTitle: "복합 스미싱",
        summary: "여러 위험 신호가 겹치면 거의 확실한 사기",
        realCase: "여러 수법을 결합한 복합 스미싱입니다. 가짜 해외 결제로 불안을 주고, 긴급 문구로 서두르게 한 뒤, 배송조회를 빙자해 악성 앱(APK) 설치를 유도합니다. 하나만 봐도 의심스럽지만 여러 신호가 동시에 나타나면 거의 확실한 사기입니다.",
        prevention: "1) 주문한 적 없는 결제·배송 문자는 무시  2) 긴급 문구에 휘둘리지 말 것  3) .apk 설치 유도와 해외 발신 번호는 강한 위험 신호  4) 택배·통관은 공식 앱·홈페이지에서 직접 조회",
        reference: "관세청·KISA 국제배송 사칭 스미싱 주의보",
      },
    },
  ],
};