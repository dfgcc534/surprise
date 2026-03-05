# Step 1 — 인트로 선택 화면

## 목표
게임의 첫 화면. 고양이가 등장해 편지 수락 여부를 묻는다.

## 레이아웃
- 전체 화면 중앙 정렬 (flexbox)
- 상단: 고양이 이미지 (캐릭터 영역)
- 하단: Undertale 스타일 대화창 — NES.css `nes-container` 박스, 화면 하단 고정
  - 대화창 안: `*` 접두어 + 타이핑 텍스트
  - 대화창 아래: Y / N 버튼

## 캐릭터
- 이미지: `assets/me/stand_cat.png`
- 크기: 200px 고정
- 등장: 페이드인 애니메이션 (`@keyframes fadeIn`)

## 텍스트
- 초기: `"편지를 받으시겠습니까?"` — 타이핑 효과로 출력
- N 클릭 후: `"...눌러줘"` — 텍스트만 교체 (타이핑 효과)

## 버튼
- `nes-btn is-primary` → `[ Y ]`
- `nes-btn is-error` → `[ N ]`

## 인터랙션
| 액션 | 결과 |
|------|------|
| Y 클릭 | `goToStep(2)` |
| N 클릭 | 텍스트를 `"...눌러줘"` 로 교체 (타이핑 효과), 버튼 유지 |

## 파일
| 파일 | 역할 |
|------|------|
| `index.html` | `#step-1` div 구조 |
| `style.css` | 공통 레이아웃, `fadeIn` / `typing` keyframe |
| `main.js` | `goToStep()`, 전역 상태 `state` |
| `steps/step1.js` | Y/N 이벤트 핸들러, 타이핑 함수 `typeText()` |
