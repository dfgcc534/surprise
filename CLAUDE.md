# 가윤이 생일 게임

## 프로젝트 개요
- 여자친구 생일 선물용 정적 사이트 게임/애니메이션
- 빌드 도구 없이 index.html 단일 파일 또는 step별 파일로 구성
- 외부 라이브러리: NES.css

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

##진행 과정
- 각 step 별로 