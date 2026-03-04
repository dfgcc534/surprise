# 🎮 가윤이 생일 게임 — Plan

## 기술 스택
- **HTML/CSS/JS** (빌드 도구 없음, 정적 사이트)
- **NES.css** (CDN) — 픽셀 UI 컴포넌트 및 기본 스프라이트 활용
- **파일 구조**: `index.html` + step별 `.js` 모듈

---

## 파일 구조

```
/
├── index.html         # 전체 화면 div 포함, NES.css CDN, 모듈 로드
├── style.css          # 공통 스타일, CSS 변수, 화면 전환 유틸
├── main.js            # 진입점 — 상태 관리, 화면 전환 함수
├── steps/
│   ├── step1.js       # 인트로 선택 화면
│   ├── step2.js       # 본인 확인 경고
│   ├── step3.js       # 퀴즈 + 실패(3-F)
│   ├── step4.js       # 인증 성공 + 편지 전달
│   ├── step5.js       # 악당 등장 + 편지 탈취
│   ├── step6.js       # 가윤이 캐릭터 등장
│   ├── step7.js       # 런 게임
│   ├── step8.js       # 편지 탈환 + 축하
│   └── step9.js       # 편지 오픈 엔딩
└── assets/
    └── letter.txt     # 편지 내용 (별도 관리)
```

---

## 공통 기반 (Phase 0) — 가장 먼저 구현

### 상태 관리 (`main.js`)
```js
const state = {
  currentStep: 1,
  quizIndex: 0,
  quizPassed: false,
};
```

### 화면 전환 함수 (`main.js`)
- `goToStep(n)` — 현재 화면 숨기고 step n 화면 보여주기
- 각 step div는 `id="step-{n}"`, 기본 `display: none`
- 활성 step만 `display: block`

### 공통 CSS 변수 (`style.css`)
```css
:root {
  --bg: #212529;
  --text: #fff;
  --accent: #e76f51; /* 포인트 컬러 */
}
```

### index.html 구조
- NES.css CDN 링크
- Press Start 2P 폰트 (Google Fonts)
- 각 step별 `<div id="step-{n}" class="screen">` 컨테이너
- 모든 step .js 모듈 `<script type="module">` 로드

---

## Step별 구현 명세

### Step 1. 인트로 선택 화면
**목표**: Y/N 선택으로 게임 시작
- NES.css `nes-container` 박스 중앙 배치
- 텍스트: `"편지를 받으시겠습니까?"`
- NES.css 버튼 2개: `[Y]` `[N]`
- Y 클릭 → `goToStep(2)`
- N 클릭 → 고양이 스프라이트가 슬퍼하는 텍스트 출력 ("...눌러줘")
- 고양이 스프라이트: `<i class="nes-chick">` 또는 `nes-mario` 등 선택

---

### Step 2. 본인 확인 경고 화면
**목표**: 긴장감 연출 후 퀴즈로 넘어가기
- 텍스트: `"잠깐!"` → 1초 후 `"네가 내 여친이 맞는지 확인해야겠어"` 타이핑 효과
- 고양이 스프라이트가 손 내미는 포즈 (CSS transform으로 강조)
- NES.css `is-warning` 스타일 컨테이너
- 2.5초 후 자동으로 `goToStep(3)`

---

### Step 3. 퀴즈 화면
**목표**: 가윤이만 아는 질문으로 본인 인증
- 퀴즈 데이터 배열 (`step3.js` 내 하드코딩)
  ```js
  const quizzes = [
    { q: "우리가 처음 만난 장소는?", a: "정답" },
    { q: "내 고양이 이름은?", a: "정답" },
    // ...
  ];
  ```
- NES.css `nes-input` 텍스트 입력 or 객관식 버튼
- 정답 → 다음 문제, 전부 통과 시 `goToStep(4)`
- 오답 → `goToStep('3f')`

#### Step 3-F. 실패 화면
- 텍스트: `"어딜 속이려고!!"`
- 고양이 스프라이트 + CSS animation으로 총 쏘는 연출 (shake + flash)
- `YOU DIED` 텍스트 — NES.css `is-error` 스타일, 화면 전체 빨간 flash
- 2초 후 `goToStep(1)` + `state` 초기화

---

### Step 4. 인증 성공 + 편지 전달 화면
**목표**: 성공 연출 + 편지 건네기
- 텍스트: `"너가 맞구나! 😊"`
- NES.css `is-success` 스타일 컨테이너
- 고양이 스프라이트가 편지 아이콘(`nes-icon heart` 또는 커스텀)을 건네는 CSS 애니메이션
- 편지 아이콘 클릭 or 2초 후 → `goToStep(5)`

---

### Step 5. 악당 등장 + 편지 탈취 화면
**목표**: 반전 연출 — 악당이 나타나 편지를 빼앗아 감
- 악당 스프라이트 화면 오른쪽에서 슬라이드 인 (CSS `@keyframes slideIn`)
- 텍스트: `"가윤이는 내 꺼야!!!"`  — NES.css `is-error` 말풍선
- 편지 아이콘이 악당 쪽으로 이동하는 애니메이션
- 고양이 스프라이트 `nes-octocat` 또는 커스텀 — 우는 표정 (CSS filter)
- 텍스트: `"으아아..."`
- 2초 후 → `goToStep(6)`

---

### Step 6. 가윤이 캐릭터 등장 화면
**목표**: 가윤이 캐릭터가 구출 선언
- 가윤이 스프라이트 등장 (NES.css 여성 캐릭터 or `nes-bulbasaur` 등 선택)
- 텍스트: `"내가 찾아줄게!"` — NES.css 말풍선 `nes-balloon`
- 버튼: `[출발!]` 클릭 → `goToStep(7)`

---

### Step 7. 런 게임 화면
**목표**: 가윤이가 악당을 쫓는 미니게임
- **구현 방식**: Canvas 또는 CSS 애니메이션 기반 사이드스크롤
- 가윤이 캐릭터가 오른쪽으로 이동, 장애물 회피 (스페이스바 점프)
- 악당이 화면 오른쪽 끝에 위치, 일정 거리 이상 이동하면 클리어
- 목숨 3개 (`nes-icon heart is-small` x3)
- 게임오버 시 재시작 버튼
- 클리어 → `goToStep(8)`

**기술 메모**:
- `requestAnimationFrame` 루프
- 충돌 감지: AABB (축 정렬 경계 박스)
- 장애물 생성: `setInterval`로 랜덤 간격

---

### Step 8. 편지 탈환 + 축하 화면
**목표**: 클라이맥스 — 축하 연출
- 가윤이가 편지를 들어올리는 애니메이션 (bounce + scale)
- 조연 캐릭터들 순서대로 등장 (CSS `animation-delay` 순차 적용)
- NES.css `nes-container is-rounded` 말풍선들로 축하 메시지
- 화면 상단에서 별/하트 confetti 낙하 (CSS `@keyframes fall`)
- 3초 후 or 버튼 클릭 → `goToStep(9)`

---

### Step 9. 편지 오픈 엔딩
**목표**: 편지 열기 + 실제 편지 내용 표시
- 편지 봉투 이미지/이모지가 중앙에 위치
- 클릭 시 봉투 열리는 CSS 애니메이션 (rotateX flip)
- 편지 내용 타이핑 효과로 한 글자씩 출력
- 마지막 줄: `"생일 축하해 🎂"` + NES.css 하트 아이콘
- 끝 — 재시작 버튼 선택적으로 추가

---

## 구현 순서 (권장)

| 순서 | 작업 | 비고 |
|------|------|------|
| 1 | Phase 0: 공통 기반 | index.html, style.css, main.js |
| 2 | Step 1 | 가장 단순, 전환 테스트 겸용 |
| 3 | Step 2 | 타이핑 효과 유틸 구현 |
| 4 | Step 3 + 3-F | 퀴즈 데이터 채워넣기 필요 |
| 5 | Step 4 | 애니메이션 패턴 확립 |
| 6 | Step 5, 6 | 연속 컷씬 |
| 7 | Step 7 | 런 게임 (가장 복잡) |
| 8 | Step 8 | confetti 연출 |
| 9 | Step 9 | 편지 내용 채워넣기 필요 |

---

## 채워넣어야 할 내용 (개발 전 준비)

- [ ] 퀴즈 문제 및 정답 (Step 3)
- [ ] 사용할 NES.css 스프라이트 확정 (고양이, 가윤이, 악당, 조연)
- [ ] 편지 내용 (Step 9)
- [ ] 포인트 컬러 확정
