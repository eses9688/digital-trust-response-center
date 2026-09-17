# DTRC (Digital Trust Response Center) 진행 현황

> 중간 점검 면담용 정리 · reboot 브랜치 기준

## 프로젝트 개요
피싱/스미싱 등 디지털 사기 대응을 학습시키는 시나리오형 교육 게임.
Episode(에피소드) 단위로 여러 Scene(씬)을 거치며 선택에 따라 상태가 변하고,
최종적으로 신고/피해 여부와 증거 수집 결과에 따른 엔딩 및 랭크를 보여준다.

## 커밋 이력

| 커밋 | 내용 |
|---|---|
| `dacd42c` | 프로젝트 초기화 (React) |
| `f18fc95` | case 구조 전면 수정 + 대시보드 UI 추가 |
| `c06c656` | 학습 카드 팝업 수정 + 도감(Collection) 최초 도입 |
| `8b3c540` | 기획 전면 개편 — Episode/Scene 구조로 재구현 |
| `f317dba` | 게임 엔진(State/Evidence/Ending) 도입 + 자유 탐색 브라우저 씬 시스템 |
| `4e4c20b` | 엔딩 랭크 시스템 + 학습 카드 도감 기능 추가, 에피소드 1~3 콘텐츠 확장 |

## 최신 커밋(`4e4c20b`) 상세

### 1. 엔딩 랭크(Rank) 시스템
- `src/engine/gameEngine.ts` — `computeRank()` 신설
  - 신고 여부(`reported`), 피해 여부(`damaged`), 증거 수집 비율로 S/A/B/C 산출
  - 미신고 → C, 피해 발생 → B, 증거 80% 이상 → S, 50% 이상 → A
- `src/engine/types.ts` — `Rank` 타입 추가
- `src/scenes/SummarySceneView.tsx` — 엔딩 화면에 랭크, 증거 수집 개수(N/M) 표시
  - 기존 `footprintTrail` 노출 대신 `hypotheticalDamage`(가상 피해 시나리오)로 교체

### 2. 학습 카드 도감(Collection) 기능
- `src/pages/Collection.tsx` (신규) — 수집한 에피소드 학습 카드를 모아보는 도감 화면
- `src/storage/storage.ts` (신규) — `localStorage` 기반 수집 카드 저장/조회
- `src/pages/EpisodePlayer.tsx` — 엔딩 씬 도달 시 `saveCollectedCard()` 호출로 자동 저장
- `src/App.tsx` — `/collection` 라우트 추가

### 3. 씬 타입 확장
- `EpisodePlayer.tsx` — `install` 타입 이펙트 케이스 추가 (악성 앱/파일 설치 시나리오 대응)

### 4. 에피소드 콘텐츠 확장
- `episode1.ts` (+20줄), `episode2.ts` (+83줄), `episode3.ts` (+114줄)
  - 시나리오 분기, 엔딩 조건 등 보강

### 5. 개발 환경
- `vite.config.ts` — 파일 감시 폴링 옵션 추가 (핫리로드 안정화)

## 현재 상태
- 작업 트리 클린 (모든 변경사항 `reboot` 브랜치에 커밋 완료)
- 다음 단계 후보: 도감/랭크 UI 다듬기, 신규 에피소드 추가, 테스트 커버리지 확보
