# 가윤이 생일 게임

## 프로젝트 개요
- 여자친구 생일 선물용 정적 사이트 게임/애니메이션
- 빌드 도구 없이 index.html 단일 파일 또는 step별 파일로 구성
- 외부 라이브러리: NES.css
- 언더테일 디자인

## 게임 흐름 (9 Steps)
- Step 1: 인트로 Y/N 선택 + 내 캐릭터 등장
- Step 2: 본인 확인 경고
- Step 3: 퀴즈 (실패 시 Step 3-F → Step 1 리셋)
- Step 4: 인증 성공 + 편지 전달
- Step 5: 악당 등장 + 편지 탈취
- Step 6: 가윤이 캐릭터 등장
- Step 7: 런 게임
- Step 8: 편지 탈환 + 축하
- Step 9: 편지 오픈 엔딩

## 캐릭터
- 고양이: 나를 표현하는 주인공 캐릭터
- 가윤이: 플레이어 캐릭터 (Step 6~)
- 악당: Step 5 등장

## 컨벤션
- 화면 전환은 JS로 div show/hide
- 애니메이션은 CSS keyframe 우선
- 캐릭터 제외 모든 component/object는 NES.css 고정 사용
- object 구현 전에 NES.css에 비슷한 거 있는지 찾아보고사용

## 파일 구조 (확정 — 변경 금지)
```
/
├── index.html          # 전체 div 구조, NES.css CDN, main.js 로드
├── style.css           # 공통 스타일, CSS 변수, 화면 전환
├── main.js             # 진입점 — 각 step init 함수 호출만
├── utils.js            # goToStep(), state — 모든 step이 여기서 import
├── steps/
│   ├── step1.js ~ step9.js
└── assets/
    ├── me/             # 고양이 캐릭터 이미지
    └── letter.txt

- receipt/stepN.md      # 완성된 step 명세 보관 (참고용)
- stepN.md              # 작업 중인 step 명세 (구현 전 작성, 완성 후 receipt/로 이동)
```


## JS 모듈 컨벤션
- 순환 import 금지: goToStep/state는 반드시 utils.js에서 import
- 각 step 파일은 initStepN() 함수를 export, main.js에서 호출
- NES.css 클래스를 dialog/container에 직접 쓰면 color 충돌 발생 → 커스텀 클래스만 사용
- 각 initStepN()은 반드시 `stepInits[N] = initStepN` 으로 등록 — URL 해시(`index.html#stepN`)로 해당 step 직접 진입 가능
- 공용 유틸: `showGameOver(lines, onDone)` — 게임오버 화면 표시, 어느 step에서든 호출 가능

## CSS 컨벤션
- NES.css 컴포넌트에 color 덮어쓰기 필요 시 커스텀 클래스로 래핑, nes-* 클래스 직접 수정 금지
- 버튼(nes-btn)은 NES.css 그대로 사용 가능
- 배경색: #000, 텍스트: #fff

## 진행 과정
- 각 step 구현 전 stepN.md 명세 작성 → 구현 → 완성 시 receipt/stepN.md로 이동